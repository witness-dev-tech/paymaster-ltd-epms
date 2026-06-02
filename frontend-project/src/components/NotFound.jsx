import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="h-16 w-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 mx-auto border border-rose-100 shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-zinc-900 tracking-tight">404 Node Undefined</h1>
          <p className="text-sm text-zinc-500 leading-relaxed">The target context route configuration descriptor block maps to a missing or non-instantiated coordinate structure pointer index inside the layout viewport canvas tree.</p>
        </div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 bg-zinc-900 text-white font-semibold text-sm px-5 py-3 rounded-xl hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-950/5 active:scale-98"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Secure Workspace Terminal
        </Link>
      </div>
    </div>
  );
};

export default NotFound;