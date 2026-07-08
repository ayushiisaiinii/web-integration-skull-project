import React from 'react';
import { Activity } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-surface border-t border-border py-8 px-8 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8 justify-between">
        
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-primary mb-3">
            <Activity className="w-5 h-5 text-accent" />
            <h3 className="font-bold text-blue-900 text-lg">DIC AI Portal</h3>
          </div>
          <p className="text-blue-700 text-sm leading-relaxed max-w-2xl">
            The Craniofacial AI Reconstruction Portal is an advanced medical platform designed to assist surgeons and biomedical engineers. By leveraging state-of-the-art deep learning algorithms, it automatically analyzes patient CT scans to generate precise 3D implant meshes for cranium, maxilla, and mandible defects, significantly reducing surgical planning time and improving patient outcomes.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end text-sm text-blue-500 font-medium">
          <span>&copy; {new Date().getFullYear()} Design Innovation Center</span>
          <span>Confidential Clinical Research</span>
        </div>
      </div>
    </footer>
  );
};
