import axios from "axios";
import LichessTokenVault from "@src/controllers/LichessControllers/LichessTokenVault";

export default class Stream {
	constructor(name, url, dataFunction, errorFunction) {
		this.name = name;
		this.url = url;
		this.dataFunction = dataFunction;
		this.errorFunction = errorFunction;

		this.streamObject = null;
		this.events = null;
	}

	async listen() {
		try {
			const response = await axios.get(this.url, {
				headers: { Authorization: `Bearer ${LichessTokenVault.getAccessToken()}` },
				responseType: "stream",
			});

			this.streamObject = response.data;
			console.logConnectionStatus(`Stream "${this.name}" started!`);

			this.streamObject.on("data", (data) => {
				//if the data is not the empty keep-alive request that is sent every few seconds
				data = data.toString().trim();
				if (data.length > 0) {
					data.split("\n").forEach((element) => {
						this.dataFunction(JSON.parse(element));
					});
				}
			});

			this.streamObject.on("error", (error) => {
				console.error(`Error in stream "${this.name}": ${error}`);
				this.errorFunction(error);
			});
		} catch (error) {
			console.error(`Error while trying to listen to stream "${this.name}" with url ${this.url}: ${error}`);
		}
	}

	stop() {
		if (this.streamObject) {
			this.streamObject.destroy();
			this.streamObject = null;
			console.logConnectionStatus(`Stream "${this.name}" stopped!`);
		}
	}
}
