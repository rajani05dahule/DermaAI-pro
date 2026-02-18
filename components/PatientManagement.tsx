
import React, { useState } from 'react';
import { Patient, RiskLevel } from '../types';

interface PatientManagementProps {
  patients: Patient[];
  onAddPatient: (patient: Partial<Patient>) => void;
  onSelectPatient: (patient: Patient) => void;
}

const PatientManagement: React.FC<PatientManagementProps> = ({ patients, onAddPatient, onSelectPatient }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<RiskLevel | 'All'>('All');

  const filtered = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    if (filter === 'All') return matchesSearch;
    return matchesSearch && p.history.some(h => h.riskLevel === filter);
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Health Profiles</h2>
          <p className="text-slate-500 font-medium">Manage records for yourself and your family.</p>
        </div>
        <button 
          onClick={() => onAddPatient({ name: 'New Profile', age: 25, gender: 'Male' })}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center space-x-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
          <span>Add Profile</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <input 
            type="text" 
            placeholder="Search profiles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 medical-shadow font-medium" 
          />
          <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </div>
        <div className="flex items-center space-x-2 bg-white px-4 py-2 border border-slate-100 rounded-2xl medical-shadow">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filter By Risk</span>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value as any)}
            className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none border-none cursor-pointer"
          >
            <option value="All">All Records</option>
            <option value={RiskLevel.HIGH}>High Concern</option>
            <option value={RiskLevel.MEDIUM}>Moderate</option>
            <option value={RiskLevel.LOW}>Stable</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.map(p => (
          <button 
            key={p.id}
            onClick={() => onSelectPatient(p)}
            className="bg-white p-6 rounded-[32px] border border-slate-50 medical-shadow flex flex-col md:flex-row md:items-center justify-between hover:border-blue-200 transition-all group"
          >
            <div className="flex items-center space-x-5">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 text-xl font-black group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                {p.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h4 className="text-lg font-black text-slate-900 mb-1">{p.name}</h4>
                <div className="flex items-center space-x-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">MEMBER ID: {p.id}</span>
                  <div className="w-1 h-1 bg-slate-200 rounded-full" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.age}y • {p.gender}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-8">
               <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Latest Scan</p>
                  <p className="text-sm font-bold text-slate-900">{p.lastScanDate ? p.lastScanDate.toLocaleDateString() : 'No Scans'}</p>
               </div>
               <div className="flex items-center space-x-2">
                 <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                   p.history[0]?.riskLevel === RiskLevel.HIGH ? 'bg-red-50 text-red-600' :
                   p.history[0]?.riskLevel === RiskLevel.MEDIUM ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'
                 }`}>
                   {p.history[0]?.riskLevel || 'Healthy'}
                 </div>
                 <svg className="w-5 h-5 text-slate-200 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
               </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PatientManagement;
