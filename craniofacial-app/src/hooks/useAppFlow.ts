import { useState } from 'react';

export type ModelType = 'cranium' | 'mandible' | 'maxilla' | 'mandible-classification';
export type Step = 'select' | 'upload' | 'processing' | 'results';

export const useAppFlow = () => {
  const [activeModel, setActiveModel] = useState<ModelType | null>(null);
  const [currentStep, setCurrentStep] = useState<Step>('select');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [reconstructionData, setReconstructionData] = useState<any>(null);

  const selectModel = (model: ModelType) => {
    setActiveModel(model);
    setCurrentStep('upload');
  };

  const goBackToSelect = () => {
    setActiveModel(null);
    setCurrentStep('select');
    setUploadedFile(null);
  };

  const handleUpload = (file: File) => {
    setUploadedFile(file);
  };

  const startProcessing = () => {
    setCurrentStep('processing');
  };

  const completeProcessing = (data: any) => {
    setReconstructionData(data);
    setCurrentStep('results');
  };
  
  const resetFlow = () => {
    setActiveModel(null);
    setCurrentStep('select');
    setUploadedFile(null);
    setReconstructionData(null);
  };

  const jumpToResults = () => {
    if (!activeModel) setActiveModel('cranium'); // Default if none selected
    setCurrentStep('results');
  };

  return {
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
  };
};
