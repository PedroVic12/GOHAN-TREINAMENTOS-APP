import type { FC } from 'react';
import Flashcard from "./Flashcard";
import type { FlashcardType } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FlashcardsDisplayProps {
  flashcards: FlashcardType[];
}

const FlashcardsDisplay: FC<FlashcardsDisplayProps> = ({ flashcards }) => {
  if (!flashcards || flashcards.length === 0) {
    return <p className="text-muted-foreground">No flashcards available.</p>;
  }

  return (
    <ScrollArea className="h-[calc(100vh-18rem)] md:h-[calc(100vh-20rem)]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-1">
        {flashcards.map((fc, index) => (
          <Flashcard key={index} flashcard={fc} />
        ))}
      </div>
    </ScrollArea>
  );
};

export default FlashcardsDisplay;
