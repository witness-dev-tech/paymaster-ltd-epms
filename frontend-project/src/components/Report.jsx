import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, CalendarRange, Landmark, Users2, Activity, RefreshCw, FileText, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import api from '../Api/apiAxios';

const Report = () => {
  const [activeTab, setActiveTab] = useState('MONTHLY');
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFallback, setIsFallback] = useState(false);

  const fetchReport = async (interval) => {
    setIsLoading(true);
    setIsFallback(false);
    try {
      // Maps directly to your endpoints: /api/reports/daily, /weekly, /monthly
      const res = await api.get(`/reports/${interval.toLowerCase()}`);
      
      if (res.data && res.data.success) {
        setReportData(res.data.data);
      } else {
        throw new Error("Malformed API response matrix structure.");
      }
    } catch (err) {
      console.error("Backend fetch error:", err);
      setIsFallback(true);
      
      // Fallback data block to keep your UI rendering during disconnected development tests
      setReportData({
        reportType: interval,
        generatedAt: new Date().toISOString(),
        departmentBreakdown: [
          { departmentName: 'Fleet Operations & Logistics', totalNewEmployees: 3, employeeList: 'Jean Ndahimana (Driver), Alphonse Mutabazi (Logistics Lead), Eric Kwizera (Mechanic)' },
          { departmentName: 'Administration & Finance (Rubavu HQ)', totalNewEmployees: 1, employeeList: 'Marie Uwase (Payroll Clerk)' }
        ],
        financialSummary: { 
          totalEmployeesPaid: 24, 
          totalGrossPayout: 14850000, 
          totalDeductionsWithheld: 1950000, 
          totalNetPayout: 12900000 
        }
      });
      toast.error(`Could not connect to database. Displaying local cache for ${interval} overview.`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { 
    fetchReport(activeTab); 
  }, [activeTab]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header View Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-200 pb-5">
        <div className="space-y-1">
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-emerald-600" />
            Payroll Reports & Fleet Analytics
          </h1>
          <p className="text-sm text-zinc-500">Review automated salary distributions and staff placements across PayMaster Ltd branches.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-zinc-100 p-1 rounded-xl border border-zinc-200/60 shadow-inner">
          {['DAILY', 'WEEKLY', 'MONTHLY'].map((tab) => (
            <button
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-150 ${
                activeTab === tab
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Disconnected Indicator Bar */}
      {isFallback && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-center gap-3 text-amber-800 text-xs font-medium shadow-sm">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span><strong>Offline Mode:</strong> Displaying generated sample projections. Verify your backend nodemon server console path parameters match.</span>
        </div>
      )}

      <AnimatePresence mode="wait">
        {reportData && !isLoading && (
          <motion.div
            key={activeTab} 
            initial={{ opacity: 0, y: 12 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -12 }} 
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            {/* Financial Ledger Highlight Indicators */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-zinc-200 p-5 rounded-2xl shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Active Staff Paid</span>
                  <Users2 className="w-4 h-4 text-zinc-400" />
                </div>
                <p className="text-2xl font-black tracking-tight text-zinc-900">
                  {reportData.financialSummary?.totalEmployeesPaid || 0} Personnel
                </p>
              </div>
              
              <div className="bg-white border border-zinc-200 p-5 rounded-2xl shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Gross Payroll Expenses</span>
                  <Landmark className="w-4 h-4 text-emerald-500" />
                </div>
                <p className="text-2xl font-black tracking-tight text-zinc-900">
                  {Number(reportData.financialSummary?.totalGrossPayout || 0).toLocaleString()} RWF
                </p>
              </div>
              
              <div className="bg-white border border-zinc-200 p-5 rounded-2xl shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Statutory Deductions</span>
                  <Activity className="w-4 h-4 text-rose-500" />
                </div>
                <p className="text-2xl font-black tracking-tight text-rose-600">
                  -{Number(reportData.financialSummary?.totalDeductionsWithheld || 0).toLocaleString()} RWF
                </p>
              </div>
              
              <div className="bg-zinc-950 p-5 rounded-2xl shadow-lg space-y-3 text-white border border-zinc-900">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Net Cash Disbursed</span>
                  <CalendarRange className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-2xl font-black tracking-tight text-emerald-400">
                  {Number(reportData.financialSummary?.totalNetPayout || 0).toLocaleString()} RWF
                </p>
              </div>
            </div>

            {/* Department Breakdown Layout */}
            <div className="space-y-4">
              <div className="space-y-0.5">
                <h2 className="text-lg font-extrabold text-zinc-900 flex items-center gap-2">
                  Personnel Deployments & Onboarding Metrics
                </h2>
                <p className="text-xs text-zinc-500">Summary of newly registered transport crew and logistics support assets during this period.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {reportData.departmentBreakdown && reportData.departmentBreakdown.length > 0 ? (
                  reportData.departmentBreakdown.map((dept, i) => (
                    <div key={i} className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm space-y-4 hover:border-zinc-300 transition-colors">
                      <div className="flex justify-between items-start border-b border-zinc-100 pb-3">
                        <h3 className="font-extrabold text-zinc-900 text-base">{dept.departmentName}</h3>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                          +{dept.totalNewEmployees || 0} New Hires
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                          <FileText className="w-3 h-3" /> Registered Manifest Directory
                        </p>
                        <p className="text-sm text-zinc-600 leading-relaxed italic">
                          {dept.employeeList || 'No staff adjustments logged within this reporting window.'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12 text-zinc-400 border border-dashed border-zinc-200 rounded-2xl">
                    No departmental breakdown datasets returned from the query structure.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Framework View */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center p-24 space-y-3 text-zinc-400">
          <RefreshCw className="w-8 h-8 animate-spin text-emerald-600" />
          <p className="text-sm font-semibold text-zinc-600">Calculating gross-to-net parameters and aggregating ledger summaries...</p>
        </div>
      )}
    </div>
  );
};

export default Report;