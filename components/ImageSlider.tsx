
import React, { useState, useRef, useEffect } from 'react';

interface ImageSliderProps {
  before: string;
  after: string;
  labelBefore: string;
  labelAfter: string;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ before, after, labelBefore, labelAfter }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const position = ((x - rect.left) / rect.width) * 100;
    setSliderPos(Math.min(Math.max(position, 0), 100));
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-square rounded-[32px] overflow-hidden medical-shadow cursor-ew-resize select-none border-4 border-white"
      onMouseMove={handleMove}
      onTouchMove={handleMove}
    >
      <img src={after} className="absolute inset-0 w-full h-full object-cover" alt="After" />
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden" 
        style={{ width: `${sliderPos}%` }}
      >
        <img src={before} className="absolute inset-0 w-[400px] h-[400px] max-w-none object-cover" style={{ width: containerRef.current?.offsetWidth }} alt="Before" />
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute inset-y-0 w-1 bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.5)] z-10"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center border-2 border-blue-500">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8 9l-3 3m0 0l3 3m-3-3h14m-3-6l3 3m0 0l-3 3" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900 border border-white/50">
        {labelBefore}
      </div>
      <div className="absolute bottom-4 right-4 bg-blue-600/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-blue-400/50">
        {labelAfter}
      </div>
    </div>
  );
};

export default ImageSlider;
