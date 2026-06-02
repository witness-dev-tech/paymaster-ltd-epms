import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NavLink, Link as RouterLink } from 'react-router-dom';
import { Lock, User, ArrowRight, Loader2, Truck } from 'lucide-react';
import { toast } from 'sonner';
import api from '../Api/apiAxios';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/auth/login', formData);
      localStorage.setItem('isLoggedIn', 'true');
      toast.success('Authentication confirmed. Welcome to PayMaster Ltd dashboard!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Access Denied. Check your administrative credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left visual side panel — Corporate Branding Track */}
      <div className="hidden lg:flex flex-col justify-between bg-zinc-900 p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_50%)]" />
        
        <div className="flex items-center gap-2.5 text-xl font-black tracking-tight relative z-10">
          <div className="h-9 w-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
            <Truck className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-black text-white tracking-wide uppercase">PayMaster Ltd</span>
            <span className="text-[10px] text-zinc-400 font-bold tracking-wider uppercase">Rubavu Operations Portal</span>
          </div>
        </div>

        <div className="space-y-4 relative z-10">
          <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase bg-emerald-950/50 border border-emerald-800/30 px-3 py-1 rounded-full">
            Western Province Hub
          </span>
          <h1 className="text-4xl font-black tracking-tight leading-tight pt-2">
            Automated Fleet Payroll & Personnel Management.
          </h1>
          <p className="text-zinc-400 max-w-md text-sm leading-relaxed">
            Eliminating inefficiencies across manual record structures. Seamlessly manage driver profiles, update operational units, and compute statutory deductions error-free.
          </p>
        </div>
        
        <p className="text-xs text-zinc-500 relative z-10">© 2026 PayMaster Ltd. Rubavu District, Rwanda. All rights reserved.</p>
      </div>

      {/* Right control form module panel */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-2">
            <h2 className="text-3xl font-black tracking-tight text-zinc-900">Sign In</h2>
            <p className="text-sm text-zinc-500">Human Resources Secure Gateway. Input terminal credentials to manage assets.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">HR Account Username</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. rubavu_admin"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-zinc-200 rounded-xl text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 placeholder:text-zinc-400"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Secure Access Token</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-zinc-200 rounded-xl text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 placeholder:text-zinc-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-zinc-900 text-white py-3.5 px-4 rounded-xl text-sm font-semibold hover:bg-zinc-800 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-2 group shadow-lg shadow-zinc-950/10"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
              ) : (
                <>
                  Initialize HR Terminal
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform text-emerald-400" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-zinc-600">
            Authorized staff registration request?{' '}
            <RouterLink to="/register" className="font-bold text-emerald-600 hover:text-emerald-500 underline underline-offset-4">
              Provision account
            </RouterLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;