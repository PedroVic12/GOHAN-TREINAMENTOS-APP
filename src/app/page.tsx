"use client";

import { useState, useEffect } from 'react';
import { PdfUploadForm } from "@/components/PdfUploadForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FaLinkedin } from "react-icons/fa";
import HistorySidebar from "@/components/HistorySidebar";
import { useHistoryStorage } from "@/hooks/useHistoryStorage";
import { Session } from "@/lib/historyTypes"; // Import the Session type

export default function HomePage() {
  const { getSessionById } = useHistoryStorage(); // Only need getSessionById here
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null); // State to track selected session ID

  // Effect to load session data when currentSessionId changes
  useEffect(() => {
    if (currentSessionId) { // Only fetch if an ID is selected
      const session = getSessionById(currentSessionId);
      setCurrentSession(session || null); // Set session data, or null if not found
    }
  }, [currentSessionId, getSessionById]); // Add dependencies

  return (
    <div className="flex min-h-screen"> {/* This is the single root element returned */}
      <HistorySidebar onSessionSelect={setCurrentSessionId} /> {/* Pass setCurrentSessionId directly */}
      <main className="flex flex-col items-center justify-center flex-grow p-4 bg-gradient-to-br from-background to-secondary/30">
        <div className="absolute top-4 right-4 z-10"> {/* Add z-10 to ensure it's above other content */}
          <ThemeToggle />
        </div>
        {/* Add content area to display currentSession data */}
        {currentSessionId && currentSession ? ( // Display session data if a session is selected and loaded
          // Display the summary, flashcards, and quiz from currentSession
          <div className="w-full max-w-2xl">
            <h1 className="text-2xl font-bold mb-4">{currentSession.name}</h1>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Resumo</h2>
              <p>{currentSession.summary}</p>
            </div>
            {/* Placeholder for FlashcardsDisplay and QuizDisplay */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Flashcards</h2>
              {/* <FlashcardsDisplay flashcards={currentSession.flashcards} /> */}
              <p>Flashcard display goes here.</p>
            </div>
            <div>
               <h2 className="text-xl font-semibold mb-2">Quiz</h2>
               {/* <QuizDisplay quiz={currentSession.quiz} /> */}
               <p>Quiz display goes here.</p>
            </div>
          </div>
        ) : (
          // Display upload form if no session is selected
          <PdfUploadForm />
        )}
        <footer className="flex flex-col items-center py-4 mt-8 text-sm text-muted-foreground gap-2">
          <a href="https://www.linkedin.com/in/fcsscoder/" target="_blank">
            <FaLinkedin size={35} color="#6666FF" />
          </a>
          Developed by Caio Souza
        </footer>
      </main> {/* This is the single root element returned */}
    </div>
  );
}
