"use client";

import { useState, useEffect } from "react";
import { PdfUploadForm } from "@/components/PdfUploadForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FaLinkedin } from "react-icons/fa";
import FlashcardsDisplay from "@/components/FlashcardsDisplay";
import { FaArrowLeft } from "react-icons/fa"; // Import back arrow icon
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

  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to control sidebar visibility
  // Effect to load session data when currentSessionId changes
  useEffect(() => {
    if (currentSessionId) {
      // Only fetch if an ID is selected
      const session = getSessionById(currentSessionId);
      setCurrentSession(session || null); // Set session data, or null if not found
    }
  }, [currentSessionId, getSessionById]); // Add dependencies

  return (
    <div className="flex min-h-screen">
      {" "}
      {/* This is the single root element returned */}
      <HistorySidebar
        onSessionSelect={setCurrentSessionId}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      {/* Button to toggle sidebar visibility */}
      <main className="flex flex-col bg-red items-center flex-grow py-4 px-8 sm:px-4">
        <div className="flex flex-row justify-between h-[5%] w-full mb-16 z-10 ">
          <Button onClick={() => setIsSidebarOpen(true)} className="block">
            <FaHistory className="h-5 w-5" /> {/* Use the history icon */}
          </Button>
          {/* Add z-10 to ensure it's above other content */}
          <ThemeToggle />
        </div>
        {currentSessionId && ( // Show back button only when a session is active
          <Button
            onClick={() => {
              setCurrentSessionId(null);
              setCurrentSession(null);
            }}
            className="absolute top-4 left-20 z-10">
            {" "}
            {/* Position to the right of history button */}
            <FaArrowLeft className="h-5 w-5" /> {/* Use back arrow icon */}
          </Button>
        )}
        {/* Add content area to display currentSession data */}
        {currentSessionId && currentSession ? ( // Display session data if a session is selected and loaded
          // Display the summary, flashcards, and quiz from currentSession
          <div className="w-full max-w-5xl">
            <h1 className="text-2xl font-bold mb-4">{currentSession.name}</h1>
            <div className="mb-20">
              <h2 className="text-xl font-semibold mb-4">Resumo</h2>
              <p>{currentSession.summary}</p>
            </div>
            {/* Placeholder for FlashcardsDisplay and QuizDisplay */}
            <div className="mb-20">
              <h2 className="text-xl font-semibold mb-4">Flashcards</h2>
              {/* <FlashcardsDisplay flashcards={currentSession.flashcards} /> */}
              <FlashcardsDisplay flashcards={currentSession.flashcards} />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Quiz</h2>
              <QuizDisplay questions={currentSession.quiz} />
            </div>
          </div>
        ) : (
          // Display upload form if no session is selected
          <PdfUploadForm />
        )}
        <footer className="flex flex-col items-center py-4 mt-8 text-sm text-muted-foreground gap-2">

                    This is a fork from Pedro Victor Veras. Eu desde que comecei a programar em frontend em flutter busquei fazer um aplicatvo para gerenciar minhas tarefas e projetos

          <p>
            Eu criei o Gohan treinamentos em FLutter em 2023 com lista de tarefas, notes app, Kanban Board.

            
          </p>

          <p>
            Em 2024, decicdi mover meu aplicativo para React e Vite, consegui um alarm clock, lista de tarefas com boas praticas com signal e tambem fiz um Calistenia App com VibeCoding e principalmente um Habit Tracker que eu uso todos os dias com Ionic
          </p>

          <a href="https://www.linkedin.com/in/fcsscoder/" target="_blank">
            <FaLinkedin size={35} color="#6666FF" />
          </a>
        </footer>
      </main>{" "}
      {/* This is the single root element returned */}
    </div>
  );
}
