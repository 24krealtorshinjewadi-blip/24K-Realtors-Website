import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient';
import { useAuthStore } from '../store/authStore';
import { 
  CreditCard, Plus, CheckCircle, XCircle, 
  ArrowDownToLine, Receipt
} from 'lucide-react';

interface Payslip {
  id: string;
  payPeriod: string;
  baseSalary: number;
  allowances: number;
  commissions: number;
  pfDeduction: number;
  ptDeduction: number;
  netSalary: number;
  status: string;
  pdfUrl?: string;
  user?: { fullName: string; designation: string };
}

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  status: string;
  receiptUrl?: string;
  user?: { fullName: string; designation: string };
}

interface Employee {
  id: string;
  fullName: string;
  designation: string;
}

export const Payroll: React.FC = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [activeSubTab, setActiveSubTab] = useState<'payslips' | 'expenses'>('payslips');
  const [showApplyExpense, setShowApplyExpense] = useState(false);
  const [showGeneratePayslip, setShowGeneratePayslip] = useState(false);
  const [expenseForm, setExpenseForm] = useState({ amount: 0, category: 'TRAVEL', description: '', receiptUrl: '' });
  const [payslipForm, setPayslipForm] = useState({ userId: '', payPeriod: '2026-07' });

  const isFinancialAdmin = user && ['SUPER_ADMIN', 'ADMIN', 'HR', 'ACCOUNTS'].includes(user.role);

  // Queries
  const { data: myPayslips = [] } = useQuery<Payslip[]>({
    queryKey: ['myPayslips'],
    queryFn: async () => {
      const response = await apiClient.get('/payroll/payslips/my-payslips');
      return response.data;
    }
  });

  const { data: allPayslips = [] } = useQuery<Payslip[]>({
    queryKey: ['allPayslips'],
    queryFn: async () => {
      const response = await apiClient.get('/payroll/payslips/all');
      return response.data;
    },
    enabled: !!isFinancialAdmin
  });

  const { data: myExpenses = [] } = useQuery<Expense[]>({
    queryKey: ['myExpenses'],
    queryFn: async () => {
      const response = await apiClient.get('/payroll/expenses/my-expenses');
      return response.data;
    }
  });

  const { data: pendingExpenses = [] } = useQuery<Expense[]>({
    queryKey: ['pendingExpenses'],
    queryFn: async () => {
      const response = await apiClient.get('/payroll/expenses/pending');
      return response.data;
    },
    enabled: !!isFinancialAdmin
  });

  const { data: employees = [] } = useQuery<Employee[]>({
    queryKey: ['employeesListForPayslip'],
    queryFn: async () => {
      const response = await apiClient.get('/employees');
      return response.data;
    },
    enabled: !!isFinancialAdmin
  });

  // Mutations
  const generatePayslipMutation = useMutation({
    mutationFn: async (data: typeof payslipForm) => {
      return apiClient.post('/payroll/payslips/generate', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allPayslips'] });
      setShowGeneratePayslip(false);
    }
  });

  const payPayslipMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiClient.patch(`/payroll/payslips/${id}/pay`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allPayslips'] });
      queryClient.invalidateQueries({ queryKey: ['myPayslips'] });
    }
  });

  const submitExpenseMutation = useMutation({
    mutationFn: async (data: typeof expenseForm) => {
      return apiClient.post('/payroll/expenses/submit', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myExpenses'] });
      setShowApplyExpense(false);
      setExpenseForm({ amount: 0, category: 'TRAVEL', description: '', receiptUrl: '' });
    }
  });

  const processExpenseMutation = useMutation({
    mutationFn: async (vars: { id: string; status: string }) => {
      return apiClient.patch(`/payroll/expenses/${vars.id}/process`, { status: vars.status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingExpenses'] });
      queryClient.invalidateQueries({ queryKey: ['myExpenses'] });
    }
  });

  const getStatusStyle = (status: string) => {
    return status === 'PAID' || status === 'APPROVED' 
      ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20' 
      : status === 'REJECTED' 
      ? 'bg-rose-950/40 text-rose-400 border border-rose-500/20' 
      : 'bg-amber-950/40 text-amber-400 border border-amber-500/20';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Subtab selection */}
      <div className="flex border-b border-slate-800 pb-3 gap-6">
        <button 
          onClick={() => setActiveSubTab('payslips')}
          className={`text-sm font-bold pb-2 border-b-2 cursor-pointer transition-colors ${activeSubTab === 'payslips' ? 'border-[#D4AF37] text-white' : 'border-transparent text-slate-400 hover:text-white'}`}
        >
          Payslips & Payroll
        </button>
        <button 
          onClick={() => setActiveSubTab('expenses')}
          className={`text-sm font-bold pb-2 border-b-2 cursor-pointer transition-colors ${activeSubTab === 'expenses' ? 'border-[#D4AF37] text-white' : 'border-transparent text-slate-400 hover:text-white'}`}
        >
          Expense Reimbursements
        </button>
      </div>

      {activeSubTab === 'payslips' ? (
        /* PAYSLIPS WORKSPACE */
        <div className="space-y-8">
          {isFinancialAdmin && (
            <div className="flex justify-end gap-4">
              <button 
                onClick={() => setShowGeneratePayslip(true)}
                className="bg-[#D4AF37] text-slate-950 px-5 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all cursor-pointer"
              >
                <Plus size={16} />
                Generate Payslip
              </button>
            </div>
          )}

          {/* Financial Admin: All Payslips View */}
          {isFinancialAdmin && allPayslips.length > 0 && (
            <div className="bg-[#070f1e] border border-slate-800 rounded-xl p-6">
              <h3 className="text-md font-bold text-white mb-6 flex items-center gap-2">
                <CreditCard className="text-[#D4AF37]" size={18} />
                <span>⚜️ Corporate Payroll Registry</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/30">
                      <th className="py-4 px-6 font-semibold">Employee</th>
                      <th className="py-4 px-6 font-semibold">Period</th>
                      <th className="py-4 px-6 font-semibold">Base Salary</th>
                      <th className="py-4 px-6 font-semibold">Allowances</th>
                      <th className="py-4 px-6 font-semibold">Commissions</th>
                      <th className="py-4 px-6 font-semibold">Net Payout</th>
                      <th className="py-4 px-6 font-semibold">Status</th>
                      <th className="py-4 px-6 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allPayslips.map(slip => (
                      <tr key={slip.id} className="border-b border-slate-850 hover:bg-slate-800/10 transition-colors">
                        <td className="py-4 px-6">
                          <strong className="text-white block">{slip.user?.fullName}</strong>
                          <span className="text-[10px] text-slate-400">{slip.user?.designation}</span>
                        </td>
                        <td className="py-4 px-6 font-mono text-slate-300">{slip.payPeriod}</td>
                        <td className="py-4 px-6 text-slate-300">₹{slip.baseSalary?.toLocaleString()}</td>
                        <td className="py-4 px-6 text-slate-400">₹{slip.allowances?.toLocaleString()}</td>
                        <td className="py-4 px-6 text-emerald-400">₹{slip.commissions?.toLocaleString()}</td>
                        <td className="py-4 px-6 font-bold text-white">₹{slip.netSalary?.toLocaleString()}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-0.5 rounded-[4px] font-bold text-[9px] uppercase ${getStatusStyle(slip.status)}`}>
                            {slip.status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          {slip.status === 'PENDING' ? (
                            <button 
                              onClick={() => payPayslipMutation.mutate(slip.id)}
                              className="bg-emerald-500 text-slate-950 px-3 py-1 rounded text-[10px] font-bold hover:bg-emerald-400 transition-colors cursor-pointer"
                            >
                              Release Salary
                            </button>
                          ) : (
                            <a 
                              href={slip.pdfUrl} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-[#D4AF37] hover:underline flex items-center gap-1"
                            >
                              <ArrowDownToLine size={12} />
                              <span>Payslip</span>
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Standard Employee: My Payslips */}
          <div className="bg-[#070f1e] border border-slate-800 rounded-xl p-6">
            <h3 className="text-md font-bold text-white mb-6">📋 My Payslip logs</h3>
            {myPayslips.length === 0 ? (
              <p className="text-xs text-slate-500 py-12 text-center">No payroll logs populated in database yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/30">
                      <th className="py-4 px-6 font-semibold">Period</th>
                      <th className="py-4 px-6 font-semibold">Base Salary</th>
                      <th className="py-4 px-6 font-semibold">Allowances</th>
                      <th className="py-4 px-6 font-semibold">Commissions</th>
                      <th className="py-4 px-6 font-semibold">PF Deducted</th>
                      <th className="py-4 px-6 font-semibold">Net Received</th>
                      <th className="py-4 px-6 font-semibold">Status</th>
                      <th className="py-4 px-6 font-semibold">Payslip</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myPayslips.map(slip => (
                      <tr key={slip.id} className="border-b border-slate-850 hover:bg-slate-800/10 transition-colors">
                        <td className="py-4 px-6 font-mono text-white font-bold">{slip.payPeriod}</td>
                        <td className="py-4 px-6 text-slate-300">₹{slip.baseSalary?.toLocaleString()}</td>
                        <td className="py-4 px-6 text-slate-400">₹{slip.allowances?.toLocaleString()}</td>
                        <td className="py-4 px-6 text-emerald-400">₹{slip.commissions?.toLocaleString()}</td>
                        <td className="py-4 px-6 text-rose-400">₹{slip.pfDeduction?.toLocaleString()}</td>
                        <td className="py-4 px-6 text-slate-100 font-bold">₹{slip.netSalary?.toLocaleString()}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-0.5 rounded-[4px] font-bold text-[9px] uppercase ${getStatusStyle(slip.status)}`}>
                            {slip.status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          {slip.pdfUrl ? (
                            <a href={slip.pdfUrl} target="_blank" rel="noreferrer" className="text-[#D4AF37] hover:underline flex items-center gap-1">
                              <ArrowDownToLine size={12} />
                              <span>Download PDF</span>
                            </a>
                          ) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* EXPENSES WORKSPACE */
        <div className="space-y-8">
          <div className="flex justify-end">
            <button 
              onClick={() => setShowApplyExpense(true)}
              className="bg-[#D4AF37] text-slate-950 px-5 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all cursor-pointer"
            >
              <Plus size={16} />
              Submit Expense Claim
            </button>
          </div>

          {/* HR/Accounts Approval Desk */}
          {isFinancialAdmin && pendingExpenses.length > 0 && (
            <div className="bg-[#070f1e] border border-[#D4AF37]/20 rounded-xl p-6">
              <h3 className="text-md font-bold text-white mb-6 flex items-center gap-2">
                <Receipt className="text-[#D4AF37]" size={18} />
                <span>⚜️ Reimbursements Approval Desk</span>
              </h3>
              <div className="space-y-4">
                {pendingExpenses.map(exp => (
                  <div key={exp.id} className="bg-slate-900 border border-slate-800 p-5 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-white text-sm">{exp.user?.fullName}</strong>
                        <span className="text-[10px] text-slate-400">({exp.user?.designation})</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Category: <span className="text-[#D4AF37] font-semibold">{exp.category}</span> | Amount: <strong className="text-white">₹{exp.amount}</strong>
                      </p>
                      <p className="text-xs text-slate-500 italic mt-1 font-sans">" {exp.description} "</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => processExpenseMutation.mutate({ id: exp.id, status: 'REJECTED' })}
                        className="border border-rose-500/30 hover:bg-rose-950/20 text-rose-400 px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <XCircle size={14} />
                        Reject
                      </button>
                      <button 
                        onClick={() => processExpenseMutation.mutate({ id: exp.id, status: 'APPROVED' })}
                        className="bg-[#D4AF37] hover:bg-[#AA8B24] text-slate-950 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <CheckCircle size={14} />
                        Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* My Expenses History Logs */}
          <div className="bg-[#070f1e] border border-slate-800 rounded-xl p-6">
            <h3 className="text-md font-bold text-white mb-6">📋 My Reimbursement Claims</h3>
            {myExpenses.length === 0 ? (
              <p className="text-xs text-slate-500 py-12 text-center">No expense claims filed yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/30">
                      <th className="py-4 px-6 font-semibold">Category</th>
                      <th className="py-4 px-6 font-semibold">Description</th>
                      <th className="py-4 px-6 font-semibold">Amount</th>
                      <th className="py-4 px-6 font-semibold">Status</th>
                      <th className="py-4 px-6 font-semibold">Receipt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myExpenses.map(exp => (
                      <tr key={exp.id} className="border-b border-slate-850 hover:bg-slate-800/10 transition-colors">
                        <td className="py-4 px-6 font-bold text-[#D4AF37]">{exp.category}</td>
                        <td className="py-4 px-6 text-slate-300 truncate max-w-xs">{exp.description}</td>
                        <td className="py-4 px-6 text-white font-bold">₹{exp.amount?.toLocaleString()}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-0.5 rounded-[4px] font-bold text-[9px] uppercase ${getStatusStyle(exp.status)}`}>
                            {exp.status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          {exp.receiptUrl ? (
                            <a href={exp.receiptUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white underline">
                              View File
                            </a>
                          ) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Generate Payslip Modal */}
      {showGeneratePayslip && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#070f1e] border border-[#D4AF37]/30 w-full max-w-md rounded-xl p-6 relative animate-scale-up">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <CreditCard className="text-[#D4AF37]" size={22} />
              <span>⚜️ Generate Payslip</span>
            </h3>

            <form onSubmit={(e) => { e.preventDefault(); generatePayslipMutation.mutate(payslipForm); }} className="space-y-5">
              <div className="flex flex-col">
                <label className="text-xs text-slate-400 font-semibold mb-2">Target Employee *</label>
                <select 
                  required
                  value={payslipForm.userId}
                  onChange={e => setPayslipForm({ ...payslipForm, userId: e.target.value })}
                  className="bg-[#020617] border border-slate-800 text-slate-100 rounded-lg px-4 py-2.5 text-xs focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="">Select Employee</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.fullName} ({emp.designation})</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-slate-400 font-semibold mb-2">Pay Period (YYYY-MM) *</label>
                <input 
                  required
                  type="text"
                  placeholder="e.g. 2026-07"
                  value={payslipForm.payPeriod}
                  onChange={e => setPayslipForm({ ...payslipForm, payPeriod: e.target.value })}
                  className="bg-[#020617] border border-slate-800 text-slate-100 rounded-lg px-4 py-2.5 text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
                <button type="button" onClick={() => setShowGeneratePayslip(false)} className="px-5 py-2 text-sm font-semibold border border-slate-800 rounded-lg text-slate-300">
                  Cancel
                </button>
                <button type="submit" className="bg-[#D4AF37] text-slate-950 px-6 py-2 rounded-lg text-sm font-bold cursor-pointer">
                  Calculate & Generate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submit Expense Claim Modal */}
      {showApplyExpense && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#070f1e] border border-[#D4AF37]/30 w-full max-w-md rounded-xl p-6 relative animate-scale-up">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Receipt className="text-[#D4AF37]" size={22} />
              <span>⚜️ File Expense Claim</span>
            </h3>

            <form onSubmit={(e) => { e.preventDefault(); submitExpenseMutation.mutate(expenseForm); }} className="space-y-5">
              <div className="flex flex-col">
                <label className="text-xs text-slate-400 font-semibold mb-2">Amount (INR) *</label>
                <input 
                  required 
                  type="number" 
                  value={expenseForm.amount} 
                  onChange={e => setExpenseForm({ ...expenseForm, amount: Number(e.target.value) })}
                  className="bg-[#020617] border border-slate-800 text-slate-100 rounded-lg px-4 py-2.5 text-xs focus:outline-none" 
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-slate-400 font-semibold mb-2">Expense Category *</label>
                <select 
                  value={expenseForm.category}
                  onChange={e => setExpenseForm({ ...expenseForm, category: e.target.value })}
                  className="bg-[#020617] border border-slate-800 text-slate-100 rounded-lg px-4 py-2.5 text-xs focus:outline-none"
                >
                  <option value="TRAVEL">Travel / Fuel</option>
                  <option value="MEALS">Meals & Clients Hospitality</option>
                  <option value="MARKETING">Local Marketing Promotions</option>
                  <option value="OFFICE">Office Stationery</option>
                  <option value="OTHER">Other Expenses</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-slate-400 font-semibold mb-2">Expense Statement / Description *</label>
                <textarea 
                  required 
                  rows={3} 
                  placeholder="e.g. Travel fuel bills for Hinjewadi 3BHK client site tours..."
                  value={expenseForm.description} 
                  onChange={e => setExpenseForm({ ...expenseForm, description: e.target.value })}
                  className="bg-[#020617] border border-slate-800 text-slate-100 rounded-lg px-4 py-2.5 text-xs focus:outline-none resize-none" 
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
                <button type="button" onClick={() => setShowApplyExpense(false)} className="px-5 py-2 text-sm font-semibold border border-slate-800 rounded-lg text-slate-300">
                  Cancel
                </button>
                <button type="submit" className="bg-[#D4AF37] text-slate-950 px-6 py-2 rounded-lg text-sm font-bold cursor-pointer">
                  File Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
