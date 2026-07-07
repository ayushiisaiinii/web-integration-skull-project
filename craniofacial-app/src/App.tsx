import { Header } from './components/Header';
import { ModelSelectionGrid } from './components/ModelSelectionGrid';
import { UploadZone } from './components/UploadZone';
import { ProcessingOverlay } from './components/ProcessingOverlay';
import { ResultsWorkspace } from './components/ResultsWorkspace';
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
    <div className="min-h-screen bg-background text-slate-800 dark:text-slate-200 font-sans selection:bg-accent/30 selection:text-accent overflow-x-hidden transition-colors duration-300">
      <Header onModelSelect={selectModel} onViewResults={jumpToResults} onToggleTheme={() => setIsDark(!isDark)} isDark={isDark} />
      
      <main className="w-full h-full relative">
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
    </div>
  );
}

export default App;
