import { createModel } from 'vosk-browser';

class AudioProcessor extends AudioWorkletProcessor {
	constructor() {
		super();
		this.port.onmessage = (event) => this.handleMessage(event);
		this.model = null;
		this.recognizer = null;
		this.initialized = false;
	}

	async handleMessage(event) {
		if (event.data.initializeModel) {
			try {
				// Вместо использования decod

				this.model = await createModel(event.data.modelData);
				this.recognizer = new this.model.KaldiRecognizer();
				this.recognizer.on('result', (message) => {
					console.log(`Result: ${message.result.text}`);
				});
				this.recognizer.on('partialresult', (message) => {
					console.log(`Partial result: ${message.result.partial}`);
				});
				this.initialized = true;
			} catch (error) {
				console.error('Model initialization failed', error);
			}
		}
	}

	process(inputs, outputs, parameters) {
		if (!this.initialized) {
			return true;
		}

		const input = inputs[0][0];
		if (this.recognizer) {
			try {
				this.recognizer.acceptWaveform(input);
			} catch (error) {
				console.error('acceptWaveform failed', error);
			}
		}
		return true;
	}
}

registerProcessor('audio-processor', AudioProcessor);
