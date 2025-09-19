import {
	ADBBaseRequest,
	CompanyCodes,
	ReaderFwVer
} from "./base.ts";

export class ADBLookupException extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ADBLookupException";
	}
}

export class ADBLookupRequest extends ADBBaseRequest {
	access_code: string;
	company_code: number;
	fw_version: ReaderFwVer;
	serial_number: number;

	constructor(data: Buffer) {
		super(data);
		this.access_code = data.slice(0x20, 0x2A).toString("hex");
		const company_code = data.readInt8(0x2A);
		const fw_version = data.readInt8(0x2B);
		this.serial_number = data.readUInt32LE(0x2C);

		if (!Object.values(CompanyCodes).includes(company_code)) {
			throw new ADBLookupException(`Invalid company code - ${company_code}`);
		}
		this.company_code = company_code;
		this.fw_version = fw_version as ReaderFwVer;
	}
}