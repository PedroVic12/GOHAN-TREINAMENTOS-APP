export interface FlashcardType {
  question: string;
  answer: string;
}

export interface QuizQuestionType {
  question: string;
  options: string[];
  answer: string;
}

export interface PdfInsightsData {
  summary: string;
  flashcards: FlashcardType[];
  quiz: QuizQuestionType[];
}
