import React, { useState } from 'react';

interface Props { label: string; baseUrl: string; count: number; }

export const CtSliceViewer: React.FC<Props> = ({ label, baseUrl, count }) => {
  const [index, setIndex] = useState(Math.floor(count / 2));

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setIndex((prev) => {
      const next = prev + (e.deltaY > 0 ? 1 : -1);
      return Math.max(0, Math.min(count - 1, next));
    });
  };

  return (
    <div className="flex-1 bg-blue-950 flex items-center justify-center relative" onWheel={handleWheel}>
      <span className="absolute top-2 left-2 z-10 bg-white/80 text-xs font-mono px-2 py-1 rounded text-blue-700">{label}</span>
      <span className="absolute top-2 right-2 z-10 bg-white/80 text-xs font-mono px-2 py-1 rounded text-blue-700">Z: {index}/{count - 1}</span>
      {count > 0
        ? <img src={`${baseUrl}/${index}.png`} alt={`${label} slice ${index}`} className="max-h-full max-w-full object-contain select-none" draggable={false} />
        : <div className="text-blue-300 text-xs font-mono">No slices available</div>}
    </div>
  );
};