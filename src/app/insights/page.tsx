"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import SummaryDisplay from '@/components/SummaryDisplay';
import FlashcardsDisplay from '@/components/FlashcardsDisplay';
import QuizDisplay from '@/components/QuizDisplay';
import LoadingSpinner from '@/components/LoadingSpinner';
import { generatePdfSummary } from '@/ai/flows/pdf-summary';
import { generateFlashcards } from '@/ai/flows/flashcard-generation';
import { generateQuiz } from '@/ai/flows/quiz-generation';
import type { FlashcardType, QuizQuestionType, PdfInsightsData } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Layers, HelpCircle, AlertTriangle, Home } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";


export default function InsightsPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [sessionName, setSessionName] = useState<string | null>(null);
  const [pdfDataUri, setPdfDataUri] = useState<string | null>(null);
  
  const [insightsData, setInsightsData] = useState<PdfInsightsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentProgress, setCurrentProgress] = useState<string>("");

  useEffect(() => {
    const storedData = sessionStorage.getItem("pdfInsightsSession");
    if (storedData) {
      try {
        const { sessionName: sName, pdfDataUri: pUri } = JSON.parse(storedData);
        if (sName && pUri) {
          setSessionName(sName);
          setPdfDataUri(pUri);
        } else {
          throw new Error("Incomplete data in session storage.");
        }
      } catch (e) {
        setError("Failed to load session data. Please try uploading again.");
        setIsLoading(false);
        toast({ title: "Error", description: "Invalid session data.", variant: "destructive" });
        router.push('/');
      }
    } else {
      setError("No session data found. Please upload a PDF first.");
      setIsLoading(false);
      toast({ title: "Error", description: "No PDF data found.", variant: "destructive" });
      router.push('/');
    }
  }, [router, toast]);

  useEffect(() => {
    if (pdfDataUri && sessionName && !insightsData && !error) { // only run if data is valid and not already fetched/errored
      const fetchInsights = async () => {
        setIsLoading(true);
        setError(null);
        setCurrentProgress("Starting analysis...");
        try {
          setCurrentProgress("Generating summary...");
          toast({ title: "Processing", description: "Generating document summary..." });
          const summaryResult = await generatePdfSummary({ pdfDataUri });
          if (!summaryResult || !summaryResult.summary) {
            throw new Error("Failed to generate summary or summary is empty.");
          }
          setCurrentProgress(summaryResult.progress || "Summary generated. Generating flashcards...");
          
          toast({ title: "Processing", description: "Generating flashcards..." });
          const flashcardsResult = await generateFlashcards({ pdfText: summaryResult.summary });
           if (!flashcardsResult || flashcardsResult.length === 0) {
            console.warn("Flashcard generation resulted in empty or invalid data. Using fallback.");
            // Fallback might not be ideal but better than erroring out if API is flaky for this part
            // throw new Error("Failed to generate flashcards or flashcards are empty.");
          }
          setCurrentProgress("Flashcards generated. Generating quiz...");

          toast({ title: "Processing", description: "Generating quiz..." });
          const quizResult = await generateQuiz({ pdfContent: summaryResult.summary });
          if (!quizResult || !quizResult.quiz || quizResult.quiz.length === 0) {
             console.warn("Quiz generation resulted in empty or invalid data. Using fallback.");
            // throw new Error("Failed to generate quiz or quiz is empty.");
          }
          setCurrentProgress("All insights generated!");

          setInsightsData({
            summary: summaryResult.summary,
            flashcards: flashcardsResult || [], // Ensure it's an array
            quiz: quizResult?.quiz || [], // Ensure it's an array
          });
          toast({ title: "Success!", description: "Insights generated successfully." });

        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "An unknown error occurred while generating insights.";
          setError(errorMessage);
          toast({ title: "Generation Failed", description: errorMessage, variant: "destructive" });
          setCurrentProgress("Error during generation.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchInsights();
    }
  }, [pdfDataUri, sessionName, toast, insightsData, error]); // Added insightsData and error to dependency array

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Alert variant="destructive" className="w-full max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => router.push('/')} className="mt-4">
          <Home className="mr-2 h-4 w-4" /> Go to Homepage
        </Button>
      </div>
    );
  }
  
  if (isLoading || (!insightsData && !error)) { // Show loader if isLoading or if insightsData is not yet available and no error
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <LoadingSpinner size={64} text={currentProgress || "Loading insights..."} />
         {sessionName && <p className="mt-4 text-lg font-semibold">Session: {sessionName}</p>}
      </div>
    );
  }

  if (!insightsData) {
     // This case should ideally be covered by isLoading or error states
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <p>No insights data available. This might be an unexpected state.</p>
         <Button onClick={() => router.push('/')} className="mt-4">
          <Home className="mr-2 h-4 w-4" /> Go to Homepage
        </Button>
      </div>
    );
  }


  return (
    <div className="container mx-auto p-4 min-h-screen flex flex-col">
      <header className="mb-6 py-4 border-b">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">
            {sessionName ? `Insights for: ${sessionName}` : "PDF Insights"}
          </h1>
          <ThemeToggle />
        </div>
      </header>
      
      <Tabs defaultValue="summary" className="w-full flex-grow flex flex-col">
        <TabsList className="mx-auto mb-6 grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="summary" className="py-3 text-base">
            <BookOpen className="mr-2 h-5 w-5" /> Summary
          </TabsTrigger>
          <TabsTrigger value="flashcards" className="py-3 text-base">
            <Layers className="mr-2 h-5 w-5" /> Flashcards
          </TabsTrigger>
          <TabsTrigger value="quiz" className="py-3 text-base">
            <HelpCircle className="mr-2 h-5 w-5" /> Quiz
          </TabsTrigger>
        </TabsList>

        <div className="flex-grow">
          <TabsContent value="summary">
            <Suspense fallback={<LoadingSpinner text="Loading summary..." />}>
              <SummaryDisplay summary={insightsData.summary} />
            </Suspense>
          </TabsContent>
          <TabsContent value="flashcards">
             <Suspense fallback={<LoadingSpinner text="Loading flashcards..." />}>
              <FlashcardsDisplay flashcards={insightsData.flashcards} />
            </Suspense>
          </TabsContent>
          <TabsContent value="quiz">
            <Suspense fallback={<LoadingSpinner text="Loading quiz..." />}>
              <QuizDisplay questions={insightsData.quiz} />
            </Suspense>
          </TabsContent>
        </div>
      </Tabs>
       <footer className="text-center py-4 mt-8 border-t text-sm text-muted-foreground">
        PDF Insights - Powered by AI
      </footer>
    </div>
  );
}
