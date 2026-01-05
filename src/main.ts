import express, {text, type RequestHandler, json} from "express";
import createHttpError from "http-errors";
import allNetRouter from "./routes/allnet.router.ts";
import {log} from "./utils/general.ts";
import {AimedbServlette} from "./modules/aimedb.ts";
import chu3Router from "./routes/chu3.router.ts";
import zlib from "node:zlib";
import chalk from "chalk";
import connectDB from "./modules/mongoose.ts";
import {config} from "./config/config.ts";
import gekiRouter from "./routes/geki.router.ts";
import chu3CMRouter from "./routes/chu3cm.router.ts";
import cmRouter from "./routes/cm.router.ts";
import gekiCMRouter from "./routes/gekicm.router.ts";
import {CHU3VERSIONS, MAIVERSIONS} from "./games/chu3/config.ts";
import mai2Router from "./routes/mai2.router.ts";
import mai2CMRouter from "./routes/mai2cm.router.ts";
import apiRouter from "./routes/api.router.ts";
import errorMiddleware from "./middleware/error.ts";
import cors from "cors";
import {toNodeHandler} from "better-auth/node";
import {auth} from "./utils/auth.ts";
import {redisClient} from "./modules/redis.ts";
import sdvxRouter from "./routes/sdvx.router.ts";
import { parseString} from "xml2js";
import {to_xml} from "@kamyu/kbinxml";
import {decodeKNMXML, encodeKNMXML} from "./utils/sdvx.ts";

// JSON
declare global {
    interface BigInt {
        toJSON(): number;
    }
}

BigInt.prototype.toJSON = function () {
	return Number(this);
};

const app = express();

connectDB();

redisClient.keys("cache:*").then(keys => {
	if (keys.length > 0) {
		redisClient.del(keys);
		log("redis", `Cleared ${keys.length} cache keys on startup`);
	}
});

const gameEndpointMiddleware: RequestHandler = async (req, res, next) => {
	const game = req.originalUrl.split("/")[2];
	const ver = req.originalUrl.split("/")[3];
	const relevantUrl = req.originalUrl.split("/")[req.originalUrl.split("/").length - 1] || "";

	req.headers["gameVersion"] = ver;

	log("gamePath", `[${game}] -> /${relevantUrl}`);
	console.debug(chalk.yellow(`>>> ${JSON.stringify(req.body)}`));

	const originalSend = res.send.bind(res);

	res.send = (body) => {
		log("game", `<<< ${body}`);

		let buffer;

		if (Buffer.isBuffer(body)) {
			buffer = body;
		} else if (typeof body === "string") {
			buffer = Buffer.from(body, "utf-8");
		} else {
			buffer = Buffer.from(JSON.stringify(body), "utf-8");
		}

		const zipped = zlib.deflateSync(buffer);

		res.setHeader("Content-Type", "application/octet-stream");

		return originalSend(zipped);
	};

	next();
};

const KNMEndpointMiddleware: RequestHandler = (req, res, next) => {
	log("gamePath", req.originalUrl);

	const bodyChunks: Uint8Array[] = [];
	req.on("data", (chunk) => {
		bodyChunks.push(chunk);
	});

	req.on("end", () => {
		const realBody = Buffer.concat(bodyChunks);

		const xeamInfo = req.headers["x-eamuse-info"];

		if(xeamInfo) {
			const [, hexTime, hexPrng] = (xeamInfo as string).split("-");

			const compressed = req.header("x-compress") || "none";

			if (bodyChunks.length > 0) {
				const decodedXml = decodeKNMXML(realBody.toString("base64"), compressed, hexTime as string, hexPrng as string);

				req.body = {};
				parseString(decodedXml, {explicitArray: false, explicitRoot: false}, (err, result) => {
					if (err) {
						log("error", `Error parsing XML: ${err.message}`);
						req.body = {};
					} else {
						req.body = result;
						log("game", `>>> ${JSON.stringify(req.body)}`);
					}
				});
			}

			return next();
		}else{
			if (bodyChunks.length > 0) {
				const decodedXml = to_xml(realBody);

				req.body = {};
				parseString(decodedXml.data, {explicitArray: false, explicitRoot: false}, (err, result) => {
					if (err) {
						log("error", `Error parsing XML: ${err.message}`);
						req.body = {};
					} else {
						req.body = result;
						log("game", `>>> ${JSON.stringify(req.body)}`);
					}
				});
			}

			return next();
		}
	});

	const originalSend = res.send.bind(res);

	let sent = false;

	res.send = (body) => {
		if (sent) {
			return originalSend(body);
		}

		if(!req.query.f?.toString().includes("common") && !req.query.f?.toString().includes("shop")) {
			log("game", `<<< ${body}`);
		}

		const encrypt = !!req.header("x-eamuse-info");
		const compress = req.header("x-compress") || "none";
		res.setHeader("User-Agent", "EAMUSE.Httpac/1.0");

		const encoded = encodeKNMXML(req, res, body, compress as string, encrypt);

		sent = true;

		return originalSend(encoded.data);
	};
};

const allNetEndpointMiddleware: RequestHandler = (req, _, next) => {
	log("allnet", req.originalUrl);
	next();
};

app.use("/", (req, res, next) => {
	if (req.originalUrl === "/") {
		return res.redirect(config.WEBUI_URL);
	}
	next();
});

// Routers
app.use("/sys/", allNetEndpointMiddleware, text({type: "*/*"}), allNetRouter);

// Games
app.use("/g/chu3/:ver/", json({limit: "50mb"}), gameEndpointMiddleware, (req, res, next) => {
	const ver = req.params.ver!;

	const gameVersion = CHU3VERSIONS.find(v => v.roms.includes(ver));

	if (!gameVersion) {
		log("error", `Invalid game version: ${ver}`);
		return res.status(400).send("Invalid game version");
	}

	req.headers["gameVersion"] = `${gameVersion.index}`;

	next();
}, chu3Router);
app.use("/g/cmchu3/:ver/", json({limit: "50mb"}), gameEndpointMiddleware, chu3CMRouter);
app.use("/g/ongeki/:ver/", json({limit: "50mb"}), gameEndpointMiddleware, gekiRouter);
app.use("/g/cmongeki/:ver/", json({limit: "50mb"}), gameEndpointMiddleware, gekiCMRouter);
app.use("/g/mai2/:ver/", json({limit: "50mb"}), gameEndpointMiddleware, (req, res, next) => {
	const ver = req.params.ver!;

	const gameVersion = MAIVERSIONS.find(v => v.roms.includes(ver));

	if (!gameVersion) {
		log("error", `Invalid game version: ${ver}`);
		return res.status(400).send("Invalid game version");
	}

	req.headers["gameVersion"] = `${gameVersion.index}`;

	next();
},
mai2Router);
app.use("/g/cmmai2/:ver/", json({limit: "50mb"}), gameEndpointMiddleware, mai2CMRouter);
app.use("/g/card/", json({limit: "50mb"}), gameEndpointMiddleware, cmRouter);

app.use("/g/sdvx", json({limit: "50mb"}), KNMEndpointMiddleware, sdvxRouter);

app.use(cors({origin: ["http://localhost:5173", config.WEBUI_URL], credentials: true}));

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use("/api", json({limit: "10mb"}), apiRouter, errorMiddleware);

app.use(function (_, __, next) {
	log("error", `404: ${_.originalUrl}`);

	next(createHttpError(404, "Not Found"));
});

// Error Handler
// app.use(errorMiddleware);

app.listen(80, () => {
	log("allnet", "Started on port 80");

	new AimedbServlette({
		aimedb: {
			listen_address: "0.0.0.0",
			loglevel: "info",
			port: 22345,
			key: config.AIME_KEY,
			id_secret: config.AIME_SECRET,
			id_lifetime_seconds: 86400
		},
		server: {
			listen_address: config.ALLNET_HOST,
			allow_user_registration: true,
			log_dir: "logs",
		}
	}).start();
}).on("error", (error) => {
	// gracefully handle error
	throw new Error(error.message);
});