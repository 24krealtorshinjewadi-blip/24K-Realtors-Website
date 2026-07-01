import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient';
import { Plus, Search, Edit2, Trash2, ShieldCheck, Mail, Phone, Briefcase } from 'lucide-react';

interface Employee {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  designation: string;
  department: string;
  dateOfJoining: string;
  salaryBase: number;
  panNumber?: string;
  aadharNumber?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankIfscCode?: string;
}

export const Employees: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<Employee | null>(null);
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
    role: 'EMPLOYEE',
    designation: '',
    department: '',
    salaryBase: 0,
    panNumber: '',
    aadharNumber: '',
    bankName: '',
    bankAccountNumber: '',
    bankIfscCode: ''
  });

  const { data: employees = [], isLoading } = useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: async () => {
      const response = await apiClient.get('/employees');
      return response.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (newData: typeof formData) => {
      return apiClient.post('/employees', newData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setShowAddModal(false);
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (vars: { id: string; data: Partial<Employee> }) => {
      return apiClient.put(`/employees/${vars.id}`, vars.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setShowEditModal(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiClient.delete(`/employees/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    }
  });

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      fullName: '',
      email: '',
      phone: '',
      role: 'EMPLOYEE',
      designation: '',
      department: '',
      salaryBase: 0,
      panNumber: '',
      aadharNumber: '',
      bankName: '',
      bankAccountNumber: '',
      bankIfscCode: ''
    });
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (showEditModal) {
      updateMutation.mutate({
        id: showEditModal.id,
        data: formData
      });
    }
  };

  const handleOpenEdit = (emp: Employee) => {
    setShowEditModal(emp);
    setFormData({
      username: emp.username,
      password: '',
      fullName: emp.fullName || '',
      email: emp.email || '',
      phone: emp.phone || '',
      role: emp.role,
      designation: emp.designation || '',
      department: emp.department || '',
      salaryBase: emp.salaryBase || 0,
      panNumber: emp.panNumber || '',
      aadharNumber: emp.aadharNumber || '',
      bankName: emp.bankName || '',
      bankAccountNumber: emp.bankAccountNumber || '',
      bankIfscCode: emp.bankIfscCode || ''
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to deactivate this employee?')) {
      deleteMutation.mutate(id);
    }
  };

  const filteredEmployees = employees.filter(emp => 
    emp.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text"
            placeholder="Search employees by name, department..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-[#070f1e] border border-slate-800 focus:border-[#D4AF37] text-slate-100 pl-11 pr-4 py-2.5 rounded-lg text-sm focus:outline-none transition-colors"
          />
        </div>

        <button 
          onClick={() => { resetForm(); setShowAddModal(true); }}
          className="w-full sm:w-auto bg-[#D4AF37] text-slate-950 px-5 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all cursor-pointer"
        >
          <Plus size={16} />
          Add Employee
        </button>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center text-slate-400">Loading employees records...</div>
      ) : filteredEmployees.length === 0 ? (
        <div className="bg-[#070f1e] border border-slate-800 p-12 text-center rounded-xl text-slate-500">
          No employee records loaded.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map(emp => (
            <div key={emp.id} className="bg-[#070f1e] border border-slate-800 hover:border-[#D4AF37]/35 rounded-xl p-6 relative flex flex-col justify-between transition-all">
              <div className="absolute top-6 right-6 flex items-center gap-2">
                <button onClick={() => handleOpenEdit(emp)} className="p-2 text-slate-400 hover:text-[#D4AF37] transition-colors bg-slate-800/40 rounded-lg">
                  <Edit2 size={14} />
                </button>
                <button onClick={() => handleDelete(emp.id)} className="p-2 text-slate-400 hover:text-rose-400 transition-colors bg-slate-800/40 rounded-lg">
                  <Trash2 size={14} />
                </button>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#AA8B24] flex items-center justify-center text-slate-950 font-bold text-lg">
                    {emp.fullName ? emp.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'EM'}
                  </div>
                  <div>
                    <h3 className="font-bold text-white leading-tight">{emp.fullName}</h3>
                    <span className="text-[10px] text-[#D4AF37] font-semibold tracking-wider uppercase">{emp.role}</span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-400 mb-6 border-t border-slate-800/60 pt-4">
                  <div className="flex items-center gap-2">
                    <Briefcase size={14} className="text-slate-500" />
                    <span>{emp.designation || 'No Designation'} — {emp.department || 'No Department'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-slate-500" />
                    <span>{emp.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-slate-500" />
                    <span>{emp.phone || 'No Phone'}</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-800/30 p-2.5 rounded-lg border border-slate-800 mt-4">
                    <span className="text-slate-500">Base Salary</span>
                    <strong className="text-slate-100">₹{emp.salaryBase?.toLocaleString() || '0'}</strong>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#070f1e] border border-[#D4AF37]/30 w-full max-w-2xl rounded-xl p-6 max-h-[90vh] overflow-y-auto relative animate-scale-up">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <ShieldCheck className="text-[#D4AF37]" size={22} />
              <span>{showAddModal ? '⚜️ Register New Employee' : '📝 Edit Employee Details'}</span>
            </h3>

            <form onSubmit={showAddModal ? handleAddSubmit : handleEditSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {showAddModal && (
                  <>
                    <div className="flex flex-col">
                      <label className="text-xs text-slate-400 font-semibold mb-2">Username *</label>
                      <input required type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="bg-[#020617] border border-slate-800 text-slate-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]" />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs text-slate-400 font-semibold mb-2">Initial Password *</label>
                      <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="bg-[#020617] border border-slate-800 text-slate-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]" />
                    </div>
                  </>
                )}
                <div className="flex flex-col">
                  <label className="text-xs text-slate-400 font-semibold mb-2">Full Name *</label>
                  <input required type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="bg-[#020617] border border-slate-800 text-slate-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs text-slate-400 font-semibold mb-2">Email Address *</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="bg-[#020617] border border-slate-800 text-slate-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs text-slate-400 font-semibold mb-2">Phone Number *</label>
                  <input required type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="bg-[#020617] border border-slate-800 text-slate-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs text-slate-400 font-semibold mb-2">System Role</label>
                  <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="bg-[#020617] border border-slate-800 text-slate-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]">
                    <option value="SUPER_ADMIN">Super Admin</option>
                    <option value="ADMIN">Admin</option>
                    <option value="HR">HR</option>
                    <option value="ACCOUNTS">Accounts</option>
                    <option value="SALES_MANAGER">Sales Manager</option>
                    <option value="RELATIONSHIP_MANAGER">Relationship Manager</option>
                    <option value="TELECALLER">Telecaller</option>
                    <option value="MARKETING">Marketing</option>
                    <option value="EMPLOYEE">Employee</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-xs text-slate-400 font-semibold mb-2">Designation *</label>
                  <input required type="text" placeholder="e.g. Associate Partner" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} className="bg-[#020617] border border-slate-800 text-slate-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs text-slate-400 font-semibold mb-2">Department *</label>
                  <input required type="text" placeholder="e.g. Sales Advisory" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="bg-[#020617] border border-slate-800 text-slate-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs text-slate-400 font-semibold mb-2">Base Salary (INR/Month) *</label>
                  <input required type="number" value={formData.salaryBase} onChange={e => setFormData({...formData, salaryBase: Number(e.target.value)})} className="bg-[#020617] border border-slate-800 text-slate-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]" />
                </div>
              </div>

              <div className="border-t border-slate-800/80 pt-4 space-y-4">
                <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wide">Government & Bank Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col">
                    <label className="text-[10px] text-slate-400 font-semibold mb-2">PAN Number</label>
                    <input type="text" value={formData.panNumber} onChange={e => setFormData({...formData, panNumber: e.target.value})} className="bg-[#020617] border border-slate-800 text-slate-100 rounded-lg px-4 py-2 text-xs focus:outline-none" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] text-slate-400 font-semibold mb-2">Aadhar Number</label>
                    <input type="text" value={formData.aadharNumber} onChange={e => setFormData({...formData, aadharNumber: e.target.value})} className="bg-[#020617] border border-slate-800 text-slate-100 rounded-lg px-4 py-2 text-xs focus:outline-none" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] text-slate-400 font-semibold mb-2">Bank Name</label>
                    <input type="text" value={formData.bankName} onChange={e => setFormData({...formData, bankName: e.target.value})} className="bg-[#020617] border border-slate-800 text-slate-100 rounded-lg px-4 py-2 text-xs focus:outline-none" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] text-slate-400 font-semibold mb-2">Account Number</label>
                    <input type="text" value={formData.bankAccountNumber} onChange={e => setFormData({...formData, bankAccountNumber: e.target.value})} className="bg-[#020617] border border-slate-800 text-slate-100 rounded-lg px-4 py-2 text-xs focus:outline-none" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] text-slate-400 font-semibold mb-2">Bank IFSC Code</label>
                    <input type="text" value={formData.bankIfscCode} onChange={e => setFormData({...formData, bankIfscCode: e.target.value})} className="bg-[#020617] border border-slate-800 text-slate-100 rounded-lg px-4 py-2 text-xs focus:outline-none" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => { setShowAddModal(false); setShowEditModal(null); }} className="px-5 py-2 text-sm font-semibold border border-slate-800 rounded-lg hover:bg-slate-800/40 text-slate-300">
                  Cancel
                </button>
                <button type="submit" className="bg-[#D4AF37] text-slate-950 px-6 py-2 rounded-lg text-sm font-bold hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all cursor-pointer">
                  {showAddModal ? 'Save Employee' : 'Update Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
