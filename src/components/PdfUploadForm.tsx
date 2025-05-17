
"use client";

import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, Loader2 } from "lucide-react";

export function PdfUploadForm() {
  const [sessionName, setSessionName] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setError("Por favor, envie um arquivo PDF válido.");
        setPdfFile(null);
        e.target.value = ""; 
        return;
      }
      if (file.size > 10 * 1024 * 1024) { 
        setError("O tamanho do arquivo não deve exceder 10MB.");
        setPdfFile(null);
        e.target.value = ""; 
        return;
      }
      setPdfFile(file);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!sessionName.trim()) {
      setError("O nome da sessão é obrigatório.");
      return;
    }
    if (!pdfFile) {
      setError("O arquivo PDF é obrigatório.");
      return;
    }

    setIsLoading(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(pdfFile);
      reader.onload = () => {
        const pdfDataUri = reader.result as string;
        sessionStorage.setItem(
          "pdfInsightsSession",
          JSON.stringify({ sessionName, pdfDataUri })
        );
        toast({
          title: "Processando PDF",
          description: "Seu PDF está sendo enviado e processado.",
        });
        router.push("/insights");
      };
      reader.onerror = () => {
        setError("Falha ao ler o arquivo PDF.");
        toast({
          title: "Erro",
          description: "Falha ao ler o arquivo PDF. Por favor, tente novamente.",
          variant: "destructive",
        });
        setIsLoading(false);
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro desconhecido durante o envio.";
      setError(`Falha no envio: ${errorMessage}`);
      toast({
        title: "Falha no Envio",
        description: errorMessage,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg shadow-2xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center text-primary">GeminiStudy</CardTitle>
        <CardDescription className="text-center">
          Envie um PDF para gerar um resumo, flashcards e um quiz com IA.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="sessionName" className="text-lg">Nome da Sessão</Label>
            <Input
              id="sessionName"
              type="text"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              placeholder="ex: Minha Sessão de Estudo de Biologia"
              required
              className="text-base"
              aria-describedby="sessionNameHelp"
            />
            <p id="sessionNameHelp" className="text-sm text-muted-foreground">
              Dê um nome para esta sessão de análise.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pdfFile" className="text-lg">Enviar PDF</Label>
            <div className="flex items-center justify-center w-full">
                <label htmlFor="pdfFile" className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer border-input bg-card hover:bg-secondary transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Clique para enviar</span> ou arraste e solte
                        </p>
                        <p className="text-xs text-muted-foreground">Somente PDF (MAX. 10MB)</p>
                        {pdfFile && <p className="mt-2 text-sm text-accent-foreground">{pdfFile.name}</p>}
                    </div>
                    <Input id="pdfFile" type="file" className="hidden" onChange={handleFileChange} accept="application/pdf" aria-describedby="pdfFileHelp" />
                </label>
            </div>
             <p id="pdfFileHelp" className="text-sm text-muted-foreground">
              Selecione um documento PDF para analisar.
            </p>
          </div>

          {error && (
            <p className="text-sm font-medium text-destructive text-center p-2 bg-destructive/10 rounded-md">{error}</p>
          )}

          <Button type="submit" className="w-full text-lg py-6" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processando...
              </>
            ) : (
              "Gerar Insights"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
