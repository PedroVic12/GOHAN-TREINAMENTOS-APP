"use client";

import type { FC } from 'react';
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import type { FlashcardType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface FlashcardProps {
  flashcard: FlashcardType;
}

const Flashcard: FC<FlashcardProps> = ({ flashcard }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <Card
      className={cn(
        "h-64 w-full max-w-md perspective cursor-pointer shadow-xl transform-style-preserve-3d transition-transform duration-700 ease-in-out",
        isFlipped ? "rotate-y-180" : ""
      )}
      onClick={() => setIsFlipped(!isFlipped)}
      role="button"
      tabIndex={0}
      aria-pressed={isFlipped}
      aria-label={`Flashcard: ${isFlipped ? 'Showing answer' : 'Showing question'}. Click to flip.`}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsFlipped(!isFlipped)}
    >
      <div className="absolute inset-0 w-full h-full backface-hidden">
        <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">Question</p>
          <p className="text-lg font-semibold">{flashcard.question}</p>
        </CardContent>
      </div>
      <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
        <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center bg-secondary rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">Answer</p>
          <p className="text-lg font-medium">{flashcard.answer}</p>
        </CardContent>
      </div>
       {/* Add styles for perspective and flip animation */}
      <style jsx global>{`
        .perspective { perspective: 1000px; }
        .transform-style-preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </Card>
  );
};

export default Flashcard;
