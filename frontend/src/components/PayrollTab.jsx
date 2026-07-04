import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { Plus, Check, RefreshCw, IndianRupee, FileText, Loader } from 'lucide-react';

export default function PayrollTab() {
  const [employees, setEmployees] = useState([]);
  const [payslips, setPayslips] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [pendingExpenses, setPendingExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Forms state
  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [generateForm, setGenerateForm] = useState({ employeeId: '', yearMonth: '' });
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expenseForm, setExpenseForm] = useState({ amount: '', category: 'TRAVEL', description: '' });

  const role = localStorage.getItem('role') || 'CRM_AGENT';
  const isManagerOrHr = ['SUPER_ADMIN', 'ADMIN', 'HR'].includes(role);
  const isAccountsOrAdmin = ['SUPER_ADMIN', 'ADMIN', 'ACCOUNTS'].includes(role);

  const fetchData = async () => {
    setLoading(true);
    try {
      const slips = isManagerOrHr ? await apiService.getAllPayslips() : await apiService.getMyPayslips();
      setPayslips(slips || []);

      const exps = isManagerOrHr ? await apiService.getAllExpenses() : await apiService.getMyExpenses();
      setExpenses(exps || []);

      if (isManagerOrHr) {
        const pending = await apiService.getPendingExpenses();
        setPendingExpenses(pending || []);
      }

      if (isManagerOrHr) {
        const emps = await apiService.getEmployees();
        setEmployees(emps || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGeneratePayslip = async (e) => {
    e.preventDefault();
    try {
      await apiService.generatePayslip(generateForm);
      setShowGenerateForm(false);
      fetchData();
    } catch (err) {
      alert(`Payslip generation failed: ${err.message}`);
    }
  };

  const handlePayPayslip = async (id) => {
    try {
      await apiService.payPayslip(id);
      fetchData();
    } catch (err) {
      alert(`Payment release failed: ${err.message}`);
    }
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiService.submitExpense({
        amount: Number(expenseForm.amount),
        category: expenseForm.category,
        description: expenseForm.description
      });
      setShowExpenseForm(false);
      setExpenseForm({ amount: '', category: 'TRAVEL', description: '' });
      fetchData();
    } catch (err) {
      alert(`Expense submission failed: ${err.message}`);
    }
  };

  const handleProcessExpense = async (id, status) => {
    try {
      await apiService.processExpense(id, status);
      fetchData();
    } catch (err) {
      alert(`Expense update failed: ${err.message}`);
    }
  };

  const formatPrice = (val) => {
    if (!val) return '₹0.00';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div style={{ animation: 'slideDown 0.3s forwards', display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* SECTION 1: PAYSLIPS AND SALARY RELEASES */}
      <div style={{ background: 'rgba(7,15,30,0.6)', border: '1px solid var(--border-gold)', borderRadius: '12px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
          <h3 style={{ color: 'var(--gold-primary)', margin: 0, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} />
            <span>⚜️ Employee Salary Payslips Console</span>
          </h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            {isManagerOrHr && (
              <button onClick={() => setShowGenerateForm(!showGenerateForm)} className="btn-primary" style={{ padding: '8px 14px', fontSize: '0.82rem' }}>
                Generate Payslip
              </button>
            )}
            <button onClick={fetchData} className="btn-outline" style={{ padding: '8px 12px' }}>
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {showGenerateForm && (
          <form onSubmit={handleGeneratePayslip} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '25px', padding: '16px', border: '1px dashed var(--border-gold)', borderRadius: '8px', background: 'rgba(255,255,255,0.01)' }}>
            <div className="form-group">
              <label style={{ color: 'var(--text-light)', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Select Employee *</label>
              <select required value={generateForm.employeeId} onChange={e => setGenerateForm({ ...generateForm, employeeId: e.target.value })} className="form-input" style={{ width: '100%' }}>
                <option value="">-- Choose Employee --</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.fullName || emp.name} ({emp.designation})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label style={{ color: 'var(--text-light)', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Pay Period (YYYY-MM) *</label>
              <input required type="text" placeholder="e.g. 2026-06" value={generateForm.yearMonth} onChange={e => setGenerateForm({ ...generateForm, yearMonth: e.target.value })} className="form-input" />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'end', gap: '10px' }}>
              <button type="button" onClick={() => setShowGenerateForm(false)} className="btn-outline" style={{ padding: '8px 16px' }}>Cancel</button>
              <button type="submit" className="btn-gold" style={{ padding: '8px 16px' }}>Generate Sheet</button>
            </div>
          </form>
        )}

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
            <Loader className="animate-spin" size={24} color="#D4AF37" />
          </div>
        ) : payslips.length === 0 ? (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '15px 0' }}>No salary records or payslips found in registry.</p>
        ) : (
          <div className="table-responsive">
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Period</th>
                  {isManagerOrHr && <th>Employee</th>}
                  <th>Earnings Breakup</th>
                  <th>Deductions</th>
                  <th>Net Payout</th>
                  <th>Payment Status</th>
                  {isAccountsOrAdmin && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {payslips.map(slip => (
                  <tr key={slip.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-light)' }}>{slip.payPeriod}</td>
                    {isManagerOrHr && (
                      <td>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 500 }}>{slip.employee?.fullName}</div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{slip.employee?.designation}</span>
                      </td>
                    )}
                    <td>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <div>Base: <strong style={{ color: 'var(--text-light)' }}>{formatPrice(slip.baseSalary)}</strong></div>
                        <div>HRA+DA: <strong style={{ color: 'var(--text-light)' }}>{formatPrice(slip.allowances)}</strong></div>
                        <div>Commissions: <strong style={{ color: '#2ec4b6' }}>+{formatPrice(slip.commissionsEarned)}</strong></div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <div>PF: <strong style={{ color: '#ff4d6d' }}>-{formatPrice(slip.pfDeduction)}</strong></div>
                        <div>PT: <strong style={{ color: '#ff4d6d' }}>-{formatPrice(slip.ptDeduction)}</strong></div>
                        {slip.lateDeduction > 0 && <div>Late: <strong style={{ color: '#ff4d6d' }}>-{formatPrice(slip.lateDeduction)}</strong></div>}
                        {slip.absentDeduction > 0 && <div>Absent: <strong style={{ color: '#ff4d6d' }}>-{formatPrice(slip.absentDeduction)}</strong></div>}
                      </div>
                    </td>
                    <td style={{ fontWeight: 'bold', color: 'var(--gold-primary)' }}>{formatPrice(slip.netSalary)}</td>
                    <td>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        padding: '2px 6px', 
                        borderRadius: '4px',
                        background: slip.status === 'PAID' ? 'rgba(46,196,182,0.1)' : 'rgba(212,175,55,0.1)',
                        color: slip.status === 'PAID' ? '#2ec4b6' : 'var(--gold-light)'
                      }}>
                        {slip.status}
                      </span>
                    </td>
                    {isAccountsOrAdmin && (
                      <td>
                        {slip.status === 'GENERATED' && (
                          <button onClick={() => handlePayPayslip(slip.id)} className="btn-gold" style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}>
                            <Check size={12} /> Release Salary
                          </button>
                        )}
                        {slip.status === 'PAID' && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Concluded</span>}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SECTION 2: EXPENSES AND REIMBURSEMENTS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' }}>
        
        {/* Submit claim and history */}
        <div style={{ background: 'rgba(7,15,30,0.6)', border: '1px solid var(--border-gold)', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ color: 'var(--gold-primary)', margin: 0, fontSize: '1.1rem' }}>⚜️ Expense Reimbursement Board</h3>
            <button onClick={() => setShowExpenseForm(!showExpenseForm)} className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Plus size={14} /> Submit Expense
            </button>
          </div>

          {showExpenseForm && (
            <form onSubmit={handleExpenseSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', padding: '16px', border: '1px dashed var(--border-gold)', borderRadius: '8px' }}>
              <div className="form-group">
                <label style={{ color: 'var(--text-light)', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>Amount (INR) *</label>
                <input required type="number" value={expenseForm.amount} onChange={e => setExpenseForm({ ...expenseForm, amount: e.target.value })} className="form-input" />
              </div>
              <div className="form-group">
                <label style={{ color: 'var(--text-light)', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>Category *</label>
                <select value={expenseForm.category} onChange={e => setExpenseForm({ ...expenseForm, category: e.target.value })} className="form-input" style={{ width: '100%' }}>
                  <option value="TRAVEL">Local Commute / Chauffeur fuel</option>
                  <option value="OFFICE_SUPPLIES">Stationery / Client folders</option>
                  <option value="MARKETING">Promotions / Banners</option>
                  <option value="MEALS">Client meetings food</option>
                  <option value="OTHER">Miscellaneous / Others</option>
                </select>
              </div>
              <div className="form-group">
                <label style={{ color: 'var(--text-light)', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>Description *</label>
                <input required type="text" value={expenseForm.description} onChange={e => setExpenseForm({ ...expenseForm, description: e.target.value })} className="form-input" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'end', gap: '8px' }}>
                <button type="button" onClick={() => setShowExpenseForm(false)} className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Cancel</button>
                <button type="submit" className="btn-gold" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>File Claim</button>
              </div>
            </form>
          )}

          {expenses.length === 0 ? (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '10px 0' }}>No reimbursement claims filed.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
              {expenses.map((exp, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-muted)', padding: '12px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', padding: '2px 6px', borderRadius: '4px' }}>{exp.category}</span>
                    <div style={{ fontWeight: 600, color: 'var(--text-light)', fontSize: '0.85rem', marginTop: '6px' }}>{exp.description}</div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Filed on: {exp.createdDate?.slice(0, 10) || 'Today'}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold', color: 'var(--gold-primary)', fontSize: '0.9rem' }}>{formatPrice(exp.amount)}</div>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      color: exp.status === 'APPROVED' ? '#2ec4b6' : exp.status === 'REJECTED' ? '#ff4d6d' : 'var(--gold-light)'
                    }}>{exp.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* HR/Admin Approval Board */}
        {isManagerOrHr && (
          <div style={{ background: 'rgba(7,15,30,0.6)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ color: 'var(--gold-primary)', margin: '0 0 20px 0', fontSize: '1.1rem' }}>⚜️ Expenses Approval Desk</h3>
            {pendingExpenses.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>No pending expense claims to audit.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '320px', overflowY: 'auto' }}>
                {pendingExpenses.map(exp => (
                  <div key={exp.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-muted)', padding: '16px', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-light)', fontSize: '0.85rem' }}>{exp.employee?.fullName} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>({exp.employee?.designation})</span></div>
                        <span style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', padding: '2px 4px', borderRadius: '3px', display: 'inline-block', marginTop: '4px' }}>{exp.category}</span>
                      </div>
                      <div style={{ fontWeight: 'bold', color: 'var(--gold-primary)', fontSize: '0.95rem' }}>{formatPrice(exp.amount)}</div>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', margin: '10px 0 12px 0' }}>{exp.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'end', gap: '8px' }}>
                      <button onClick={() => handleProcessExpense(exp.id, 'REJECTED')} className="btn-outline" style={{ padding: '4px 10px', fontSize: '0.75rem', color: '#ff4d6d', borderColor: 'rgba(217,4,41,0.15)' }}>
                        Reject
                      </button>
                      <button onClick={() => handleProcessExpense(exp.id, 'APPROVED')} className="btn-gold" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                        Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
