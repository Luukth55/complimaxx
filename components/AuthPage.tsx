
import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Loader2, CheckCircle, Github, Globe, Eye, EyeOff, ShieldCheck, Users } from 'lucide-react';
import { AppRoute } from '../types';

interface AuthPageProps {
  onLogin: (email: string, pass: string, isSignup: boolean) => Promise<any>;
  navigate: (route: AppRoute) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, navigate }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onLogin(email, password, isSignup);
    } catch (err: any) {
      setError(err.message || "Authenticatie mislukt. Controleer uw gegevens.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-techBlack flex overflow-hidden">
      
      {/* LEFT SIDE: VISUAL MAGIC (Visible on large screens) */}
      <div className="hidden lg:flex w-[55%] bg-brightBlue relative flex-col justify-center items-center p-20 overflow-hidden">
        {/* Abstract Background Decor */}
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-brightBlue via-blue-600 to-indigo-900"></div>
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-black/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
          <h1 className="text-5xl font-black text-white leading-tight mb-8 tracking-tighter">
            Your Audit & Compliance <br /> Magic
          </h1>
          
          <div className="flex items-center space-x-4 mb-16">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-brightBlue bg-white/20 backdrop-blur-md overflow-hidden flex items-center justify-center text-[10px] font-bold text-white">
                  U{i}
                </div>
              ))}
            </div>
            <p className="text-white/80 text-sm font-medium">Trusted by 500+ security teams!</p>
          </div>

          {/* Product Preview Mockup */}
          <div className="w-full bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 shadow-2xl animate-float relative">
             <div className="h-6 border-b border-white/10 flex items-center space-x-1.5 mb-4">
                <div className="w-2 h-2 rounded-full bg-red-400"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
             </div>
             <div className="space-y-4">
                <div className="h-4 w-3/4 bg-white/20 rounded"></div>
                <div className="h-4 w-1/2 bg-white/10 rounded"></div>
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="h-24 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center">
                    <ShieldCheck size={32} className="text-white/40" />
                  </div>
                  <div className="h-24 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center">
                    <Users size={32} className="text-white/40" />
                  </div>
                </div>
             </div>
             
             {/* Floating Avatars / Cursors like in the photo */}
             <div className="absolute -bottom-4 -left-6 bg-white p-2 rounded-xl shadow-lg flex items-center space-x-2 animate-bounce-slow">
                <div className="w-6 h-6 rounded-full bg-brightBlue flex items-center justify-center text-[8px] font-bold text-white">M</div>
                <span className="text-[10px] font-bold text-slate-700">Audit Package Generated</span>
             </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: AUTH FORM */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 md:px-20 py-12 relative">
        
        {/* Mobile Logo Only */}
        <div className="lg:hidden absolute top-8 left-8 flex items-center space-x-2 text-brightBlue" onClick={() => navigate(AppRoute.LANDING)}>
          <div className="w-8 h-8 rounded-lg bg-brightBlue flex items-center justify-center text-white font-bold">C</div>
          <span className="text-xl font-black tracking-tighter text-techBlack">Complimaxx</span>
        </div>

        <div className="max-w-md w-full mx-auto">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black text-techBlack mb-2">
              {isSignup ? "Create Account" : "Welcome Back!"}
            </h2>
            <p className="text-slate-500 font-medium">
              {isSignup ? "Join the future of compliance" : "Login your account to access"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Email address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brightBlue transition-colors" size={18} />
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-techBlack focus:border-brightBlue focus:ring-4 focus:ring-brightBlue/5 transition-all outline-none"
                  placeholder="example@gmail.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
                {!isSignup && <button type="button" className="text-xs font-bold text-brightBlue hover:underline">Forgot password?</button>}
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brightBlue transition-colors" size={18} />
                <input 
                  required
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-12 py-4 text-techBlack focus:border-brightBlue focus:ring-4 focus:ring-brightBlue/5 transition-all outline-none"
                  placeholder="Enter your password"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-riskHigh text-xs font-bold animate-fadeIn">{error}</p>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-brightBlue hover:bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-brightBlue/20 transition-all flex items-center justify-center active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : (
                <>{isSignup ? "Sign Up Now" : "Login Now"}</>
              )}
            </button>
          </form>

          <div className="mt-10">
            <div className="relative flex items-center justify-center mb-8">
               <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
               <span className="relative bg-white px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Or</span>
            </div>

            <button className="w-full border border-slate-200 bg-white hover:bg-slate-50 text-techBlack py-4 rounded-2xl font-bold transition-all flex items-center justify-center mb-8 active:scale-95">
               <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 mr-3" />
               Continue with Google
            </button>
            
            <p className="text-center text-sm font-medium text-slate-500">
              {isSignup ? "Already have an account? " : "Don't have account? "}
              <button 
                onClick={() => setIsSignup(!isSignup)}
                className="text-brightBlue font-bold hover:underline"
              >
                {isSignup ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
