import express, {text, type RequestHandler, json} from "express";
import createHttpError from "http-errors";
import allNetRouter from "./routes/allnet.router.ts";
import {log} from "./helpers/general.ts";
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
import {CHU3VERSIONS} from "./games/chu3/config.ts";
import mai2Router from "./routes/mai2.router.ts";
import mai2CMRouter from "./routes/mai2cm.router.ts";
import apiRouter from "./routes/api.router.ts";
import session from "express-session";
import passport from "passport";
import {Strategy as JwtStrategy} from "passport-jwt";
import errorMiddleware from "./middleware/error.ts";
import cors from "cors";

// JSON
declare global {
	interface BigInt {
		toJSON(): number;
	}
}

BigInt.prototype.toJSON = function() {
	return Number(this);
};

const app = express();

connectDB();

const gameEndpointMiddleware:RequestHandler = (req, res, next) => {
	const game = req.originalUrl.split("/")[2];
	const ver = req.originalUrl.split("/")[3];
	const relevantUrl = req.originalUrl.split("/")[req.originalUrl.split("/").length - 1];

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

const allNetEndpointMiddleware:RequestHandler = (req, _, next) => {
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
app.use("/sys/", allNetEndpointMiddleware, text({ type: "*/*" }), allNetRouter);

// Games
app.use("/g/chu3/:ver/", json(), gameEndpointMiddleware, (req, res, next)=>{
	const ver = req.params.ver!;

	const gameVersion = CHU3VERSIONS.find(v => v.roms.includes(ver));

	if(!gameVersion) {
		log("error", `Invalid game version: ${ver}`);
		return res.status(400).send("Invalid game version");
	}

	req.headers["gameVersion"] = `${gameVersion.index}`;

	next();
}, chu3Router);
app.use("/g/cmchu3/:ver/", json(), gameEndpointMiddleware, chu3CMRouter);
app.use("/g/ongeki/:ver/", json(), gameEndpointMiddleware, gekiRouter);
app.use("/g/cmongeki/:ver/", json(), gameEndpointMiddleware, gekiCMRouter);
app.use("/g/mai2/", json(), gameEndpointMiddleware, mai2Router);
app.use("/g/cmmai2/:ver/", json(), gameEndpointMiddleware, mai2CMRouter);
app.use("/g/card/", json(), gameEndpointMiddleware, cmRouter);

// API
// Passport
passport.use(
	new JwtStrategy({
		jwtFromRequest: (req) => {
			// Get from authorization header
			if (req.headers.authorization) {
				return req.headers.authorization.split(" ")[1];
			}
		},
		secretOrKey: config.SESSION_SECRET,
		passReqToCallback: true
	},
	(req, jwtPayload, done) => {
		if (Date.now() > jwtPayload.exp * 1000) {
			return done("Expired token", null);
		}

		return done(null, jwtPayload);
	})
);

console.log(config.WEBUI_URL);

app.use("/api", json(), cors({origin: ["http://localhost:5173", config.WEBUI_URL], credentials: true}), session({secret: config.SESSION_SECRET, resave: false, saveUninitialized: false}), passport.initialize(), passport.session(), apiRouter, errorMiddleware);

app.use(function (_, __, next) {
	log("error", `404: ${_.originalUrl}`);
	next(createHttpError(404, "Not Found"));
});

// Error Handler
// app.use(errorMiddleware);

app.listen(80, () => {
	log("allnet", "Started on port 80");

	new AimedbServlette({
		aimedb:{
			listen_address:"0.0.0.0",
			loglevel:"info",
			port:22345,
			key: config.AIME_KEY,
			id_secret: config.AIME_SECRET,
			id_lifetime_seconds: 86400
		},
		server:{
			listen_address: config.ALLNET_HOST,
			allow_user_registration: true,
			log_dir: "logs",
		}
	}).start();
}).on("error", (error) => {
	// gracefully handle error
	throw new Error(error.message);
});
