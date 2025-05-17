'use server';
/**
 * @fileOverview Flashcard generation AI agent.
 *
 * - generateFlashcards - A function that handles the flashcard generation process.
 * - GenerateFlashcardsInput - The input type for the generateFlashcards function.
 * - GenerateFlashcardsOutput - The return type for the generateFlashcards function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFlashcardsInputSchema = z.object({
  pdfText: z.string().describe('The text content extracted from the PDF, expected to be in Portuguese.'),
});
export type GenerateFlashcardsInput = z.infer<typeof GenerateFlashcardsInputSchema>;

const FlashcardSchema = z.object({
  question: z.string().describe('A pergunta para o flashcard em português do Brasil.'),
  answer: z.string().describe('A resposta para a pergunta em português do Brasil.'),
});

const GenerateFlashcardsOutputSchema = z.array(FlashcardSchema).describe('Um array de flashcards gerados a partir do conteúdo do PDF, em português do Brasil.');
export type GenerateFlashcardsOutput = z.infer<typeof GenerateFlashcardsOutputSchema>;

export async function generateFlashcards(input: GenerateFlashcardsInput): Promise<GenerateFlashcardsOutput> {
  return generateFlashcardsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFlashcardsPrompt',
  input: {schema: GenerateFlashcardsInputSchema},
  output: {schema: GenerateFlashcardsOutputSchema},
  prompt: `Você é um educador especialista, habilidoso em criar flashcards eficazes para estudantes.

  Dado o seguinte texto de um documento PDF (que está em português), gere 10 flashcards em português do Brasil que ajudarão os estudantes a memorizar as informações chave.
  Cada flashcard deve ter uma pergunta e uma resposta correspondente.

  Texto: {{{pdfText}}}

  Formate a saída como um array JSON de objetos de flashcard, onde cada objeto possui os campos 'question' (pergunta) e 'answer' (resposta), ambos em português do Brasil.
  `, config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const generateFlashcardsFlow = ai.defineFlow(
  {
    name: 'generateFlashcardsFlow',
    inputSchema: GenerateFlashcardsInputSchema,
    outputSchema: GenerateFlashcardsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
