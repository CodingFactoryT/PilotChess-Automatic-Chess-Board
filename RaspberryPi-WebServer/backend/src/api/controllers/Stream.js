import axios from "axios";

export default class Stream {
	constructor(name, url, dataFunction, errorFunction) {
		this.name = name;
		this.url = url;
		this.dataFunction = dataFunction;
		this.errorFunction = errorFunction;

		this.streamObject = null;
		this.events = null;
	}

	async listen(accessToken) {
		try {
			const response = await axios.get(this.url, {
				headers: { Authorization: `Bearer ${accessToken}` },
				responseType: "stream",
			});

			this.streamObject = response.data;
			console.logConnectionStatus(`Stream "${this.name}" started!`);

			this.streamObject.on("data", (data) => {
				//if the data is not the empty keep-alive request that is sent every few seconds
				data = data.toString().trim();
				if (data.length > 0) {
					this.dataFunction(JSON.parse(data));
				}
			});

			this.streamObject.on("error", (error) => {
				console.error(`Error in stream "${streamName}": ${error}`);
				this.errorFunction(error);
			});
		} catch (error) {
			console.error(`Error while trying to listen to stream "${streamName}" with url ${streamingURL}: ${error}`);
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
