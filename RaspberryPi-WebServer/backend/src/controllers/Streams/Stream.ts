import axios from "axios";
import LichessTokenVault from "@src/controllers/LichessControllers/LichessTokenVault";

export default class Stream {
	private streamName : string;
	private url : string;
	private dataFunction : (data) => void;
	private errorFunction: (error) => void;
	private streamObject;

	constructor(name: string, url: string, dataFunction, errorFunction) {
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

			this.streamObject.on("data", (data) => {
				//if the data is not the empty keep-alive request that is sent every few seconds
				data = data.toString().trim();
				if (data.length > 0) {
					data.split("\n").forEach((element: string) => {
						this.dataFunction(JSON.parse(element));
					});
				}
			});

			this.streamObject.on("error", (error) => {
				console.error(`Error in stream "${this.getName()}": ${error}`);
				this.errorFunction(error);
			});
		} catch (error) {
			console.error(`Error while trying to listen to stream "${this.getName()}" with url ${this.url}: ${error}`);
		}
	}

	stop() {
		if (this.streamObject) {
			this.streamObject.destroy();
			this.streamObject = null;
			console.logConnectionStatus(`Stream "${this.getName()}" stopped!`);
		}
	}

	getName() {
		return this.streamName;
	}
}
