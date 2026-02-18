
import React, { useState } from 'react';

interface AuthScreenProps {
  onLogin: (email: string) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email || 'user@example.com');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-100 mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">DermAI Pro</h2>
          <p className="text-slate-500 font-medium">Your Personal AI Skin Health Companion</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-slate-100 p-8 rounded-[32px] medical-shadow space-y-5">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium" 
              placeholder="name@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium" 
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all">
            {isLogin ? 'Sign In to Health Dashboard' : 'Create My Account'}
          </button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest"><span className="bg-white px-4 text-slate-300">or continue with</span></div>
          </div>

          <button type="button" className="w-full py-4 bg-white border border-slate-100 text-slate-600 rounded-2xl font-bold text-xs flex items-center justify-center space-x-3 hover:bg-slate-50 transition-all">
            <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            <span>Google Account</span>
          </button>
        </form>

        <p className="text-center text-xs font-bold text-slate-400">
          {isLogin ? "New to DermAI?" : "Already have an account?"}
          <button onClick={() => setIsLogin(!isLogin)} className="ml-2 text-blue-600 uppercase tracking-widest text-[10px]">
            {isLogin ? 'Get Started' : 'Sign In'}
          </button>
        </p>

        <div className="pt-8 flex justify-center items-center space-x-6">
          <div className="flex items-center space-x-2 grayscale opacity-50">
            <div className="w-5 h-5 bg-teal-500 rounded flex items-center justify-center text-white"><span className="text-[8px] font-black">H</span></div>
            <span className="text-[10px] font-black uppercase tracking-tighter">HIPAA Compliant</span>
          </div>
          <div className="flex items-center space-x-2 grayscale opacity-50">
             <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center text-white"><span className="text-[8px] font-black">G</span></div>
            <span className="text-[10px] font-black uppercase tracking-tighter">Secure Data</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
