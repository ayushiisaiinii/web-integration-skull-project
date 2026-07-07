import React, { useCallback, useState } from 'react';
import type { ModelType } from '../hooks/useAppFlow';
import { ArrowLeft, UploadCloud, File, AlertCircle } from 'lucide-react';

interface UploadZoneProps {
  model: ModelType;
  onBack: () => void;
  onUpload: (file: File) => void;
  onRunReconstruction: () => void;
  uploadedFile: File | null;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ 
  model, 
  onBack, 
  onUpload, 
  onRunReconstruction,
  uploadedFile
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const validateAndUpload = (file: File) => {
    setError(null);
    const validExtensions = ['.zip'];
    const isValid = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    
    if (!isValid) {
      setError('Invalid file type. Please upload a .zip (DICOM Archive) file.');
      return;
    }
    
    onUpload(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndUpload(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndUpload(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 px-6">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-blue-600 hover:text-accent transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Selection
      </button>

      <div className="bg-surface border border-border rounded-xl p-8 shadow-lg relative overflow-hidden">
        {/* Glow accent bar at the top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-accent shadow-glow"></div>

        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center p-2 border border-blue-100 flex-shrink-0">
            <img 
              src={`/models/${model}.png`} 
              alt={`${model} model`}
              className="max-h-full object-contain mix-blend-multiply"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-2 capitalize">
              {model} Upload Zone
            </h2>
            <p className="text-blue-700">
              Upload patient CT/MRI scan to begin AI reconstruction analysis.
            </p>
          </div>
        </div>

        <div 
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
            isDragging 
              ? 'border-accent bg-accent-glow bg-opacity-10' 
              : 'border-border hover:border-slate-500 bg-background'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {uploadedFile ? (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-4 border border-accent text-accent">
                <File className="w-8 h-8" />
              </div>
              <p className="text-lg font-semibold text-blue-900">{uploadedFile.name}</p>
              <p className="text-sm text-blue-700 mt-2">
                {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              <button 
                onClick={() => onUpload(null as any)}
                className="mt-4 text-sm text-red-500 hover:text-red-400 underline underline-offset-4"
              >
                Remove File
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <UploadCloud className="w-16 h-16 text-blue-500 mb-4" />
              <p className="text-lg text-blue-700 mb-2">
                <span className="font-bold text-blue-900">DRAG & DROP</span> or <span className="font-bold text-blue-900">CLICK</span> to Upload
              </p>
              <p className="text-sm text-blue-500 mb-6">
                Accepted format: .ZIP (DICOM Archive)
              </p>
              
              <label className="cursor-pointer bg-surface border border-border hover:border-accent hover:text-accent transition-colors px-6 py-2 rounded-md font-medium text-blue-700">
                Browse Files
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".zip,application/zip"
                  onChange={handleChange}
                />
              </label>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button
            onClick={onRunReconstruction}
            disabled={!uploadedFile}
            className={`px-8 py-3 rounded-md font-bold tracking-wide transition-all duration-300 flex items-center gap-2 ${
              uploadedFile 
                ? 'bg-accent text-white hover:bg-sky-400 shadow-glow' 
                : 'bg-blue-50 text-blue-400 cursor-not-allowed border border-border'
            }`}
          >
            RUN AI RECONSTRUCTION
          </button>
        </div>
      </div>
    </div>
  );
};
