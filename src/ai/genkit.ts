import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI(
    {
      apiKey: "AIzaSyAw-JTE-fF5IJ-uoTiqdkswxXOK4nnTw2w",
    }
  )],
  model: 'googleai/gemini-2.0-flash',

  
});
