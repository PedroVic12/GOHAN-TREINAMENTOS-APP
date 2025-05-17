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
        setError("Please upload a valid PDF file.");
        setPdfFile(null);
        e.target.value = ""; // Reset file input
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError("File size should not exceed 10MB.");
        setPdfFile(null);
        e.target.value = ""; // Reset file input
        return;
      }
      setPdfFile(file);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!sessionName.trim()) {
      setError("Session name is required.");
      return;
    }
    if (!pdfFile) {
      setError("PDF file is required.");
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
          title: "Processing PDF",
          description: "Your PDF is being uploaded and processed.",
        });
        router.push("/insights");
      };
      reader.onerror = () => {
        setError("Failed to read PDF file.");
        toast({
          title: "Error",
          description: "Failed to read PDF file. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during upload.";
      setError(`Upload failed: ${errorMessage}`);
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg shadow-2xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center text-primary">PDF Insights</CardTitle>
        <CardDescription className="text-center">
          Upload a PDF to generate an AI-powered summary, flashcards, and a quiz.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="sessionName" className="text-lg">Session Name</Label>
            <Input
              id="sessionName"
              type="text"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              placeholder="e.g., My Biology Study Session"
              required
              className="text-base"
              aria-describedby="sessionNameHelp"
            />
            <p id="sessionNameHelp" className="text-sm text-muted-foreground">
              Give a name to this analysis session.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pdfFile" className="text-lg">Upload PDF</Label>
            <div className="flex items-center justify-center w-full">
                <label htmlFor="pdfFile" className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer border-input bg-card hover:bg-secondary transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">PDF only (MAX. 10MB)</p>
                        {pdfFile && <p className="mt-2 text-sm text-accent-foreground">{pdfFile.name}</p>}
                    </div>
                    <Input id="pdfFile" type="file" className="hidden" onChange={handleFileChange} accept="application/pdf" aria-describedby="pdfFileHelp" />
                </label>
            </div>
             <p id="pdfFileHelp" className="text-sm text-muted-foreground">
              Select a PDF document to analyze.
            </p>
          </div>

          {error && (
            <p className="text-sm font-medium text-destructive text-center p-2 bg-destructive/10 rounded-md">{error}</p>
          )}

          <Button type="submit" className="w-full text-lg py-6" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              "Generate Insights"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
