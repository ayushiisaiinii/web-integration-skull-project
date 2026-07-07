import React, { useState, useRef, useEffect } from 'react';
import { Brain, Activity, UserCircle, ChevronDown, Moon, Sun } from 'lucide-react';
import type { ModelType } from '../hooks/useAppFlow';

interface HeaderProps {
  onModelSelect?: (model: ModelType) => void;
  onViewResults?: () => void;
  onToggleTheme?: () => void;
  isDark?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onModelSelect, onViewResults, onToggleTheme, isDark }) => {
  const [isModelsDropdownOpen, setIsModelsDropdownOpen] = useState(false);
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
  const modelsDropdownRef = useRef<HTMLDivElement>(null);
  const settingsDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modelsDropdownRef.current && !modelsDropdownRef.current.contains(event.target as Node)) {
        setIsModelsDropdownOpen(false);
      }
      if (settingsDropdownRef.current && !settingsDropdownRef.current.contains(event.target as Node)) {
        setIsSettingsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        
        {/* Navigation Bar */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-blue-700">
          <a href="#" className="hover:text-primary transition-colors border-b-2 border-primary text-primary pb-1">Dashboard</a>
          <a href="#" className="hover:text-primary transition-colors pb-1 border-b-2 border-transparent">Patients</a>
          
          {/* Models Dropdown */}
          <div className="relative" ref={modelsDropdownRef}>
            <button 
              onClick={() => {
                setIsModelsDropdownOpen(!isModelsDropdownOpen);
                setIsSettingsDropdownOpen(false);
              }}
              className="flex items-center gap-1 hover:text-primary transition-colors pb-1 border-b-2 border-transparent focus:outline-none"
            >
              Models
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isModelsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isModelsDropdownOpen && (
              <div className="absolute top-full mt-2 left-0 w-48 bg-white border border-blue-100 rounded-lg shadow-lg overflow-hidden py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <button onClick={() => { onModelSelect?.('cranium'); setIsModelsDropdownOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 hover:text-primary transition-colors">CRANIUM (Calvaria)</button>
                <button onClick={() => { onModelSelect?.('mandible'); setIsModelsDropdownOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 hover:text-primary transition-colors">MANDIBLE (Lower Jaw)</button>
                <button onClick={() => { onModelSelect?.('maxilla'); setIsModelsDropdownOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 hover:text-primary transition-colors">MAXILLA (Upper Jaw)</button>
              </div>
            )}
          </div>

          <button onClick={onViewResults} className="hover:text-primary transition-colors pb-1 border-b-2 border-transparent font-medium">3D Viewer</button>
          
          {/* Settings Dropdown */}
          <div className="relative" ref={settingsDropdownRef}>
            <button 
              onClick={() => {
                setIsSettingsDropdownOpen(!isSettingsDropdownOpen);
                setIsModelsDropdownOpen(false);
              }}
              className="flex items-center gap-1 hover:text-primary transition-colors pb-1 border-b-2 border-transparent focus:outline-none font-medium"
            >
              Settings
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isSettingsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isSettingsDropdownOpen && (
              <div className="absolute top-full mt-2 right-0 w-56 bg-white border border-blue-100 rounded-lg shadow-lg overflow-hidden py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-1 text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Appearance</div>
                <button 
                  onClick={() => {
                    onToggleTheme?.();
                    setIsSettingsDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 hover:text-primary transition-colors"
                >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {isDark ? 'Light Theme' : 'Dark Theme'}
                </button>
              </div>
            )}
          </div>
        </nav>

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
