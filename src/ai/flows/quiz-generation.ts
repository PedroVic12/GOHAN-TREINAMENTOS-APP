// src/ai/flows/quiz-generation.ts
'use server';
/**
 * @fileOverview Generates a quiz based on the content of a PDF.
 *
 * - generateQuiz - A function that generates a quiz from PDF content.
 * - GenerateQuizInput - The input type for the generateQuiz function.
 * - GenerateQuizOutput - The return type for the generateQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizInputSchema = z.object({
  pdfContent: z.string().describe('The content of the PDF as a string, expected to be in Portuguese.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const GenerateQuizOutputSchema = z.object({
  quiz: z
    .array(
      z.object({
        question: z.string().describe('A pergunta do quiz em português do Brasil.'),
        options: z.array(z.string()).describe('As opções de múltipla escolha em português do Brasil.'),
        answer: z.string().describe('A resposta correta para a pergunta em português do Brasil.'),
      })
    )
    .describe('Um quiz com perguntas de múltipla escolha e respostas, tudo em português do Brasil.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: {schema: GenerateQuizInputSchema},
  output: {schema: GenerateQuizOutputSchema},
  prompt: `Você é um especialista em criar quizzes a partir de textos.

  Crie um quiz com 10 perguntas em português do Brasil com base no conteúdo abaixo (que está em português). Cada pergunta deve ter 4 opções de múltipla escolha, com uma resposta correta.

  O quiz deve testar o entendimento do usuário sobre o material. Foque nos fatos e conceitos chave. As perguntas, opções e a resposta correta devem estar em português do Brasil.

  Conteúdo: {{{pdfContent}}}
  `,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
