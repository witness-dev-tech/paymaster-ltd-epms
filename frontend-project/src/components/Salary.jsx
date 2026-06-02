import React, { useState, useEffect } from 'react';
import { Wallet, Receipt, ReceiptText, Loader2, Edit2, Trash2, Search, X } from 'lucide-react';
import { toast } from 'sonner';
import api from '../Api/apiAxios';

const Salary = () => {
  const [form, setForm] = useState({ employeeNumber: '', monthOfPayment: '', grossSalary: '', totalDeduction: '' });
  const [employees, setEmployees] = useState([]);
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null); // Keeps track of records being updated
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);

  // 1. Fetch valid workspace employees automatically on layout mount
  const fetchEmployeesList = async () => {
    setIsLoadingEmployees(true);
    try {
      const res = await api.get('/employees');
      setEmployees(res.data);
    } catch (err) {
      toast.error('Could not load valid workforce employees metadata.');
    } finally {
      setIsLoadingEmployees(false);
    }
  };

  // 2. Retrieve global ledger records across all workforce entries
  const fetchAllSalaries = async () => {
    setIsLoading(true);
    try {
      // Requests base salaries endpoint to pool complete history logs
      const res = await api.get('/salaries');
      setHistory(res.data);
    } catch (err) {
      toast.error('Failed to load payroll ledger statements from target system.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeesList();
    fetchAllSalaries();
  }, []);

  // Handle Form Submission for both Creating and Updating records
  const handleSubmitPayout = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editingId) {
        // Edit Mode Execution Path
        await api.put(`/salaries/${editingId}`, form);
        toast.success('Financial ledger segment statement updated successfully.');
        setEditingId(null);
      } else {
        // Standard Payout Injection Path
        await api.post('/salaries', form);
        toast.success('Financial ledger segment payout transaction recorded.');
      }
      setForm({ employeeNumber: '', monthOfPayment: '', grossSalary: '', totalDeduction: '' });
      fetchAllSalaries(); // Refresh global list records
    } catch (err) {
      toast.error(err.response?.data?.message || 'Transactional conflict encountered during execution.');
    } finally {
      setIsLoading(false);
    }
  };

  // Pre-populate left form panel fields for record updates
  const handleEditClick = (item) => {
    // Uses structural unique index identifier keys (id/salaryId) passed from your backend schema layout
    setEditingId(item.id || item.salaryId || item.employeeNumber);
    setForm({
      employeeNumber: item.employeeNumber,
      monthOfPayment: item.monthOfPayment,
      grossSalary: item.grossSalary,
      totalDeduction: item.totalDeduction
    });
    toast.info('Statement parameters loaded into submission panel.');
  };

  // Execute structural statement row removal from infrastructure database
  const handleDeleteClick = async (id) => {
    if (!window.confirm('Are you completely sure you want to purge this payment ledger allocation string?')) return;
    setIsLoading(true);
    try {
      await api.delete(`/salaries/${id}`);
      toast.success('Ledger transaction successfully deleted from database memory rows.');
      fetchAllSalaries();
    } catch (err) {
      toast.error('Failed to eliminate target ledger metric entry point.');
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEditMode = () => {
    setEditingId(null);
    setForm({ employeeNumber: '', monthOfPayment: '', grossSalary: '', totalDeduction: '' });
  };

  // Filter items in memory via search parameters matches
  const filteredHistory = history.filter((item) => {
    const searchString = `${item.employeeNumber} ${item.monthOfPayment} ${item.grossSalary} ${item.totalDeduction} ${item.netSalary || ''}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="grid lg:grid-cols-3 gap-8 items-start animate-in fade-in duration-300">
      {/* Dynamic Payout Form Processing Module Panel */}
      <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm space-y-6 sticky top-6">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-indigo-600" />
            {editingId ? 'Modify Ledger Entry' : 'Execute Payout Sequence'}
          </h2>
          <p className="text-xs text-zinc-500">
            {editingId ? 'Apply mutations directly to existing database row indexes.' : 'Inject monetary computation strings into unconstrained database rows.'}
          </p>
        </div>

        <form onSubmit={handleSubmitPayout} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">Target Employee Profile</label>
            <select
              required
              value={form.employeeNumber}
              disabled={isLoadingEmployees || !!editingId} // Locked on edit mode to preserve references
              onChange={(e) => setForm({ ...form, employeeNumber: e.target.value })}
              className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
            >
              <option value="" disabled>Select target personnel</option>
              {employees.map((emp) => (
                <option key={emp.employeeNumber} value={emp.employeeNumber}>
                  #{emp.employeeNumber} — {emp.firstName} {emp.lastName}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">Target Payment Loop Month</label>
            <input
              type="month" required value={form.monthOfPayment}
              onChange={(e) => setForm({ ...form, monthOfPayment: e.target.value })}
              className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">Gross Base Remuneration (FRW)</label>
            <input
              type="number" required placeholder="6500" value={form.grossSalary}
              onChange={(e) => setForm({ ...form, grossSalary: e.target.value })}
              className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">Total Cumulative Deductions (FRW)</label>
            <input
              type="number" required placeholder="450" value={form.totalDeduction}
              onChange={(e) => setForm({ ...form, totalDeduction: e.target.value })}
              className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
            />
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              type="submit" disabled={isLoading}
              className={`w-full text-white py-3 px-4 rounded-xl text-sm font-semibold active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm ${
                editingId ? 'bg-amber-600 hover:bg-amber-500' : 'bg-zinc-900 hover:bg-zinc-800'
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : editingId ? (
                'Commit Update Changes'
              ) : (
                'Validate Ledger Transmit'
              )}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={cancelEditMode}
                className="w-full bg-zinc-100 text-zinc-700 py-2 px-4 rounded-xl text-xs font-medium hover:bg-zinc-200 transition-colors flex items-center justify-center gap-1"
              >
                <X className="w-3 h-3" /> Terminate Update Mode
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Workspace Financial Ledger Node - Table With Search View Map */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-zinc-500" />
                Master Payroll Telemetry Index
              </h2>
              <p className="text-xs text-zinc-500">Dynamic system matrix tracking overall payroll computations across standard framework nodes.</p>
            </div>
          </div>

          {/* Search Filtering Element block layout wrapper */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by Employee ID, targets month parameters, or salary amounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 placeholder:text-zinc-400"
            />
          </div>
        </div>

        {/* Dynamic Table Allocation Loop checks */}
        {isLoading && history.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-2xl p-12 flex flex-col items-center justify-center space-y-3 shadow-sm">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            <p className="text-xs font-medium text-zinc-500">Synchronizing system matrix dataset allocations...</p>
          </div>
        ) : filteredHistory.length > 0 ? (
          <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in duration-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-200 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Employee ID</th>
                    <th className="px-6 py-4">Interval Cycle</th>
                    <th className="px-6 py-4">Gross Base (FRW)</th>
                    <th className="px-6 py-4">Deductions (FRW)</th>
                    <th className="px-6 py-4">Net Payout (FRW)</th>
                    <th className="px-6 py-4 text-center">Operation Panel</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-zinc-100">
                  {filteredHistory.map((item, idx) => {
                    const rowId = item.id || item.salaryId || item.employeeNumber;
                    return (
                      <tr key={idx} className="hover:bg-zinc-50/30 transition-colors">
                        <td className="px-6 py-4 font-mono font-semibold text-zinc-700">#{item.employeeNumber}</td>
                        <td className="px-6 py-4 font-semibold text-zinc-900">{item.monthOfPayment}</td>
                        <td className="px-6 py-4 font-medium text-zinc-600">{parseFloat(item.grossSalary).toLocaleString()}FRW</td>
                        <td className="px-6 py-4 font-medium text-rose-600">-{parseFloat(item.totalDeduction).toLocaleString()}FRW</td>
                        <td className="px-6 py-4 font-mono font-bold text-emerald-600">{parseFloat(item.netSalary || (item.grossSalary - item.totalDeduction)).toLocaleString()}FRW</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEditClick(item)}
                              className="p-1.5 hover:bg-zinc-100 text-zinc-600 rounded-lg transition-colors"
                              title="Modify Entry"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(rowId)}
                              className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors"
                              title="Purge Entry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="border border-dashed border-zinc-200 rounded-2xl p-12 text-center text-zinc-400 space-y-2 bg-white">
            <ReceiptText className="w-8 h-8 mx-auto text-zinc-300" />
            <p className="text-sm font-medium">No system records match current query runtime filter terms.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Salary;