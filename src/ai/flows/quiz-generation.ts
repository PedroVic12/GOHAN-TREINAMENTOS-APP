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
  pdfContent: z.string().describe('The content of the PDF as a string.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const GenerateQuizOutputSchema = z.object({
  quiz: z
    .array(
      z.object({
        question: z.string().describe('The quiz question.'),
        options: z.array(z.string()).describe('The multiple choice options.'),
        answer: z.string().describe('The correct answer to the question.'),
      })
    )
    .describe('A quiz with multiple choice questions and answers.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: {schema: GenerateQuizInputSchema},
  output: {schema: GenerateQuizOutputSchema},
  prompt: `You are an expert in creating quizzes from text.

  Create a quiz with 5 questions based on the content below. Each question should have 4 multiple choice options, with one correct answer.

  The quiz should test the user's understanding of the material. Focus on key facts and concepts.

  Content: {{{pdfContent}}}
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
