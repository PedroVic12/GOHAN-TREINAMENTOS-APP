import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from '@/components/ui/scroll-area';

interface SummaryDisplayProps {
  summary: string;
}

const SummaryDisplay: FC<SummaryDisplayProps> = ({ summary }) => {
  if (!summary) {
    return <p className="text-muted-foreground">No summary available.</p>;
  }

  // Simple paragraph splitting for basic formatting
  const paragraphs = summary.split(/\n\s*\n/).map(p => p.trim()).filter(p => p.length > 0);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">Document Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-20rem)] md:h-[calc(100vh-22rem)]">
          <div className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none space-y-4 pr-4">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default SummaryDisplay;
