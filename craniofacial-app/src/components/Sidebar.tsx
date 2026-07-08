import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Moon, Sun, LayoutDashboard, Users, Box, MonitorPlay, Settings } from 'lucide-react';
import type { ModelType } from '../hooks/useAppFlow';

interface SidebarProps {
  onModelSelect?: (model: ModelType) => void;
  onViewResults?: () => void;
  onToggleTheme?: () => void;
  isDark?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ onModelSelect, onViewResults, onToggleTheme, isDark }) => {
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
    <aside className="w-64 h-full bg-surface border-r border-border flex flex-col flex-shrink-0 z-30">
      <nav className="flex-1 px-4 py-6 flex flex-col gap-2 overflow-y-auto">
        <a href="#" className="flex items-center gap-3 px-4 py-3 text-primary bg-primary/10 rounded-lg font-medium transition-colors">
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </a>
        

        {/* Models Dropdown */}
        <div className="relative" ref={modelsDropdownRef}>
          <button 
            onClick={() => {
              setIsModelsDropdownOpen(!isModelsDropdownOpen);
              setIsSettingsDropdownOpen(false);
            }}
            className="w-full flex items-center justify-between px-4 py-3 text-blue-700 hover:text-primary hover:bg-blue-50/50 rounded-lg transition-colors focus:outline-none"
          >
            <div className="flex items-center gap-3">
              <Box className="w-5 h-5" />
              <span>Models</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isModelsDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isModelsDropdownOpen && (
            <div className="mt-1 ml-4 border-l border-blue-100 flex flex-col gap-1 pl-2">
              <button onClick={() => { onModelSelect?.('cranium'); setIsModelsDropdownOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 hover:text-primary rounded-md transition-colors">CRANIUM (Calvaria)</button>
              <button onClick={() => { onModelSelect?.('mandible'); setIsModelsDropdownOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 hover:text-primary rounded-md transition-colors">MANDIBLE (Lower Jaw)</button>
              <button onClick={() => { onModelSelect?.('maxilla'); setIsModelsDropdownOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 hover:text-primary rounded-md transition-colors">MAXILLA (Upper Jaw)</button>
              <button onClick={() => { onModelSelect?.('mandible-classification'); setIsModelsDropdownOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 hover:text-primary rounded-md transition-colors">MANDIBLE CLASSIFICATION</button>
            </div>
          )}
        </div>

        <button 
          onClick={onViewResults} 
          className="flex items-center gap-3 px-4 py-3 text-blue-700 hover:text-primary hover:bg-blue-50/50 rounded-lg transition-colors font-medium text-left"
        >
          <MonitorPlay className="w-5 h-5" />
          3D Viewer
        </button>
      </nav>

      <div className="p-4 border-t border-border">
        {/* Settings Dropdown */}
        <div className="relative" ref={settingsDropdownRef}>
          <button 
            onClick={() => {
              setIsSettingsDropdownOpen(!isSettingsDropdownOpen);
              setIsModelsDropdownOpen(false);
            }}
            className="w-full flex items-center justify-between px-4 py-3 text-blue-700 hover:text-primary hover:bg-blue-50/50 rounded-lg transition-colors focus:outline-none font-medium"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isSettingsDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isSettingsDropdownOpen && (
            <div className="absolute bottom-full mb-2 left-0 w-full bg-white border border-blue-100 rounded-lg shadow-lg overflow-hidden py-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
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
      </div>
    </aside>
  );
};
