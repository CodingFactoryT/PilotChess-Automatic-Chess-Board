export class ArduinoFetchQueue {
	private queue : Promise<string> | Promise<void> | Promise<unknown>= Promise.resolve();
	private queueSize = 0;

	enqueue(task: () => Promise<string>) {
		this.queueSize++;

		const result = this.queue.then(() => {
			return task().finally(() => this.queueSize--);
		});

		this.queue = result.catch((error) => {
			console.error(`Error while executing fetch to Arduino: ${error}`);
		});

		return result;
	}

	size() {
		return this.queueSize;
	}
}
