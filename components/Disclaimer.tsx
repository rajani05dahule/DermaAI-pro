
import React from 'react';

const Disclaimer: React.FC = () => {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-start space-x-4">
      <div className="mt-0.5 w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 border border-slate-100 text-slate-400">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div>
        <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest mb-1.5">Regulatory Notice</p>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          This system serves as an <span className="text-blue-600 font-bold">AI-Assisted Screening Utility</span> and does not constitute a definitive medical diagnosis. All assessments are probabilistic and provided for preliminary screening purposes only. Clinical validation by a certified dermatologist is mandatory for any clinical action or treatment planning.
        </p>
      </div>
    </div>
  );
};

export default Disclaimer;
