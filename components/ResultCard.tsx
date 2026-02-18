
import React, { useState } from 'react';
import { AnalysisResult, Classification, RiskLevel } from '../types';
import { jsPDF } from 'jspdf';
import { findNearbyClinics } from '../services/geminiService';

interface ResultCardProps {
  result: AnalysisResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isFindingClinics, setIsFindingClinics] = useState(false);
  const [clinicResults, setClinicResults] = useState<{ text: string, places: any[] } | null>(null);

  const isMalignant = result.label === Classification.MALIGNANT || result.label.toLowerCase().includes('malignant') || result.label.toLowerCase().includes('melanoma');
  const isHighRisk = result.riskLevel === RiskLevel.HIGH;

  const getRiskStyles = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.LOW: return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', indicator: 'bg-green-500', color: '#22c55e' };
      case RiskLevel.MEDIUM: return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', indicator: 'bg-orange-500', color: '#f97316' };
      case RiskLevel.HIGH: return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', indicator: 'bg-red-500', color: '#ef4444' };
      default: return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', indicator: 'bg-slate-500', color: '#64748b' };
    }
  };

  const styles = getRiskStyles(result.riskLevel);

  const handleSpeak = () => {
    const text = `Screening result: ${result.label}. Risk level is ${result.riskLevel}. AI is ${result.confidence.toFixed(1)} percent confident.`;
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handleLocateClinics = () => {
    setIsFindingClinics(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const data = await findNearbyClinics(pos.coords.latitude, pos.coords.longitude);
        setClinicResults(data);
      } catch (err) {
        console.error(err);
        alert("Failed to find nearby clinics. Ensure location is enabled.");
      } finally {
        setIsFindingClinics(false);
      }
    }, (error) => {
      setIsFindingClinics(false);
      alert("Location access denied. Please allow location permissions to find clinics.");
    });
  };

  const handleDownloadPDF = async () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, pageWidth, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('DermAI Pro - Clinical Screening Report', 20, 25);
      doc.setFontSize(10);
      doc.text(`Report ID: ${result.id.toUpperCase()} | Generated: ${result.timestamp.toLocaleString()}`, 20, 34);
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(16);
      doc.text('Diagnostic Assessment', 20, 55);
      try { doc.addImage(result.imageUrl, 'JPEG', 20, 65, 60, 60); } catch (e) {}
      doc.setFontSize(12);
      doc.text('Classification:', 90, 75);
      doc.setTextColor(isMalignant ? 220 : 20, isMalignant ? 38 : 184, isMalignant ? 38 : 166);
      doc.text(result.label, 90, 82);
      doc.setTextColor(30, 41, 59);
      doc.text('Risk Level:', 90, 95);
      doc.text(result.riskLevel, 90, 102);
      doc.text('Confidence Score:', 90, 115);
      doc.text(`${result.confidence.toFixed(1)}%`, 90, 122);
      doc.save(`DermAI-Report-${result.id}.pdf`);
    } finally {
      setIsExporting(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('protect')) return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m12.728 12.728L5.636 5.636" /></svg>;
    return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
  };

  return (
    <div className="bg-white rounded-[40px] border-2 border-slate-100 medical-shadow overflow-hidden animate-in fade-in zoom-in-95 duration-700">
      <div className="px-8 py-5 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">AI Clinical Report #{result.id.toUpperCase()}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={handleDownloadPDF} disabled={isExporting} className="p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all active:scale-90 flex items-center space-x-2">
            {isExporting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>}
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Export PDF</span>
          </button>
          <button onClick={handleSpeak} className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 transition-all active:scale-90">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
          </button>
        </div>
      </div>

      <div className="p-10">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <div className="relative w-full lg:w-72 aspect-square rounded-[36px] overflow-hidden border-[8px] border-white medical-shadow flex-shrink-0">
            <img src={result.imageUrl} alt="Lesion" className="w-full h-full object-cover" />
            <div className={`absolute bottom-6 left-6 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest text-white shadow-lg ${styles.indicator}`}>
                {result.riskLevel} Risk
            </div>
          </div>
          <div className="flex-1 space-y-8 w-full">
            <div>
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className={`px-5 py-2 rounded-full border-2 ${styles.border} ${styles.bg}`}><span className={`text-sm font-black uppercase tracking-widest ${styles.text}`}>{result.riskLevel} Hazard</span></div>
                <div className="px-5 py-2 rounded-full bg-blue-600 text-white shadow-xl shadow-blue-100"><span className="text-sm font-black uppercase tracking-widest">Confidence: {result.confidence.toFixed(1)}%</span></div>
              </div>
              <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter leading-tight">Classification:<br/><span className={isMalignant ? 'text-red-600' : 'text-teal-600'}>{result.label}</span></h2>
              <p className="text-slate-500 text-xl font-medium leading-relaxed max-w-2xl">{result.summary}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
               {Object.entries(result.clinicalIndicators).map(([key, val]) => (
                 <div key={key} className="bg-slate-50 p-4 rounded-3xl border border-slate-100 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{key}</p>
                    <div className="flex items-center justify-center space-x-1"><span className="text-xl font-black text-slate-900">{val}</span><span className="text-xs text-slate-300">/ 10</span></div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50/50 p-10 border-t-2 border-slate-100">
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <div className="space-y-6">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] flex items-center space-x-2"><div className="w-1.5 h-6 bg-blue-600 rounded-full" /><span>AI Observations</span></h4>
            <ul className="space-y-4">
              {result.findings.map((f, i) => (
                <li key={i} className="text-lg text-slate-700 flex items-start space-x-4"><div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" /><span className="font-medium">{f}</span></li>
              ))}
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] flex items-center space-x-2"><div className="w-1.5 h-6 bg-teal-500 rounded-full" /><span>Strategy</span></h4>
            <div className="grid gap-6">
              {result.preventionTips.map((item, i) => (
                <div key={i} className="bg-white border-2 border-teal-100 p-6 rounded-[28px] medical-shadow flex items-start space-x-5 group hover:border-teal-400 transition-colors">
                  <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors">{getCategoryIcon(item.category)}</div>
                  <div><p className="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-1">{item.category}</p><p className="text-sm text-slate-700 font-bold leading-relaxed">{item.tip}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className={`p-8 rounded-[36px] flex flex-col sm:flex-row items-center justify-between shadow-2xl border-4 border-white transition-all ${isHighRisk ? 'bg-red-600 text-white animate-pulse' : 'bg-blue-600 text-white'}`}>
            <div className="flex items-center space-x-6 mb-6 sm:mb-0">
                <div className="w-16 h-16 bg-white text-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                </div>
                <div>
                    <h5 className="text-xl font-black uppercase tracking-widest">{isHighRisk ? 'Immediate Action Advised' : 'Nearby Specialists'}</h5>
                    <p className="opacity-90 text-sm font-bold">Find the best care centers based on your location.</p>
                </div>
            </div>
            <button 
              onClick={handleLocateClinics}
              disabled={isFindingClinics}
              className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-100 transition-all active:scale-95 flex items-center space-x-2"
            >
                {isFindingClinics ? <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" /> : <span>Find Clinics</span>}
            </button>
        </div>

        {clinicResults && (
          <div className="mt-8 bg-white border-2 border-slate-100 p-8 rounded-[40px] medical-shadow animate-in slide-in-from-top-4 duration-500">
            <div className="flex items-center justify-between mb-6">
              <h6 className="text-xs font-black text-slate-400 uppercase tracking-widest">Recommended Care Centers</h6>
              <button onClick={() => setClinicResults(null)} className="text-slate-300 hover:text-red-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="prose prose-sm text-slate-700 font-medium leading-relaxed mb-8">
              {clinicResults.text}
            </div>
            <div className="flex flex-wrap gap-3">
              {clinicResults.places.map((place: any, i: number) => (
                <a 
                  key={i} 
                  href={place.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-blue-50 border border-blue-100 text-blue-600 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" /><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" /></svg>
                  <span>View on Maps</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultCard;
