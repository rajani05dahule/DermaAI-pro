
import React, { useState, useEffect } from 'react';

interface AIScanOverlayProps {
  currentImage: string;
  onComplete?: () => void;
}

const AIScanOverlay: React.FC<AIScanOverlayProps> = ({ currentImage }) => {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const steps = [
    "Calibrating Optics",
    "Extracting Morphological Features",
    "Mapping ABCDE Indicators",
    "Neural Network Inference",
    "Synthesizing Clinical Report"
  ];

  useEffect(() => {
    const totalDuration = 6000; 
    const intervalTime = 50; // Update every 50ms
    const increment = 100 / (totalDuration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + increment;
      });
    }, intervalTime);

    const stepInterval = setInterval(() => {
      setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, totalDuration / steps.length);

    return () => {
      clearInterval(timer);
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[150] bg-white flex flex-col items-center justify-center p-6 animate-in fade-in duration-700">
      {/* Dynamic Neural Network Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.05]">
        <svg width="100%" height="100%" className="animate-pulse">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2563eb" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <g className="animate-pulse">
            {Array.from({ length: 40 }).map((_, i) => (
              <circle
                key={i}
                cx={`${Math.random() * 100}%`}
                cy={`${Math.random() * 100}%`}
                r={Math.random() * 3 + 2}
                fill="#2563eb"
              />
            ))}
          </g>
        </svg>
      </div>

      <div className="max-w-md w-full relative z-10 flex flex-col items-center">
        {/* Scanned Image Container with Glowing Border */}
        <div className="relative group w-72 h-72 mb-20 rounded-[56px] p-1.5 bg-gradient-to-br from-blue-500/30 via-blue-500/10 to-teal-500/30 shadow-[0_0_80px_rgba(37,99,235,0.2)]">
          <div className="absolute -inset-2 bg-blue-500/20 rounded-[64px] blur-2xl animate-pulse" />
          <div className="relative w-full h-full rounded-[50px] overflow-hidden border-[8px] border-white shadow-2xl">
            <img 
              src={currentImage} 
              className="w-full h-full object-cover grayscale-[0.2] brightness-95 scale-110" 
              alt="Scanning" 
            />
            
            {/* Laser Scan Line */}
            <div className="absolute inset-x-0 h-[3px] bg-blue-500 shadow-[0_0_30px_5px_#3b82f6] z-20 scan-line" />
            
            {/* HUD Overlay Elements */}
            <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none opacity-60">
              <div className="flex justify-between">
                <div className="w-8 h-8 border-t-4 border-l-4 border-blue-400" />
                <div className="w-8 h-8 border-t-4 border-r-4 border-blue-400" />
              </div>
              <div className="flex justify-between">
                <div className="w-8 h-8 border-b-4 border-l-4 border-blue-400" />
                <div className="w-8 h-8 border-b-4 border-r-4 border-blue-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Progress HUD */}
        <div className="text-center w-full space-y-8">
          <div className="flex flex-col items-center">
            <div className="text-7xl font-black text-slate-900 tracking-tighter mb-2 tabular-nums">
              {Math.min(100, Math.floor(progress))}<span className="text-blue-600">%</span>
            </div>
            <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.5em]">Diagnostic Stream</span>
            </div>
          </div>

          {/* Minimal Progress Line */}
          <div className="w-64 h-2 bg-slate-100 rounded-full mx-auto overflow-hidden shadow-inner">
            <div 
              className="h-full bg-blue-600 transition-all duration-300 ease-out shadow-[0_0_20px_rgba(37,99,235,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Active Process Log */}
          <div className="bg-white border-2 border-slate-100 rounded-[40px] p-8 text-left space-y-4 medical-shadow w-full max-w-sm">
            <div className="flex items-center justify-between mb-2">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Threads</span>
               <div className="w-2 h-2 bg-blue-600 rounded-full animate-ping" />
            </div>
            {steps.map((s, i) => (
              <div key={i} className={`flex items-center space-x-4 transition-all duration-500 ${i <= step ? 'opacity-100 scale-100' : 'opacity-20 scale-95'}`}>
                <div className={`w-2 h-2 rounded-full ${i <= step ? 'bg-blue-600 shadow-[0_0_8px_#2563eb]' : 'bg-slate-300'}`} />
                <span className={`text-xs font-black uppercase tracking-tight ${i === step ? 'text-blue-600' : 'text-slate-600'}`}>
                  {s}
                  {i === step && <span className="ml-2 animate-pulse">_</span>}
                </span>
                {i < step && (
                  <svg className="w-4 h-4 text-teal-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 flex items-center space-x-3 px-6 py-3 bg-blue-600 rounded-full shadow-2xl shadow-blue-200">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">End-to-End Encryption Enabled</span>
        </div>
      </div>
    </div>
  );
};

export default AIScanOverlay;
