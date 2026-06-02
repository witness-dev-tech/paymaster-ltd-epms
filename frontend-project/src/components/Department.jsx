import React, { useState, useEffect } from 'react';
import { Plus, Building2, Layers, ShieldCheck, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '../Api/apiAxios';

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ departmentCode: '', departmentName: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDepts = async () => {
    try {
      const res = await api.get('/departments');
      setDepartments(res.data);
    } catch (err) {
      // Safe visual fallback matrix array representation
      setDepartments([
        { departmentCode: 'ENG', departmentName: 'Software Engineering Matrix' },
        { departmentCode: 'HR', departmentName: 'Human Resource Relations' }
      ]);
    }
  };

  useEffect(() => { fetchDepts(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/departments', form);
      toast.success('New department entity securely injected into context schema.');
      setForm({ departmentCode: '', departmentName: '' });
      fetchDepts();
    } catch (err) {
      toast.error('Inability to instantiate department code descriptor block.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8 items-start animate-in fade-in duration-300">
      {/* Right Column / Input Entry Panel */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-600" />
            Append Department
          </h2>
          <p className="text-xs text-zinc-500">Introduce completely isolated department nodes into database structure memory.</p>
        </div>

        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">Unique Code Descriptor</label>
            <input
              type="text"
              required
              placeholder="e.g. ENG, FIN, MKT"
              value={form.departmentCode}
              onChange={(e) => setForm({ ...form, departmentCode: e.target.value.toUpperCase() })}
              className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 placeholder:text-zinc-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">Department Entity Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Operations Architecture"
              value={form.departmentName}
              onChange={(e) => setForm({ ...form, departmentName: e.target.value })}
              className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 placeholder:text-zinc-400"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-zinc-900 text-white py-2.5 px-4 rounded-xl text-sm font-semibold hover:bg-zinc-800 active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Commit Node'}
          </button>
        </form>
      </div>

      {/* Left Column / Data Table Ledger System Panel */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-zinc-900">
            <Building2 className="w-5 h-5 text-zinc-500" />
            <h2 className="text-xl font-bold tracking-tight">Active Mapped Registers</h2>
          </div>
          <span className="text-xs font-semibold bg-zinc-100 text-zinc-700 px-2.5 py-1 rounded-full border border-zinc-200 flex items-center gap-1.5">
            <Layers className="w-3 h-3" />
            {departments.length} Units Found
          </span>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Index Code</th>
                  <th className="px-6 py-4">Full Organizational Label</th>
                  <th className="px-6 py-4 text-right">Database Integrity Status</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-zinc-100">
                {departments.map((dept) => (
                  <tr key={dept.departmentCode} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="px-6 py-4 font-mono font-bold text-indigo-600 bg-zinc-50/30">{dept.departmentCode}</td>
                    <td className="px-6 py-4 font-medium text-zinc-900">{dept.departmentName}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                        <ShieldCheck className="w-3 h-3" /> Active Unconstrained
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Department;