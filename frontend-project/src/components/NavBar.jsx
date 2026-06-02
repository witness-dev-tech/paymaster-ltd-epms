import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Building2, Users, CreditCard, BarChart3, LogOut, Menu, X, Truck } from 'lucide-react';
import { toast } from 'sonner';
import api from '../Api/apiAxios';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('isLoggedIn');
      toast.success('Logged out from PayMaster Ltd secure node.');
      navigate('/login');
    } catch (err) {
      toast.error('Logout protocol encountered an operational interruption.');
    }
  };

  const links = [
    { to: '/dashboard', label: 'Operations Hub', icon: LayoutDashboard },
    { to: '/departments', label: 'Logistics Units', icon: Building2 },
    { to: '/employees', label: 'Fleet & Personnel', icon: Users },
    { to: '/salaries', label: 'Automated Payroll', icon: CreditCard },
    { to: '/reports', label: 'Ledger Analytics', icon: BarChart3 },
  ];

  return (
    <nav className="bg-white border-b border-zinc-200 sticky top-0 z-50 backdrop-blur-md bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            {/* PayMaster Ltd Custom Corporate Identity */}
            <span className="text-xl font-extrabold tracking-tight text-zinc-900 flex items-center gap-2.5">
              <div className="h-9 w-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-sm shadow-emerald-600/20">
                <Truck className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-black text-zinc-900 tracking-wide uppercase">PayMaster Ltd</span>
                <span className="text-[10px] text-zinc-400 font-bold tracking-wider uppercase">Rubavu HQ — Western Province</span>
              </div>
              
            </span>
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
                        isActive
                          ? 'bg-zinc-900 text-white shadow-sm'
                          : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* Desktop Sign Out Operation */}
          <div className="hidden md:flex items-center">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 border border-zinc-200 text-sm font-semibold text-zinc-600 rounded-xl hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-all duration-150"
            >
              <LogOut className="w-4 h-4" />
              Disconnect
            </button>
          </div>

          {/* Mobile responsive toggle actions menu */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Context Menu Drawer */}
      {isOpen && (
        <div className="md:hidden border-b border-zinc-200 bg-white px-4 pt-2 pb-4 space-y-1 animate-in fade-in slide-in-from-top-4 duration-200">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </NavLink>
            );
          })}
          <div className="pt-4 border-t border-zinc-100 mt-2">
            <button
              onClick={() => { setIsOpen(false); handleLogout(); }}
              className="flex w-full items-center gap-3 px-4 py-3 text-base font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Disconnect Session
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;