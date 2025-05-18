import { PdfUploadForm } from "@/components/PdfUploadForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FaLinkedin } from "react-icons/fa";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-background to-secondary/30">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <PdfUploadForm />
      <footer className="flex flex-col items-center py-4 mt-8 text-sm text-muted-foreground gap-2">
        <a href="https://www.linkedin.com/in/fcsscoder/" target="_blank">
          <FaLinkedin size={35} color="#6666FF" />
        </a>
        Developed by Caio Souza
      </footer>
    </main>
  );
}
