import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ModelSelectionGrid } from './components/ModelSelectionGrid';
import { UploadZone } from './components/UploadZone';
import { ProcessingOverlay } from './components/ProcessingOverlay';
import { ResultsWorkspace } from './components/ResultsWorkspace';
import { Footer } from './components/Footer';
import { useAppFlow } from './hooks/useAppFlow';
import { handleReconstructionSubmit } from './services/api';
import { useState, useEffect } from 'react';

function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const {
    activeModel,
    currentStep,
    uploadedFile,
    reconstructionData,
    selectModel,
    goBackToSelect,
    handleUpload,
    startProcessing,
    completeProcessing,
    resetFlow,
    jumpToResults
  } = useAppFlow();

  const onRunReconstruction = async () => {
    if (!uploadedFile || !activeModel) return;
    
    startProcessing();
    
    try {
      // Calls the mock API service
      const data = await handleReconstructionSubmit(uploadedFile, activeModel);
      completeProcessing(data);
    } catch (error) {
      console.error("Reconstruction failed", error);
      // Fallback in case of error for demo purposes
      goBackToSelect();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background text-slate-800 dark:text-slate-200 font-sans selection:bg-accent/30 selection:text-accent overflow-hidden transition-colors duration-300">
      
      {/* Top Header (Full Width) */}
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* Fixed Left Sidebar */}
        <Sidebar 
          onModelSelect={selectModel} 
          onViewResults={jumpToResults} 
          onToggleTheme={() => setIsDark(!isDark)} 
          isDark={isDark} 
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <main className="w-full relative flex-1 flex flex-col">
            {currentStep === 'select' && (
          <ModelSelectionGrid onSelect={selectModel} />
        )}
        
        {currentStep === 'upload' && activeModel && (
          <UploadZone 
            model={activeModel} 
            onBack={goBackToSelect}
            onUpload={handleUpload}
            onRunReconstruction={onRunReconstruction}
            uploadedFile={uploadedFile}
          />
        )}

        {currentStep === 'processing' && activeModel && (
          <ProcessingOverlay model={activeModel} />
        )}

        {currentStep === 'results' && activeModel && (
          <ResultsWorkspace 
            model={activeModel} 
            data={reconstructionData} 
            onReset={resetFlow} 
          />
        )}
        </main>

        {currentStep === 'select' && <Footer />}
      </div>
    </div>
  </div>
);
}

export default App;
