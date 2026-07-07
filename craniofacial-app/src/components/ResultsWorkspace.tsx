import React from 'react';
import { ArrowLeft, Maximize, Settings, Download, RotateCw } from 'lucide-react';
import type { ModelType } from '../hooks/useAppFlow';
import { MedicalModelViewer } from './MedicalModelViewer';
import { CtSliceViewer } from "./CtSliceViewer";

interface ResultsWorkspaceProps {
  model: ModelType;
  data: any;
  onReset: () => void;
}

export const ResultsWorkspace: React.FC<ResultsWorkspaceProps> = ({ model, data, onReset }) => {
  return (
    <div className="w-full h-[calc(100vh-80px)] flex flex-col bg-background p-4 gap-4">
      
      {/* Top action bar */}
      <div className="flex items-center justify-between bg-surface border border-border rounded-lg p-3 px-6 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={onReset}
            className="p-2 hover:bg-blue-50 rounded-md text-blue-500 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-blue-900 capitalize border-l border-border pl-4">
            {model} Reconstruction Results
          </h2>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm font-mono text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
            CONFIDENCE: {Math.round(data?.metadata?.confidence_score * 100) || 98}%
          </span>
          <button className="flex items-center gap-2 bg-primary hover:bg-blue-400 text-white px-4 py-2 rounded-md transition-colors font-medium text-sm">
            <Download className="w-4 h-4" />
            Export Mesh
          </button>
        </div>
      </div>

      {/* Split workspace */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
        
        {/* Left: 2D Scan Slices (Placeholder) */}
        <div className="flex-1 bg-surface border border-border rounded-lg overflow-hidden flex flex-col">

    <CtSliceViewer
        label="AXIAL"
        baseUrl={`${data?.sliceBaseUrl}/axial`}
        count={data?.axialCount || 0}
    />

    <CtSliceViewer
        label="SAGITTAL"
        baseUrl={`${data?.sliceBaseUrl}/sagittal`}
        count={data?.sagittalCount || 0}
    />

</div>

        {/* Right: 3D Mesh Viewer (Placeholder) */}
        <div className="flex-[1.5] bg-surface border border-border rounded-lg overflow-hidden flex flex-col relative">
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-white/80 backdrop-blur text-xs font-mono px-2 py-1 rounded text-blue-700 border border-border">3D RECONSTRUCTION</span>
          </div>
          
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <button 
              className="flex items-center gap-2 px-3 py-1.5 bg-accent text-white backdrop-blur rounded hover:bg-blue-600 transition-colors shadow-sm"
              title="Download Implant File (.STL)"
            >
              <Download className="w-4 h-4" />
              <span className="text-xs font-bold">Download Implant</span>
            </button>
            <button className="p-1.5 bg-white/80 backdrop-blur rounded text-blue-600 hover:text-primary border border-border">
              <Maximize className="w-4 h-4" />
            </button>
          </div>

          {/* 3D Viewport Component */}
          <div className="flex-1 relative overflow-hidden">
            <MedicalModelViewer
               defectUrl={data?.defectUrl}
               implantUrl={data?.implantUrl}
            />

            {/* Mesh stats overlay (Moved above the viewer to avoid colliding with viewer controls) */}
            <div className="absolute top-16 right-4 bg-white/90 backdrop-blur border border-border p-3 rounded-md text-xs font-mono text-blue-700 pointer-events-none">
              <div className="flex justify-between gap-4">
                <span>Vertices:</span>
                <span className="text-blue-900 font-bold">{data?.metadata?.vertices?.toLocaleString() || '24,500'}</span>
              </div>
              <div className="flex justify-between gap-4 mt-1">
                <span>Faces:</span>
                <span className="text-blue-900 font-bold">{data?.metadata?.faces?.toLocaleString() || '48,900'}</span>
              </div>
              <div className="flex justify-between gap-4 mt-1">
                <span>Status:</span>
                <span className="text-blue-500 font-bold">READY</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
