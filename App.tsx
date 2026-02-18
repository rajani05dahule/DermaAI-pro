
import React, { useState, useCallback, useRef, useEffect } from 'react';
import Header from './components/Header';
import Disclaimer from './components/Disclaimer';
import ResultCard from './components/ResultCard';
import CameraCapture from './components/CameraCapture';
import AIScanOverlay from './components/AIScanOverlay';
import Dashboard from './components/Dashboard';
import MoleAtlas from './components/MoleAtlas';
import AuthScreen from './components/AuthScreen';
import PatientManagement from './components/PatientManagement';
import ModelPerformance from './components/ModelPerformance';
import TechnicalDetails from './components/TechnicalDetails';
import ChatBot from './components/ChatBot';
import { AnalysisResult, Classification, RiskLevel, Patient, AuthUser } from './types';
import { analyzeSkinLesion } from './services/geminiService';
import { processImage } from './utils/imageProcessor';

const INITIAL_PATIENTS: Patient[] = [];

const App: React.FC = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [currentScanningImage, setCurrentScanningImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'chat' | 'patients' | 'accuracy' | 'technical' | 'atlas' | 'profile'>('home');
  const [isDragging, setIsDragging] = useState(false);
  
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('dermai_patients');
    return saved ? JSON.parse(saved, (key, value) => 
      key.includes('Date') || key === 'timestamp' ? new Date(value) : value
    ) : INITIAL_PATIENTS;
  });

  const [results, setResults] = useState<AnalysisResult[]>(() => {
    const saved = localStorage.getItem('dermai_history');
    return saved ? JSON.parse(saved, (key, value) => 
      key === 'timestamp' ? new Date(value) : value
    ) : [];
  });

  const [queue, setQueue] = useState<{ preview: string; base64: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('dermai_history', JSON.stringify(results));
    localStorage.setItem('dermai_patients', JSON.stringify(patients));
  }, [results, patients]);

  const handleCapture = async (blob: Blob) => {
    const processed = await processImage(blob);
    setQueue(prev => [...prev, processed]);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((f: File) => {
      if (f.type.startsWith('image/')) {
        processImage(f).then(p => setQueue(v => [...v, p]));
      }
    });
  };

  useEffect(() => {
    if (queue.length > 0 && !isAnalyzing) {
      startAnalysis();
    }
  }, [queue]);

  const startAnalysis = async () => {
    if (queue.length === 0) return;
    setIsAnalyzing(true);
    
    try {
      const newResults: AnalysisResult[] = [];
      for (const item of queue) {
        setCurrentScanningImage(item.preview);
        const analysis = await analyzeSkinLesion(item.base64, item.preview);
        newResults.push(analysis);
      }
      setResults(prev => [...newResults, ...prev]);
      setQueue([]);
      setTimeout(() => {
        setIsAnalyzing(false);
        setCurrentScanningImage(null);
        setActiveTab('home');
      }, 500);
    } catch (error) {
      console.error(error);
      alert("AI analysis error. Please check connectivity.");
      setIsAnalyzing(false);
      setCurrentScanningImage(null);
      setQueue([]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleLogin = (email: string) => {
    setUser({ id: 'USR-' + Math.floor(Math.random() * 10000), email, name: email.split('@')[0] });
  };

  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfdfe] pb-24 md:pb-0">
      <Header />
      
      {showCamera && <CameraCapture onCapture={handleCapture} onClose={() => setShowCamera(false)} />}
      
      {isAnalyzing && currentScanningImage && (
        <AIScanOverlay currentImage={currentScanningImage} />
      )}

      <main className="flex-grow max-w-4xl mx-auto w-full px-5 py-8">
        
        {activeTab === 'home' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Dashboard results={results} />
            <section className="mt-12 mb-8 relative" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-slate-900">Launch Diagnostics</h3>
                <div className="hidden sm:flex items-center space-x-2 text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
                  <span className="text-[10px] font-black uppercase tracking-widest">Drag & Drop Supported</span>
                </div>
              </div>

              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 transition-all duration-300 ${isDragging ? 'scale-[1.02] blur-[1px]' : ''}`}>
                <button onClick={() => setShowCamera(true)} className="flex flex-col items-center p-10 bg-white rounded-[40px] medical-shadow border-2 border-slate-50 hover:border-blue-400 transition-all group active:scale-95">
                  <div className="w-20 h-20 bg-blue-600 text-white rounded-[24px] flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform shadow-2xl shadow-blue-200">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  </div>
                  <span className="font-black text-xs uppercase tracking-[0.2em] text-slate-900">Live Camera</span>
                </button>
                <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center p-10 bg-white rounded-[40px] medical-shadow border-2 border-slate-50 hover:border-teal-400 transition-all group active:scale-95">
                  <div className="w-20 h-20 bg-teal-500 text-white rounded-[24px] flex items-center justify-center mb-6 group-hover:-rotate-6 transition-transform shadow-2xl shadow-teal-200">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                  </div>
                  <span className="font-black text-xs uppercase tracking-[0.2em] text-slate-900">Upload File</span>
                </button>
                <input type="file" accept="image/*" multiple className="hidden" ref={fileInputRef} onChange={(e) => handleFiles(e.target.files)} />
              </div>
            </section>

            <section className="mb-12 space-y-8">
               <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-slate-900">Diagnostic Reports</h3>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{results.length} total</span>
               </div>
                {results.slice(0, 5).map(r => <ResultCard key={r.id} result={r} />)}
               {results.length === 0 && <p className="text-center py-20 text-slate-400 font-bold border-4 border-dashed border-slate-100 rounded-[48px]">Awaiting first biometric capture.</p>}
            </section>
            <Disclaimer />
          </div>
        )}

        {activeTab === 'chat' && <ChatBot />}

        {activeTab === 'patients' && (
          <PatientManagement 
            patients={patients} 
            onAddPatient={(p) => setPatients([...patients, { ...p, id: `FAM-${Math.floor(Math.random()*10000)}`, history: [] } as Patient])}
            onSelectPatient={(p) => setActiveTab('home')}
          />
        )}
        {activeTab === 'accuracy' && <ModelPerformance />}
        {activeTab === 'technical' && <TechnicalDetails />}
        {activeTab === 'atlas' && <MoleAtlas latestResult={results[0] || null} />}
        {activeTab === 'profile' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="bg-white rounded-[32px] medical-shadow p-8 mb-8 border border-slate-50">
                <div className="flex items-center space-x-6 mb-8">
                   <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-teal-400 rounded-3xl flex items-center justify-center text-white text-3xl font-black">{user.name.charAt(0).toUpperCase()}</div>
                   <div>
                      <h4 className="text-2xl font-black capitalize">{user.name}</h4>
                      <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Member ID: #{user.id}</p>
                      <button onClick={() => setUser(null)} className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2">Sign Out</button>
                   </div>
                </div>
             </div>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-2xl border-t border-slate-100 z-[200] h-24 flex items-center px-4 overflow-x-auto scrollbar-hide justify-between space-x-2">
        <button onClick={() => setActiveTab('home')} className={`flex-shrink-0 flex flex-col items-center space-y-1 min-w-[70px] ${activeTab === 'home' ? 'text-blue-600' : 'text-slate-300'}`}>
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg>
          <span className="text-[10px] font-black uppercase tracking-tighter">Home</span>
        </button>
        <button onClick={() => setActiveTab('chat')} className={`flex-shrink-0 flex flex-col items-center space-y-1 min-w-[70px] ${activeTab === 'chat' ? 'text-blue-600' : 'text-slate-300'}`}>
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7z" clipRule="evenodd" /></svg>
          <span className="text-[10px] font-black uppercase tracking-tighter">Assistant</span>
        </button>
        <button onClick={() => setActiveTab('patients')} className={`flex-shrink-0 flex flex-col items-center space-y-1 min-w-[70px] ${activeTab === 'patients' ? 'text-blue-600' : 'text-slate-300'}`}>
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/></svg>
          <span className="text-[10px] font-black uppercase tracking-tighter">Family</span>
        </button>
        <button onClick={() => setActiveTab('accuracy')} className={`flex-shrink-0 flex flex-col items-center space-y-1 min-w-[70px] ${activeTab === 'accuracy' ? 'text-blue-600' : 'text-slate-300'}`}>
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
          <span className="text-[10px] font-black uppercase tracking-tighter">Stats</span>
        </button>
        <button onClick={() => setActiveTab('atlas')} className={`flex-shrink-0 flex flex-col items-center space-y-1 min-w-[70px] ${activeTab === 'atlas' ? 'text-blue-600' : 'text-slate-300'}`}>
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/></svg>
          <span className="text-[10px] font-black uppercase tracking-tighter">Atlas</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
