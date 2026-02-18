
import React from 'react';
import { ModelMetrics } from '../types';

const PERFORMANCE_DATA: ModelMetrics = {
  trainingAccuracy: 96.8,
  validationAccuracy: 94.2,
  precision: 93.5,
  recall: 91.8,
  f1: 92.6,
  confusionMatrix: [[150, 5], [10, 135]]
};

const ModelPerformance: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Diagnostic Fidelity</h2>
        <p className="text-slate-500 font-medium">Internal validation metrics and confusion matrix analytics.</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Training Acc', val: `${PERFORMANCE_DATA.trainingAccuracy}%`, color: 'blue' },
          { label: 'Validation Acc', val: `${PERFORMANCE_DATA.validationAccuracy}%`, color: 'teal' },
          { label: 'Precision', val: `${PERFORMANCE_DATA.precision}%`, color: 'indigo' },
          { label: 'Recall', val: `${PERFORMANCE_DATA.recall}%`, color: 'purple' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] medical-shadow border border-slate-50 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
            <p className={`text-2xl font-black text-${stat.color}-600`}>{stat.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Confusion Matrix */}
        <div className="bg-white p-8 rounded-[40px] medical-shadow border border-slate-50">
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center space-x-2">
            <div className="w-1 h-4 bg-blue-600 rounded-full" />
            <span>Confusion Matrix (N=300)</span>
          </h4>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div />
            <div className="text-[10px] font-black text-slate-400 uppercase">Pred Benign</div>
            <div className="text-[10px] font-black text-slate-400 uppercase">Pred Malign</div>
            
            <div className="text-[10px] font-black text-slate-400 uppercase flex items-center justify-end pr-2">Act Benign</div>
            <div className="bg-blue-600 text-white p-8 rounded-2xl font-black text-xl flex items-center justify-center">150</div>
            <div className="bg-blue-50 text-blue-300 p-8 rounded-2xl font-black text-xl flex items-center justify-center">5</div>
            
            <div className="text-[10px] font-black text-slate-400 uppercase flex items-center justify-end pr-2">Act Malign</div>
            <div className="bg-blue-50 text-blue-300 p-8 rounded-2xl font-black text-xl flex items-center justify-center">10</div>
            <div className="bg-blue-600 text-white p-8 rounded-2xl font-black text-xl flex items-center justify-center">135</div>
          </div>
          <p className="mt-8 text-[11px] text-slate-400 text-center font-medium italic">Diagonal elements represent correct clinical categorizations.</p>
        </div>

        {/* Accuracy Curve (Simulated) */}
        <div className="bg-white p-8 rounded-[40px] medical-shadow border border-slate-50">
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center space-x-2">
            <div className="w-1 h-4 bg-teal-500 rounded-full" />
            <span>Model Convergence (Loss vs Epoch)</span>
          </h4>
          <div className="h-64 flex items-end space-x-2 w-full px-2 pb-6 border-l-2 border-b-2 border-slate-100 relative">
             {/* Loss Curve SVG overlay */}
             <svg className="absolute inset-0 w-full h-full p-2" viewBox="0 0 100 100" preserveAspectRatio="none">
               <path d="M0,80 Q20,30 40,20 T100,5" fill="none" stroke="#2563eb" strokeWidth="2" />
               <path d="M0,90 Q20,40 40,30 T100,10" fill="none" stroke="#14b8a6" strokeWidth="2" strokeDasharray="4 2" />
             </svg>
             <div className="absolute bottom-0 inset-x-0 flex justify-between px-2 translate-y-6">
                <span className="text-[8px] font-black text-slate-300">0</span>
                <span className="text-[8px] font-black text-slate-300">50 Epochs</span>
             </div>
             <div className="absolute left-0 inset-y-0 flex flex-col justify-between -translate-x-8 h-full pb-6">
                <span className="text-[8px] font-black text-slate-300">1.0</span>
                <span className="text-[8px] font-black text-slate-300">0.0</span>
             </div>
          </div>
          <div className="mt-12 flex justify-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-0.5 bg-blue-600" />
              <span className="text-[9px] font-bold text-slate-500 uppercase">Training Loss</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-0.5 bg-teal-500 border-dashed border-t-2" />
              <span className="text-[9px] font-bold text-slate-500 uppercase">Validation Loss</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelPerformance;
