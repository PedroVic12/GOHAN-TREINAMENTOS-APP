"use client";

import { useState, useEffect } from 'react';
import { PdfUploadForm } from "@/components/PdfUploadForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FaLinkedin } from "react-icons/fa";
import FlashcardsDisplay from "@/components/FlashcardsDisplay";
import { FaHistory } from "react-icons/fa"; // Import a history icon
import QuizDisplay from "@/components/QuizDisplay"; 
import HistorySidebar from "@/components/HistorySidebar";
import { useHistoryStorage } from "@/hooks/useHistoryStorage";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import { Session } from "@/lib/historyTypes"; // Import the Session type

export default function HomePage() {
  const { getSessionById } = useHistoryStorage(); // Only need getSessionById here
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null); // State to track selected session ID

  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to control sidebar visibility
  // Effect to load session data when currentSessionId changes
  useEffect(() => {
    if (currentSessionId) { // Only fetch if an ID is selected
      const session = getSessionById(currentSessionId);
      setCurrentSession(session || null); // Set session data, or null if not found
    }
  }, [currentSessionId, getSessionById]); // Add dependencies

  return (
    <div className="flex min-h-screen"> {/* This is the single root element returned */}
      {isSidebarOpen && <HistorySidebar onSessionSelect={setCurrentSessionId} />}
      {/* Button to toggle sidebar visibility */}
      {!isSidebarOpen && ( // Only show the button when the sidebar is closed
        <Button onClick={() => setIsSidebarOpen(true)} className="absolute top-4 left-4 z-10">
          <FaHistory className="h-5 w-5" /> {/* Use the history icon */}
        </Button>
      )}
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
              <FlashcardsDisplay flashcards={currentSession.flashcards} />
            </div>
            <div>
               <h2 className="text-xl font-semibold mb-2">Quiz</h2>
               <QuizDisplay questions={currentSession.quiz} />
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
