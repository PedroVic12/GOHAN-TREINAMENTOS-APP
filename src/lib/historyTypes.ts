export interface Flashcard {
  question: string;
  answer: string;
}

export interface QuizQuestion {
  question: string;
  options: string[]; // Array of possible answers
  answer: string;
}

export interface Session {
  id: string;
  name: string;
  originalFileName?: string;
  createdAt: string; // Using ISO 8601 string for date
  summary: string;
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
}

export type PdfAnalysisSessions = Session[];