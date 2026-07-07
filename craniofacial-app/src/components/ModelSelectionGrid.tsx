import React from 'react';
import type { ModelType } from '../hooks/useAppFlow';

interface ModelSelectionGridProps {
  onSelect: (model: ModelType) => void;
}

const models = [
  {
    id: 'cranium',
    title: 'CRANIUM (Calvaria)',
    description: 'Targeted AI model for reconstructing defects in the upper skull vault.',
    image: '/models/cranium.png'
  },
  {
    id: 'mandible',
    title: 'MANDIBLE (Lower Jaw)',
    description: 'AI reconstruction of fragmented or missing mandible sections.',
    image: '/models/mandible.png'
  },
  {
    id: 'maxilla',
    title: 'MAXILLA (Upper Jaw)',
    description: 'AI analysis and reconstruction for complex mid-face and maxillary bone loss.',
    image: '/models/maxilla.png'
  }
] as const;

export const ModelSelectionGrid: React.FC<ModelSelectionGridProps> = ({ onSelect }) => {
  return (
    <div className="w-full max-w-6xl mx-auto mt-16 px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-blue-900 mb-4">Select Anatomical Region</h2>
        <p className="text-blue-700 max-w-2xl mx-auto">
          Choose the targeted area for AI-assisted reconstruction. Each model is specifically trained for distinct craniofacial bone structures.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {models.map((model) => (
          <button
            key={model.id}
            onClick={() => onSelect(model.id as ModelType)}
            className="group flex flex-col bg-surface rounded-xl border-2 border-transparent hover:border-primary transition-all duration-300 overflow-hidden shadow-sm hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-primary/20"
          >
            {/* Top Half: Light Blue Background with Image */}
            <div className="w-full h-64 bg-blue-50 flex items-center justify-center p-6 transition-colors group-hover:bg-blue-100">
              <img 
                src={model.image} 
                alt={model.title} 
                className="max-h-full object-contain mix-blend-multiply"
              />
            </div>
            
            {/* Bottom Half: White Background with Text */}
            <div className="w-full bg-white p-8 flex flex-col items-center">
              <h3 className="text-xl font-bold text-blue-900 mb-3 text-center">{model.title}</h3>
              <p className="text-sm text-blue-700 text-center leading-relaxed h-16">
                {model.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
