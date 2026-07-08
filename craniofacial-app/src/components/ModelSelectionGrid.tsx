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
  },
  {
    id: 'mandible-classification',
    title: 'MANDIBLE CLASSIFICATION',
    description: 'AI segmentation and structural classification of mandibular defects.',
    image: '/models/mandible-classification.png'
  }
] as const;

export const ModelSelectionGrid: React.FC<ModelSelectionGridProps> = ({ onSelect }) => {
  return (
    <div className="w-full px-[8vw] mx-auto mb-24">
      <div className="sticky top-0 z-20 pt-4 pb-12 mb-2">
        <div className="absolute inset-0 pointer-events-none -z-10 bg-gradient-to-b from-background from-55% to-transparent backdrop-blur-md [mask-image:linear-gradient(to_bottom,black_55%,transparent_100%)]" />
        <div className="text-left pl-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-blue-950 mb-2 tracking-tight">Select Anatomical Region</h2>
          <p className="text-blue-700/80 text-sm md:text-base font-medium max-w-2xl">
            Choose the targeted area for AI-assisted reconstruction. Each model is specifically trained for distinct craniofacial bone structures.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full mx-auto">
        {models.map((model) => (
          <button
            key={model.id}
            onClick={() => onSelect(model.id as ModelType)}
            className="group flex flex-col sm:flex-row h-auto sm:h-64 bg-surface rounded-xl border-2 border-transparent hover:border-primary transition-all duration-300 overflow-hidden shadow-sm hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-primary/20 text-left"
          >
            {/* Left 40%: Image */}
            <div className="w-full sm:w-[40%] h-56 sm:h-full bg-[var(--color-img-bg)] flex items-center justify-center transition-colors group-hover:bg-[var(--color-img-bg-hover)] shrink-0 overflow-hidden">
              <img 
                src={model.image} 
                alt={model.title} 
                className="w-full h-full object-cover object-center mix-blend-multiply"
              />
            </div>
            
            {/* Right 60%: Text */}
            <div className="w-full sm:w-[60%] bg-white p-6 sm:p-8 flex flex-col justify-center">
              <h3 className="text-xl md:text-2xl font-bold text-blue-900 mb-3">{model.title}</h3>
              <p className="text-sm md:text-base text-blue-700 leading-relaxed">
                {model.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
