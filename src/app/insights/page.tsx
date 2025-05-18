"use client";

import { FaHome } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import SummaryDisplay from "@/components/SummaryDisplay";
import FlashcardsDisplay from "@/components/FlashcardsDisplay";
import QuizDisplay from "@/components/QuizDisplay";
import LoadingSpinner from "@/components/LoadingSpinner";
import { generatePdfSummary } from "@/ai/flows/pdf-summary";
import { generateFlashcards } from "@/ai/flows/flashcard-generation";
import { generateQuiz } from "@/ai/flows/quiz-generation";
import type {
  FlashcardType,
  QuizQuestionType,
  PdfInsightsData,
} from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import {
  BookOpen,
  Layers,
  HelpCircle,
  AlertTriangle,
  Home,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function InsightsPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [sessionName, setSessionName] = useState<string | null>(null);
  const [pdfDataUri, setPdfDataUri] = useState<string | null>(null);

  const [insightsData, setInsightsData] = useState<PdfInsightsData | null>(
    null
  );
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
          throw new Error("Dados incompletos no armazenamento da sessão.");
        }
      } catch (e) {
        setError(
          "Falha ao carregar os dados da sessão. Por favor, tente enviar novamente."
        );
        setIsLoading(false);
        toast({
          title: "Erro",
          description: "Dados da sessão inválidos.",
          variant: "destructive",
        });
        router.push("/");
      }
    } else {
      setError(
        "Nenhum dado de sessão encontrado. Por favor, envie um PDF primeiro."
      );
      setIsLoading(false);
      toast({
        title: "Erro",
        description: "Nenhum dado de PDF encontrado.",
        variant: "destructive",
      });
      router.push("/");
    }
  }, [router, toast]);

  useEffect(() => {
    if (pdfDataUri && sessionName && !insightsData && !error) {
      const fetchInsights = async () => {
        setIsLoading(true);
        setError(null);
        setCurrentProgress("Iniciando análise...");
        try {
          setCurrentProgress("Gerando resumo...");
          toast({
            title: "Processando",
            description: "Gerando resumo do documento...",
          });
          const summaryResult = await generatePdfSummary({ pdfDataUri });
          if (!summaryResult || !summaryResult.summary) {
            throw new Error("Falha ao gerar o resumo ou o resumo está vazio.");
          }
          setCurrentProgress(
            summaryResult.progress || "Resumo gerado. Gerando flashcards..."
          );

          toast({ title: "Processando", description: "Gerando flashcards..." });
          const flashcardsResult = await generateFlashcards({
            pdfText: summaryResult.summary,
          });
          if (!flashcardsResult || flashcardsResult.length === 0) {
            console.warn(
              "A geração de flashcards resultou em dados vazios ou inválidos. Usando fallback."
            );
          }
          setCurrentProgress("Flashcards gerados. Gerando quiz...");

          toast({ title: "Processando", description: "Gerando quiz..." });
          const quizResult = await generateQuiz({
            pdfContent: summaryResult.summary,
          });
          if (!quizResult || !quizResult.quiz || quizResult.quiz.length === 0) {
            console.warn(
              "A geração do quiz resultou em dados vazios ou inválidos. Usando fallback."
            );
          }
          setCurrentProgress("Todos os insights gerados!");

          setInsightsData({
            summary: summaryResult.summary,
            flashcards: flashcardsResult || [],
            quiz: quizResult?.quiz || [],
          });
          toast({
            title: "Sucesso!",
            description: "Insights gerados com sucesso.",
          });
        } catch (err) {
          const errorMessage =
            err instanceof Error
              ? err.message
              : "Ocorreu um erro desconhecido ao gerar os insights.";
          setError(errorMessage);
          toast({
            title: "Falha na Geração",
            description: errorMessage,
            variant: "destructive",
          });
          setCurrentProgress("Erro durante a geração.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchInsights();
    }
  }, [pdfDataUri, sessionName, toast, insightsData, error]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Alert variant="destructive" className="w-full max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => router.push("/")} className="mt-4">
          <Home className="mr-2 h-4 w-4" /> Ir para a Página Inicial
        </Button>
      </div>
    );
  }

  if (isLoading || (!insightsData && !error)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <LoadingSpinner
          size={64}
          text={currentProgress || "Carregando insights..."}
        />
        {sessionName && (
          <p className="mt-4 text-lg font-semibold">Sessão: {sessionName}</p>
        )}
      </div>
    );
  }

  if (!insightsData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <p>Nenhum insight disponível. Este pode ser um estado inesperado.</p>
        <Button onClick={() => router.push("/")} className="mt-4">
          <Home className="mr-2 h-4 w-4" /> Ir para a Página Inicial
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 min-h-screen flex flex-col relative">
      <header className="mb-6 py-4 border-b">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">
            {sessionName ? `Sessão: ${sessionName}` : "LearnLite Insights"}
          </h1>
          <ThemeToggle />
        </div>
      </header>

      <Tabs defaultValue="summary" className="w-full flex-grow flex flex-col">
        <TabsList className="mx-auto mb-6 grid w-full max-w-md grid-cols-3 h-15">
          <TabsTrigger value="summary" className="py-4 text-base">
            <BookOpen className="mr-2 h-5 w-5" /> Resumo
          </TabsTrigger>
          <TabsTrigger value="flashcards" className="py-4 text-base">
            <Layers className="mr-2 h-5 w-5" /> Flashcards
          </TabsTrigger>
          <TabsTrigger value="quiz" className="py-4 text-base">
            <HelpCircle className="mr-2 h-5 w-5" /> Quiz
          </TabsTrigger>
        </TabsList>

        <div className="flex-grow">
          <TabsContent value="summary">
            <Suspense fallback={<LoadingSpinner text="Carregando resumo..." />}>
              <SummaryDisplay summary={insightsData.summary} />
            </Suspense>
          </TabsContent>
          <TabsContent value="flashcards">
            <Suspense
              fallback={<LoadingSpinner text="Carregando flashcards..." />}>
              <FlashcardsDisplay flashcards={insightsData.flashcards} />
            </Suspense>
          </TabsContent>
          <TabsContent value="quiz">
            <Suspense fallback={<LoadingSpinner text="Carregando quiz..." />}>
              <QuizDisplay questions={insightsData.quiz} />
            </Suspense>
          </TabsContent>
        </div>
      </Tabs>
      <footer className="flex flex-row justify-center gap-10 py-4 mt-20 border-t text-sm text-muted-foreground items-center font-semibold">
        <a href="/" className="text-2xl">
          <FaHome size={25} />
        </a>
        <a href="https://www.linkedin.com/in/fcsscoder/" target="_blank">
          <FaLinkedin size={25} />
        </a>
      </footer>
    </div>
  );
}
