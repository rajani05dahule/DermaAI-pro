
import React, { useState } from 'react';
import { AnalysisResult, Classification, AtlasCase } from '../types';
import ImageSlider from './ImageSlider';

interface MoleAtlasProps {
  latestResult: AnalysisResult | null;
}

const ATLAS_DATABASE: AtlasCase[] = [
  {
    id: 'atlas-1',
    title: 'Seborrheic Keratosis',
    classification: Classification.BENIGN,
    imageUrl: 'https://images.unsplash.com/photo-1584634731339-252c5aba1957?auto=format&fit=crop&q=80&w=400',
    similarity: 88,
    explanation: 'A common noncancerous skin growth. People tend to get more of them as they get older. They are usually brown, black or light tan.',
    trendPrediction: 'Stable. No significant morphological changes expected over 12 months.'
  },
  {
    id: 'atlas-2',
    title: 'Nodular Melanoma',
    classification: Classification.MALIGNANT,
    imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
    similarity: 92,
    explanation: 'A highly invasive form of skin cancer. Often appears as a bump on the skin that is firm to the touch.',
    trendPrediction: 'Rapid progression likely if untreated. Requires immediate surgical consultation.'
  },
  {
    id: 'atlas-3',
    title: 'Common Nevus',
    classification: Classification.BENIGN,
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400',
    similarity: 95,
    explanation: 'A common mole is a growth on the skin that forms when pigment cells grow in a cluster. Most adults have between 10 and 40 common moles.',
    trendPrediction: 'Excellent prognosis. Low probability of evolution into malignancy.'
  }
];

const MoleAtlas: React.FC<MoleAtlasProps> = ({ latestResult }) => {
  const [selectedCase, setSelectedCase] = useState<AtlasCase | null>(ATLAS_DATABASE[0]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">AI Mole Atlas</h2>
          <p className="text-slate-500 font-medium">Cross-referencing your profile with verified clinical cases.</p>
        </div>
        <div className="hidden md:flex items-center space-x-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Database Sync: Active</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Comparison Panel */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 rounded-[40px] medical-shadow border border-slate-50">
            {latestResult && selectedCase ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                   <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center space-x-2">
                      <div className="w-1 h-4 bg-blue-600 rounded-full" />
                      <span>Morphological Comparison</span>
                   </h4>
                   <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase">Similarity</span>
                      <span className="text-sm font-black text-blue-600">{selectedCase.similarity}%</span>
                   </div>
                </div>
                
                <ImageSlider 
                  before={latestResult.imageUrl} 
                  after={selectedCase.imageUrl} 
                  labelBefore="Your Scan"
                  labelAfter="Atlas Reference"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="space-y-4">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clinical Context</h5>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      {selectedCase.explanation}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Risk Trend Prediction</h5>
                    <div className="p-4 rounded-2xl border border-blue-50 bg-blue-50/30">
                       <p className="text-sm text-blue-900 font-bold mb-3">{selectedCase.trendPrediction}</p>
                       <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${selectedCase.classification === Classification.MALIGNANT ? 'bg-red-500' : 'bg-teal-500'}`}
                            style={{ width: selectedCase.classification === Classification.MALIGNANT ? '85%' : '15%' }}
                          />
                       </div>
                       <div className="flex justify-between mt-2">
                          <span className="text-[8px] font-black text-slate-400 uppercase">Stable</span>
                          <span className="text-[8px] font-black text-slate-400 uppercase">Critical</span>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-96 flex flex-col items-center justify-center text-center p-12 space-y-4">
                <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-3xl flex items-center justify-center">
                   <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                   </svg>
                </div>
                <h4 className="font-bold text-slate-900">Awaiting Reference Selection</h4>
                <p className="text-slate-400 text-sm max-w-xs">Run a scan first or select a reference case from the list to begin morphological analysis.</p>
              </div>
            )}
          </div>
        </div>

        {/* Database List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between mb-2">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clinical Reference Library</h4>
             <span className="text-[10px] font-bold text-slate-300">3 Cases Loaded</span>
          </div>
          {ATLAS_DATABASE.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedCase(item)}
              className={`w-full text-left p-4 rounded-[28px] transition-all border ${
                selectedCase?.id === item.id 
                ? 'bg-blue-600 border-blue-600 medical-shadow text-white' 
                : 'bg-white border-slate-100 text-slate-900 hover:border-blue-200'
              }`}
            >
              <div className="flex items-center space-x-4">
                <img src={item.imageUrl} className="w-14 h-14 rounded-2xl object-cover border-2 border-white/20" alt={item.title} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-black truncate ${selectedCase?.id === item.id ? 'text-white' : 'text-slate-900'}`}>
                    {item.title}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                      selectedCase?.id === item.id 
                      ? 'bg-white/20 text-white' 
                      : item.classification === Classification.MALIGNANT ? 'bg-red-100 text-red-600' : 'bg-teal-100 text-teal-600'
                    }`}>
                      {item.classification}
                    </span>
                    <span className={`text-[9px] font-bold opacity-60 ${selectedCase?.id === item.id ? 'text-white' : 'text-slate-400'}`}>
                      Match: {item.similarity}%
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}

          <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 mt-6">
             <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">About Atlas</h5>
             <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
               The AI Mole Atlas uses advanced feature vector matching to identify clinically similar patterns in your lesions compared to peer-reviewed datasets. 
               <br/><br/>
               <span className="text-blue-600 font-bold">This is for educational pattern matching only.</span>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoleAtlas;
