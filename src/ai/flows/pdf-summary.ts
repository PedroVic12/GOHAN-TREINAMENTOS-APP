'use server';

/**
 * @fileOverview Generates a summary of a PDF document.
 *
 * - generatePdfSummary - A function that takes PDF data and returns a summary.
 * - PdfSummaryInput - The input type for the generatePdfSummary function.
 * - PdfSummaryOutput - The return type for the generatePdfSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PdfSummaryInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      'The PDF document as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
});
export type PdfSummaryInput = z.infer<typeof PdfSummaryInputSchema>;

const PdfSummaryOutputSchema = z.object({
  summary: z.string().describe('Um resumo conciso do documento PDF em português do Brasil.'),
  progress: z.string().describe('Mensagens de progresso para exibir ao usuário.'),
});
export type PdfSummaryOutput = z.infer<typeof PdfSummaryOutputSchema>;

export async function generatePdfSummary(input: PdfSummaryInput): Promise<PdfSummaryOutput> {
  return pdfSummaryFlow(input);
}

const pdfSummaryPrompt = ai.definePrompt({
  name: 'pdfSummaryPrompt',
  input: {schema: PdfSummaryInputSchema},
  output: {schema: PdfSummaryOutputSchema},
  prompt: `Você é um especialista em sumarização. Resuma o seguinte documento PDF em português do Brasil. Extraia todos os pontos-chave e crie um resumo conciso e preciso.\n\nDocumento PDF: {{media url=pdfDataUri}}`,
});

const pdfSummaryFlow = ai.defineFlow(
  {
    name: 'pdfSummaryFlow',
    inputSchema: PdfSummaryInputSchema,
    outputSchema: PdfSummaryOutputSchema,
  },
  async input => {
    const {output} = await pdfSummaryPrompt(input);
    return {
      ...output!,
      progress: 'Gerou um resumo conciso do conteúdo do PDF.',
    };
  }
);
