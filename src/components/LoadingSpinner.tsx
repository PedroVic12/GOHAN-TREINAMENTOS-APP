import type { FC } from 'react';
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: number;
  text?: string;
}

const LoadingSpinner: FC<LoadingSpinnerProps> = ({ size = 48, text }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2 p-4">
      <Loader2 className="animate-spin text-primary" style={{ width: size, height: size }} />
      {text && <p className="text-muted-foreground">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
