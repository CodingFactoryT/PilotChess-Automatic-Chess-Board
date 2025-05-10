export class ArduinoFetchQueue {
	#queue = Promise.resolve();
	#size = 0;

	enqueue(task) {
		this.#size++;

		const result = this.#queue.then(() => {
			return task().finally(() => this.#size--);
		});

		this.#queue = result.catch((error) => {
			console.error(`Error while executing fetch to Arduino: ${error}`);
		});

		return result;
	}

	size() {
		return this.#size;
	}
}
