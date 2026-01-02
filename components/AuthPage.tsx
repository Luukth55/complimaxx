
import React, { useState } from 'react';
import { Mail, Lock, Loader2, Eye, EyeOff, ShieldCheck, User, ArrowLeft } from 'lucide-react';
import { AppRoute } from '../types';

interface AuthPageProps {
  onLogin: (email: string, pass: string, isSignup: boolean, extra?: { firstName: string, lastName: string }) => Promise<any>;
  navigate: (route: AppRoute) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, navigate }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onLogin(email, password, isSignup, { firstName, lastName });
    } catch (err: any) {
      setError(err.message || "Authenticatie mislukt. Controleer uw gegevens.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-techBlack text-white flex overflow-hidden font-sans">
      <div className="hidden lg:flex w-[50%] relative flex-col justify-center items-center p-20 overflow-hidden bg-obsidianNavy border-r border-white/5">
        <div className="absolute inset-0 bg-tech-grid opacity-20"></div>
        <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brightBlue to-blue-600 flex items-center justify-center text-white font-black text-3xl mb-12 shadow-lg">C</div>
          <h1 className="text-5xl font-black text-white leading-tight mb-8 tracking-tighter">
            Audit Readiness <br /> <span className="text-brightBlue">Standardized.</span>
          </h1>
          <p className="text-steelGrey text-lg font-medium leading-relaxed mb-12">Beheer uw 96+ frameworks veilig in de cloud.</p>
        </div>
      </div>

      <div className="w-full lg:w-[50%] flex flex-col justify-center px-8 md:px-20 py-12 relative bg-techBlack">
        <button onClick={() => navigate(AppRoute.LANDING)} className="absolute top-10 left-10 flex items-center space-x-2 text-steelGrey hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest">
          <ArrowLeft size={16} className="mr-2" /> Terug naar Home
        </button>

        <div className="max-w-md w-full mx-auto">
          <div className="mb-12">
            <h2 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase">
              {isSignup ? "Account Aanmaken" : "Inloggen"}
            </h2>
            <p className="text-steelGrey font-medium">Toegang tot uw Complimaxx workspace.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-steelGrey uppercase tracking-[0.4em] ml-1">Voornaam</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-steelGrey group-focus-within:text-brightBlue transition-colors" size={16} />
                    <input required type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full bg-obsidianNavy border border-white/5 rounded-xl pl-12 pr-4 py-4 text-white focus:border-brightBlue transition-all outline-none text-sm" placeholder="Jan" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-steelGrey uppercase tracking-[0.4em] ml-1">Achternaam</label>
                  <div className="relative group">
                    <input required type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full bg-obsidianNavy border border-white/5 rounded-xl px-4 py-4 text-white focus:border-brightBlue transition-all outline-none text-sm" placeholder="Bakker" />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-steelGrey uppercase tracking-[0.4em] ml-1">E-mailadres</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-steelGrey group-focus-within:text-brightBlue transition-colors" size={16} />
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-obsidianNavy border border-white/5 rounded-xl pl-12 pr-4 py-4 text-white focus:border-brightBlue transition-all outline-none text-sm" placeholder="naam@bedrijf.nl" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-steelGrey uppercase tracking-[0.4em] ml-1">Wachtwoord</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-steelGrey group-focus-within:text-brightBlue transition-colors" size={16} />
                <input required type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-obsidianNavy border border-white/5 rounded-xl pl-12 pr-12 py-4 text-white focus:border-brightBlue transition-all outline-none text-sm" placeholder="********" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-steelGrey hover:text-white">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <div className="p-4 rounded-xl bg-riskHigh/10 border border-riskHigh/20 text-riskHigh text-xs font-bold">{error}</div>}

            <button type="submit" disabled={loading} className="w-full bg-brightBlue hover:bg-blue-600 text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.4em] shadow-lg transition-all flex items-center justify-center active:scale-95 disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin" size={20} /> : (isSignup ? "Nu Registreren" : "Inloggen")}
            </button>
          </form>

          <div className="mt-8 text-center pt-8 border-t border-white/5">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-steelGrey">
              {isSignup ? "Heeft u al een account? " : "Nieuw bij Complimaxx? "}
              <button onClick={() => setIsSignup(!isSignup)} className="text-brightBlue hover:underline ml-2">{isSignup ? "Inloggen" : "Aanmelden"}</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
