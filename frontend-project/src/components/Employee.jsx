import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Contact, Search, Loader2, Edit2, Trash2, X, MapPin, Phone, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import api from '../Api/apiAxios';

const Employee = () => {
  const [form, setForm] = useState({
    employeeNumber: '', firstName: '', lastName: '', address: '',
    position: '', telephone: '', gender: 'M', hiredDate: '', departmentCode: ''
  });
  
  const [departments, setDepartments] = useState([]); 
  const [employeesList, setEmployeesList] = useState([]); // Master tracking state array
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null); // Active profile pointer flag
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDepts, setIsLoadingDepts] = useState(false);

  // 1. Fetch valid department metadata records on mount
  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoadingDepts(true);
      try {
        const res = await api.get('/departments');
        setDepartments(res.data);
      } catch (err) {
        toast.error('Failed to parse remote structural department matrices.');
        setDepartments([
          { departmentCode: 'ENG', departmentName: 'Software Engineering Matrix' },
          { departmentCode: 'HR', departmentName: 'Human Resource Relations' }
        ]);
      } finally {
        setIsLoadingDepts(false);
      }
    };
    fetchDepartments();
    fetchAllEmployees();
  }, []);

  // 2. Fetch all registered workforce system nodes globally
  const fetchAllEmployees = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/employees');
      setEmployeesList(res.data);
    } catch (err) {
      toast.error('Could not aggregate baseline staff directory from database schema.');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Centralized Form Handler for Registration (POST) or Updates (PUT)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editingId) {
        // Edit Mode route matching /api/employees/:empNum
        await api.put(`/employees/${editingId}`, form);
        toast.success('Employee structural database node updated successfully!');
        setEditingId(null);
      } else {
        // Default onboarding registration track
        await api.post('/employees', form);
        toast.success('Employee node profile instantiated successfully!');
      }
      
      // Clear values and refresh live lists
      setForm({
        employeeNumber: '', firstName: '', lastName: '', address: '',
        position: '', telephone: '', gender: 'M', hiredDate: '', departmentCode: ''
      });
      fetchAllEmployees();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to complete data transaction schema loop.');
    } finally {
      setIsLoading(false);
    }
  };

  // Pre-load data variables into form layout fields for modifications
  const startEditMode = (emp) => {
    setEditingId(emp.employeeNumber);
    
    // Safely parse date back to input-friendly string format (YYYY-MM-DD)
    const formattedDate = emp.hiredDate ? new Date(emp.hiredDate).toISOString().split('T')[0] : '';
    
    setForm({
      employeeNumber: emp.employeeNumber,
      firstName: emp.firstName,
      lastName: emp.lastName,
      address: emp.address,
      position: emp.position,
      telephone: emp.telephone,
      gender: emp.gender || 'M',
      hiredDate: formattedDate,
      departmentCode: emp.departmentCode || ''
    });
    toast.info(`Profile records for ID #${emp.employeeNumber} loaded into workspace.`);
  };

  // Trigger elimination segment string directly to router endpoint
  const handleDeleteProfile = async (empNum) => {
    if (!window.confirm(`Are you completely sure you want to purge profile node ID #${empNum} from storage?`)) return;
    setIsLoading(true);
    try {
      await api.delete(`/employees/${empNum}`);
      toast.success('Employee entity profile severed completely from storage indices.');
      
      if (editingId === empNum) terminateEditMode();
      fetchAllEmployees();
    } catch (err) {
      toast.error('Failed to eliminate target worker reference code.');
    } finally {
      setIsLoading(false);
    }
  };

  const terminateEditMode = () => {
    setEditingId(null);
    setForm({
      employeeNumber: '', firstName: '', lastName: '', address: '',
      position: '', telephone: '', gender: 'M', hiredDate: '', departmentCode: ''
    });
  };

  // Comprehensive runtime query filtering match algorithm
  const filteredEmployees = employeesList.filter((emp) => {
    const rawSearchText = `${emp.employeeNumber} ${emp.firstName} ${emp.lastName} ${emp.position} ${emp.departmentCode} ${emp.telephone}`.toLowerCase();
    return rawSearchText.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="grid lg:grid-cols-3 gap-8 items-start animate-in fade-in duration-300">
      {/* Configuration Form Module Panel */}
      <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm space-y-6 sticky top-6">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
            <UserPlus className={`w-5 h-5 ${editingId ? 'text-amber-600' : 'text-indigo-600'}`} />
            {editingId ? 'Modify Onboard Data' : 'Onboard Profile Block'}
          </h2>
          <p className="text-xs text-zinc-500">
            {editingId ? 'Apply state modifications directly onto targeted primary dataset fields.' : 'Inject structured personnel tracking entries directly inside the context pool layer.'}
          </p>
        </div>

        <form onSubmit={handleFormSubmit} className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">Unique Employee Code (Primary Key)</label>
            <input
              type="number" required placeholder="e.g. 1005" value={form.employeeNumber}
              disabled={!!editingId} // Prevent tampering with unique references on updates
              onChange={(e) => setForm({ ...form, employeeNumber: e.target.value })}
              className="w-full px-4 py-2 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">Given First Name</label>
            <input
              type="text" required placeholder="John" value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="w-full px-4 py-2 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">Family Surname</label>
            <input
              type="text" required placeholder="Doe" value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="w-full px-4 py-2 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">Target Role Designation</label>
            <input
              type="text" required placeholder="Lead Architect" value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
              className="w-full px-4 py-2 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">Associated Dept. Code</label>
            <select
              required value={form.departmentCode}
              onChange={(e) => setForm({ ...form, departmentCode: e.target.value })}
              disabled={isLoadingDepts}
              className="w-full px-4 py-2 border border-zinc-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 disabled:opacity-50 cursor-pointer"
            >
              <option value="" disabled>Select Department</option>
              {departments.map((dept) => (
                <option key={dept.departmentCode} value={dept.departmentCode}>
                  {dept.departmentCode} — {dept.departmentName}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">Telephone Terminal Line</label>
            <input
              type="text" required placeholder="+250..." value={form.telephone}
              onChange={(e) => setForm({ ...form, telephone: e.target.value })}
              className="w-full px-4 py-2 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">Hired Calendar Date</label>
            <input
              type="date" required value={form.hiredDate}
              onChange={(e) => setForm({ ...form, hiredDate: e.target.value })}
              className="w-full px-4 py-2 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">Physical Address Parameter</label>
            <input
              type="text" required placeholder="Kigali, Rwanda Area Node" value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-4 py-2 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
            />
          </div>

          <div className="sm:col-span-2 flex flex-col gap-2 pt-2">
            <button
              type="submit" disabled={isLoading}
              className={`w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-md text-white active:scale-[0.99] ${
                editingId ? 'bg-amber-600 hover:bg-amber-500' : 'bg-indigo-600 hover:bg-indigo-500'
              }`}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : editingId ? 'Commit Update Changes' : 'Provision Profile Entry'}
            </button>
            
            {editingId && (
              <button
                type="button" onClick={terminateEditMode}
                className="w-full bg-zinc-100 text-zinc-700 py-2 px-4 rounded-xl text-xs font-medium hover:bg-zinc-200 transition-colors flex items-center justify-center gap-1"
              >
                <X className="w-3 h-3" /> Abort Structural Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Database Master Registry Dashboard List Block Area */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <Search className="w-5 h-5 text-zinc-500" />
              Dynamic Directory Query
            </h2>
            <p className="text-xs text-zinc-500">Query and update micro workforce references across real-time storage indexes.</p>
          </div>

          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Filter instantly by name, worker code, telephone lines or positions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 placeholder:text-zinc-400"
            />
          </div>
        </div>

        {/* Master Render Framework Row loop handler */}
        {isLoading && employeesList.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-2xl p-12 flex flex-col items-center justify-center space-y-3 shadow-sm">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            <p className="text-xs font-medium text-zinc-500">Aggregating workforce schema definitions...</p>
          </div>
        ) : filteredEmployees.length > 0 ? (
          <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-200 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    <th className="px-6 py-4">ID Code</th>
                    <th className="px-6 py-4">Personnel Identity</th>
                    <th className="px-6 py-4">Structure Position</th>
                    <th className="px-6 py-4">Contact Vectors</th>
                    <th className="px-6 py-4 text-center">Operation Panel</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-zinc-100">
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.employeeNumber} className="hover:bg-zinc-50/30 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-zinc-500">#{emp.employeeNumber}</td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-zinc-900">{emp.firstName} {emp.lastName}</div>
                        <div className="text-[11px] inline-flex items-center text-indigo-600 bg-indigo-50 font-medium px-1.5 py-0.5 rounded mt-0.5 border border-indigo-100/30">
                          {emp.departmentName || emp.departmentCode || 'No Department'}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-zinc-600">{emp.position}</td>
                      <td className="px-6 py-4 space-y-1 text-xs text-zinc-500">
                        <div className="flex items-center gap-1.5 text-zinc-600">
                          <Phone className="w-3 h-3 text-zinc-400" /> {emp.telephone}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-zinc-400" /> {emp.address}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => startEditMode(emp)}
                            className="p-1.5 hover:bg-zinc-100 text-zinc-600 rounded-lg transition-colors"
                            title="Modify Profile"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProfile(emp.employeeNumber)}
                            className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors"
                            title="Purge Profile"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="border border-dashed border-zinc-200 rounded-2xl p-12 text-center text-zinc-400 space-y-2 bg-white">
            <Users className="w-8 h-8 mx-auto text-zinc-300" />
            <p className="text-sm font-medium">No system registry entities match query keywords.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Employee;