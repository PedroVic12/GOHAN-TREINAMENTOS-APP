import { config } from 'dotenv';
config();

import '@/ai/flows/pdf-summary.ts';
import '@/ai/flows/flashcard-generation.ts';
import '@/ai/flows/quiz-generation.ts';