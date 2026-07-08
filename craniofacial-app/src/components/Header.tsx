import React from 'react';
import { Brain, Activity } from 'lucide-react';

export const Header: React.FC = () => {

  return (
    <>
      <header className="w-full bg-surface border-b border-border py-4 px-8 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center text-primary">
            <Brain className="w-8 h-8" />
            <Activity className="w-6 h-6 -ml-2 text-accent" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-wider text-blue-900">
              DIC <span className="font-light text-blue-400">|</span> Craniofacial AI Reconstruction Portal
            </h1>
            <span className="text-xs text-blue-500 uppercase tracking-widest font-semibold">
              Design Innovation Center
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm text-blue-500">
          <div className="hidden lg:flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="font-medium text-blue-800">Systems Online</span>
          </div>
        </div>
      </header>
    </>
  );
};
