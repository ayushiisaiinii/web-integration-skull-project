import React, { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import type { ModelType } from '../hooks/useAppFlow';

interface ProcessingOverlayProps {
  model: ModelType;
}

export const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({ model }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate progress bar
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 5;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6">
      <div className="bg-surface border border-border p-12 rounded-2xl shadow-xl flex flex-col items-center max-w-lg w-full relative overflow-hidden">
        
        {/* Scanning line effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-accent shadow-glow opacity-50 animate-[pulse_2s_ease-in-out_infinite]" style={{ top: `${progress}%` }}></div>

        <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 border-4 border-t-accent border-r-transparent border-b-primary border-l-transparent rounded-full animate-spin"></div>
          
          {/* Inner pulsating icon */}
          <div className="absolute bg-background rounded-full p-4 border border-border z-10">
            <Activity className="w-10 h-10 text-accent animate-pulse" />
          </div>
        </div>

        <h3 className="text-2xl font-bold text-blue-900 mb-2 text-center capitalize">
          Analyzing {model} Structure
        </h3>
        <p className="text-blue-700 text-center mb-8">
          Running AI inference pipeline. Please wait while the neural network reconstructs the anatomy...
        </p>

        {/* Progress bar */}
        <div className="w-full bg-blue-100 rounded-full h-2 mb-2 border border-border overflow-hidden">
          <div 
            className="bg-accent h-2 rounded-full shadow-glow transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="w-full flex justify-between text-xs text-blue-500 font-mono">
          <span>INFERENCE_START</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
};
