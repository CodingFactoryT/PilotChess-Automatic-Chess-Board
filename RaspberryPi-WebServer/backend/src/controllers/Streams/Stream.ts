import axios from "axios";
import LichessTokenVault from "@src/controllers/LichessControllers/LichessTokenVault";
import { Readable } from "stream";

export default class Stream {
	private streamName : string;
	private url : string;
	private dataFunction : (data: object) => void;
	private errorFunction: (error: string) => void;
	private streamObject: Readable | undefined;

	constructor(name: string, url: string, dataFunction: (data: object) => void, errorFunction: (error: string) => void) {
		this.streamName = name;
		this.url = url;
		this.dataFunction = dataFunction;
		this.errorFunction = errorFunction;
	}

	async listen() {
		try {
			const response = await axios.get(this.url, {
				headers: { Authorization: `Bearer ${LichessTokenVault.getAccessToken()}` },
				responseType: "stream",
			});

			this.streamObject = response.data;
			console.logConnectionStatus(`Stream "${this.getName()}" started!`);

			this.streamObject?.on("data", (data: Buffer) => {
				//if the data is not the empty keep-alive request that is sent every few seconds
				const dataStr = data.toString().trim();
				if (dataStr.length > 0) {
					dataStr.split("\n").forEach((element: string) => {
						const parsedObject = JSON.parse(element);
						if(this.#isLichessError(parsedObject)) {
							this.errorFunction(parsedObject.error);
						} else {
							this.dataFunction(parsedObject);
						}
					});
				}
			});

			this.streamObject?.on("error", (error: Buffer) => {
				const errorStr = error.toString();
				this.errorFunction(errorStr);
			});
		} catch (error) {
			console.error(`Error while trying to listen to stream "${this.getName()}" with url ${this.url}: ${error}`);
		}
	}

	stop() {
		if (this.streamObject) {
			this.streamObject.destroy();
			this.streamObject = undefined;
			console.logConnectionStatus(`Stream "${this.getName()}" stopped!`);
		}
	}

	getName() {
		return this.streamName;
	}

	#isLichessError(obj: any): obj is LichessError {
  	return typeof obj === "object" && typeof obj?.error === "string";
	}

}
