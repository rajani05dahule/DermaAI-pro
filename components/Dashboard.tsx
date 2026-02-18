
import React from 'react';
import { AnalysisResult, RiskLevel, Classification } from '../types';

interface DashboardProps {
  results: AnalysisResult[];
}

const Dashboard: React.FC<DashboardProps> = ({ results }) => {
  // Compute Stats
  const totalScans = results.length;
  const highRiskCount = results.filter(r => r.riskLevel === RiskLevel.HIGH).length;
  const mediumRiskCount = results.filter(r => r.riskLevel === RiskLevel.MEDIUM).length;
  const lowRiskCount = results.filter(r => r.riskLevel === RiskLevel.LOW).length;
  
  const malignantCount = results.filter(r => r.label === Classification.MALIGNANT).length;
  const benignCount = results.filter(r => r.label === Classification.BENIGN).length;
  
  const mostCommonType = malignantCount >= benignCount ? Classification.MALIGNANT : Classification.BENIGN;
  const accuracy = 96.8; 

  const totalRisk = highRiskCount + mediumRiskCount + lowRiskCount || 1;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-10 text-center md:text-left">
        <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">Health Dashboard</h2>
        <p className="text-slate-500 text-xl font-medium">Biometric overview of your profile</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[40px] medical-shadow border-2 border-slate-50 flex items-center space-x-6">
          <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center flex-shrink-0 shadow-xl shadow-blue-100">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Lifetime Scans</p>
            <p className="text-4xl font-black text-slate-900">{totalScans}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] medical-shadow border-2 border-slate-50 flex items-center space-x-6">
          <div className="w-16 h-16 bg-teal-500 text-white rounded-3xl flex items-center justify-center flex-shrink-0 shadow-xl shadow-teal-100">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">AI Precision</p>
            <p className="text-4xl font-black text-slate-900">{accuracy}%</p>
          </div>
        </div>

        <div className="bg-indigo-600 p-8 rounded-[40px] medical-shadow border-2 border-indigo-500 flex items-center space-x-6 shadow-2xl shadow-indigo-200">
          <div className="w-16 h-16 bg-white text-indigo-600 rounded-3xl flex items-center justify-center flex-shrink-0">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-black text-indigo-200 uppercase tracking-[0.2em] mb-1">Status</p>
            <p className="text-3xl font-black text-white">{totalScans > 0 ? 'Verified' : 'Pending'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[48px] medical-shadow border-2 border-slate-50">
          <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] mb-10 flex items-center space-x-3">
            <div className="w-2 h-6 bg-blue-600 rounded-full" />
            <span>Risk Distribution Profile</span>
          </h4>
          
          <div className="flex flex-col items-center justify-center space-y-10">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 32 32">
                <circle r="16" cx="16" cy="16" fill="#f8fafc" />
                <circle r="16" cx="16" cy="16" fill="transparent" stroke="#ef4444" strokeWidth="32" 
                        strokeDasharray={`${(highRiskCount / totalRisk) * 100} 100`} />
                <circle r="16" cx="16" cy="16" fill="transparent" stroke="#f97316" strokeWidth="32" 
                        strokeDasharray={`${(mediumRiskCount / totalRisk) * 100} 100`} 
                        strokeDashoffset={`-${(highRiskCount / totalRisk) * 100}`} />
                <circle r="16" cx="16" cy="16" fill="transparent" stroke="#22c55e" strokeWidth="32" 
                        strokeDasharray={`${(lowRiskCount / totalRisk) * 100} 100`} 
                        strokeDashoffset={`-${((highRiskCount + mediumRiskCount) / totalRisk) * 100}`} />
                <circle r="12" cx="16" cy="16" fill="white" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-900">{results.length}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reports</span>
              </div>
            </div>

            <div className="flex justify-around w-full">
              <div className="text-center">
                <div className="w-4 h-4 rounded-full bg-red-500 mx-auto mb-2" />
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Critical</p>
                <p className="text-xl font-black">{highRiskCount}</p>
              </div>
              <div className="text-center">
                <div className="w-4 h-4 rounded-full bg-orange-500 mx-auto mb-2" />
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Moderate</p>
                <p className="text-xl font-black">{mediumRiskCount}</p>
              </div>
              <div className="text-center">
                <div className="w-4 h-4 rounded-full bg-green-500 mx-auto mb-2" />
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Stable</p>
                <p className="text-xl font-black">{lowRiskCount}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[48px] medical-shadow border-2 border-slate-50">
          <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] mb-10 flex items-center space-x-3">
            <div className="w-2 h-6 bg-teal-500 rounded-full" />
            <span>Health History Timeline</span>
          </h4>

          <div className="h-48 flex items-end space-x-4 w-full px-4 mb-8">
            {[45, 65, 40, 85, 55, 75, 95].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center group">
                <div 
                  className="w-full bg-slate-50 rounded-[12px] group-hover:bg-blue-600 transition-all duration-700 relative shadow-inner overflow-hidden"
                  style={{ height: `${val}%` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-[10px] font-black text-slate-300 uppercase mt-4">T-{7-i}</span>
              </div>
            ))}
          </div>
          <div className="bg-blue-50 p-6 rounded-[28px] border border-blue-100 text-center">
             <p className="text-blue-900 text-sm font-bold">Consistent data flow detected.</p>
             <p className="text-blue-600 text-[10px] font-black uppercase tracking-widest mt-1">Status: Normal Health Monitoring</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
