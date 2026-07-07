import React, { useState, Suspense, useMemo } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Center, Environment } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import * as THREE from 'three';

// --- UI Overlay Components ---

interface ToggleProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const ToggleButton: React.FC<ToggleProps> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
      active
        ? 'bg-blue-600 text-white shadow-md'
        : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50'
    }`}
  >
    {label}
  </button>
);

// --- 3D Mesh Loader Component ---

interface MeshLoaderProps {
  defectUrl: string;
  implantUrl: string;
  showDefect: boolean;
  showImplant: boolean;
}

const ModelLoader: React.FC<MeshLoaderProps> = ({ defectUrl, implantUrl, showDefect, showImplant }) => {
  // Use OBJLoader by default. If your backend returns STLs, change OBJLoader to STLLoader.
  // Example for STL:
  // const defectGeom = useLoader(STLLoader, defectUrl);
  // return <mesh geometry={defectGeom}><meshStandardMaterial .../></mesh>

  const defectObj = useLoader(OBJLoader, defectUrl);
  const implantObj = useLoader(OBJLoader, implantUrl);

  // We memoize the materials so they aren't recreated on every render
  const boneMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#fdfbf7', // Ivory/Off-white
    roughness: 0.8,
    metalness: 0.1,
    side: THREE.DoubleSide
  }), []);

  const implantMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#0ea5e9', // Medical cyan/blue to contrast and match theme
    roughness: 0.3,
    metalness: 0.6,
    clearcoat: 0.8, // subtle gloss
    side: THREE.DoubleSide
  }), []);

  // Apply materials to all children in the loaded OBJs
  useMemo(() => {
    defectObj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = boneMaterial;
      }
    });
    implantObj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = implantMaterial;
      }
    });
  }, [defectObj, implantObj, boneMaterial, implantMaterial]);

  return (
    <Center>
      {showDefect && <primitive object={defectObj} />}
      {showImplant && <primitive object={implantObj} />}
    </Center>
  );
};

// --- Mock Geometry for Fallback/Demo if URLs fail ---
// This is just to ensure you see something while integrating the backend
const FallbackMeshes = ({ showDefect, showImplant }: { showDefect: boolean, showImplant: boolean }) => (
  <Center>
    {showDefect && (
      <mesh position={[-1, 0, 0]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial color="#fdfbf7" roughness={0.8} metalness={0.1} />
      </mesh>
    )}
    {showImplant && (
      <mesh position={[1.5, 0, 0]}>
        <boxGeometry args={[1.5, 2, 1.5]} />
        <meshStandardMaterial color="#0ea5e9" roughness={0.3} metalness={0.6} />
      </mesh>
    )}
  </Center>
);


// --- Main Viewer Component ---

interface MedicalModelViewerProps {
  defectUrl?: string; // Optional for now to support fallback demo
  implantUrl?: string;
}

export const MedicalModelViewer: React.FC<MedicalModelViewerProps> = ({ defectUrl, implantUrl }) => {
  const [viewState, setViewState] = useState<'assembly' | 'defect' | 'implant'>('assembly');

  return (
    <div className="w-full h-full relative bg-blue-950 flex flex-col rounded-lg overflow-hidden border border-blue-900 shadow-inner">
      
      {/* 3D Canvas Container */}
      <div className="flex-1 relative">
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
          {/* Clinical Lighting Setup */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
          <directionalLight position={[-10, -10, -5]} intensity={0.5} />
          <pointLight position={[0, 10, 0]} intensity={1} color="#ffffff" />
          
          <Suspense fallback={null}>
            {defectUrl && implantUrl ? (
              <ModelLoader 
                defectUrl={defectUrl}
                implantUrl={implantUrl}
                showDefect={viewState === 'assembly' || viewState === 'defect'}
                showImplant={viewState === 'assembly' || viewState === 'implant'}
              />
            ) : (
              <FallbackMeshes 
                showDefect={viewState === 'assembly' || viewState === 'defect'}
                showImplant={viewState === 'assembly' || viewState === 'implant'}
              />
            )}
          </Suspense>

          <OrbitControls 
            makeDefault
            minDistance={2}
            maxDistance={20}
            enableDamping
            dampingFactor={0.05}
          />
        </Canvas>

        {/* CSS Loading Overlay Fallback */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center -z-10">
          <div className="text-blue-300 font-mono text-sm animate-pulse flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            Loading 3D Meshes...
          </div>
        </div>
      </div>

      {/* Floating Toggle Controls Overlay */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2 bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-lg border border-blue-100">
        <ToggleButton 
          label="Show Assembly" 
          active={viewState === 'assembly'} 
          onClick={() => setViewState('assembly')} 
        />
        <div className="w-px bg-blue-200 mx-1"></div>
        <ToggleButton 
          label="Isolate Defect" 
          active={viewState === 'defect'} 
          onClick={() => setViewState('defect')} 
        />
        <ToggleButton 
          label="Isolate Implant" 
          active={viewState === 'implant'} 
          onClick={() => setViewState('implant')} 
        />
      </div>

    </div>
  );
};
