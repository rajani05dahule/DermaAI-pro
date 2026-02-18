
import React from 'react';

const TechnicalDetails: React.FC = () => {
  const specs = [
    { label: 'Architecture', value: 'MobileNetV2 + Custom Dense Layers', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { label: 'Input Resolution', value: '224 x 224 pixels (RGB)', icon: 'M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4' },
    { label: 'Optimizer', value: 'Adam (lr=0.0001)', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { label: 'Loss Function', value: 'Categorical Crossentropy', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Technical Architecture</h2>
        <p className="text-slate-500 font-medium">Deep learning specifications and training methodology.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Specs */}
        <div className="bg-white p-8 rounded-[40px] medical-shadow border border-slate-50 space-y-6">
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center space-x-2">
            <div className="w-1 h-4 bg-blue-600 rounded-full" />
            <span>Model Specifications</span>
          </h4>
          <div className="space-y-4">
            {specs.map((spec, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={spec.icon} />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{spec.label}</p>
                  <p className="text-sm font-bold text-slate-900">{spec.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Training Strategy */}
        <div className="bg-white p-8 rounded-[40px] medical-shadow border border-slate-50 space-y-6">
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center space-x-2">
            <div className="w-1 h-4 bg-teal-500 rounded-full" />
            <span>Training Protocol</span>
          </h4>
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">Data Split</p>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-black text-slate-900">80</span>
                  <span className="text-slate-300 font-bold">/</span>
                  <span className="text-xl font-black text-teal-600">20</span>
                </div>
                <p className="text-[9px] font-bold text-slate-400">Train vs. Validation</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">Epochs</p>
                <p className="text-xl font-black text-slate-900">50</p>
                <p className="text-[9px] font-bold text-slate-400">Full Dataset Cycles</p>
              </div>
            </div>

            <div className="p-5 bg-teal-50/50 rounded-[28px] border border-teal-100">
              <h5 className="text-[10px] font-black text-teal-700 uppercase tracking-widest mb-2">Data Augmentation</h5>
              <p className="text-[11px] text-teal-800/70 font-medium leading-relaxed">
                Real-time geometric transformations applied to prevent overfitting: 
                <span className="font-bold"> Horizontal/Vertical Flips, Rotations (±20°), Brightness Shifting, and Zoom Range (0.2).</span>
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
               <span className="text-xs font-black text-blue-900">Final Validation Accuracy</span>
               <span className="text-lg font-black text-blue-600">94.2%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Architecture Visualization (Simplified) */}
      <div className="bg-white p-8 rounded-[40px] medical-shadow border border-slate-50">
        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center space-x-2">
          <div className="w-1 h-4 bg-indigo-500 rounded-full" />
          <span>Pipeline Visualizer</span>
        </h4>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 relative">
          {[
            { label: 'Image Input', desc: '224x224x3', color: 'bg-slate-100 text-slate-600' },
            { label: 'CNN Backbone', desc: 'Feature Extraction', color: 'bg-blue-100 text-blue-600' },
            { label: 'Global Pooling', desc: 'Dimensionality Reduction', color: 'bg-indigo-100 text-indigo-600' },
            { label: 'Softmax Output', desc: 'Multi-class Prediction', color: 'bg-teal-100 text-teal-600' },
          ].map((node, i, arr) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center z-10 w-full md:w-auto">
                <div className={`px-6 py-4 rounded-2xl ${node.color} border-2 border-white shadow-sm text-center w-full md:w-48`}>
                  <p className="text-[10px] font-black uppercase tracking-tighter">{node.label}</p>
                  <p className="text-[9px] font-bold opacity-70">{node.desc}</p>
                </div>
              </div>
              {i < arr.length - 1 && (
                <div className="hidden md:flex flex-1 h-0.5 bg-slate-100 mx-2 items-center justify-center">
                  <svg className="w-4 h-4 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      <div className="bg-blue-600 p-8 rounded-[40px] text-white overflow-hidden relative">
         <div className="absolute top-0 right-0 p-8 opacity-10">
            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
         </div>
         <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-2">Performance Summary</h4>
         <p className="text-sm font-medium leading-relaxed opacity-90 max-w-xl">
           Our system leverages a pre-trained MobileNetV2 architecture fine-tuned on the ISIC Archive. By utilizing transfer learning, we achieve high diagnostic accuracy while maintaining a lightweight footprint suitable for real-time mobile inference.
         </p>
      </div>
    </div>
  );
};

export default TechnicalDetails;
