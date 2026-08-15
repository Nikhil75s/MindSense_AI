import { pipeline, env } from '@xenova/transformers';

// Disable local models since we are running server-side and want to pull from HF Hub
env.allowLocalModels = false;

// We use the singleton pattern to ensure the model is loaded only once across the application lifecycle
class PipelineSingleton {
  static task = 'text-classification';
  // We use SST-2 which returns POSITIVE or NEGATIVE with a confidence score.
  // This is a robust DistilBERT model guaranteed to run locally via Transformers.js
  static model = 'Xenova/distilbert-base-uncased-finetuned-sst-2-english';
  static instance: any = null;

  static async getInstance(progress_callback?: Function) {
    if (this.instance === null) {
      // Create the pipeline (this might take a few seconds the first time as it downloads the ~50MB model)
      this.instance = await pipeline(this.task, this.model, { progress_callback });
    }
    return this.instance;
  }
}

export default PipelineSingleton;
