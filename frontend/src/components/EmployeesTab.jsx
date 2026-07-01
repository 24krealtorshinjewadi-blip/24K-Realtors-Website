import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { Plus, Search, ShieldCheck, Mail, Phone, Briefcase, RefreshCw, Loader } from 'lucide-react';

export default function EmployeesTab() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
    role: 'RELATIONSHIP_MANAGER',
    designation: 'Sales Advisor',
    department: 'Sales & Advisory',
    salaryBase: 35000,
    panNumber: '',
    aadharNumber: '',
    bankName: '',
    bankAccountNumber: ''
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await apiService.getEmployees();
      setEmployees(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      await apiService.createEmployee(form);
      setShowAddForm(false);
      setForm({
        username: '',
        password: '',
        fullName: '',
        email: '',
        phone: '',
        role: 'RELATIONSHIP_MANAGER',
        designation: 'Sales Advisor',
        department: 'Sales & Advisory',
        salaryBase: 35000,
        panNumber: '',
        aadharNumber: '',
        bankName: '',
        bankAccountNumber: ''
      });
      fetchEmployees();
    } catch (err) {
      alert(`Failed to add employee: ${err.message}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div style={{ animation: 'slideDown 0.3s forwards' }}>
      <div className="action-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <h2 className="luxury-title" style={{ fontSize: '1.4rem', margin: 0 }}>⚜️ Employee HR Management</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setShowAddForm(!showAddForm)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={16} />
            Onboard Employee
          </button>
          <button onClick={fetchEmployees} className="btn-outline" style={{ padding: '10px 16px', fontSize: '0.9rem' }}>
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="form-drawer-overlay" style={{ background: 'rgba(7, 15, 30, 0.6)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-gold)', marginBottom: '25px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-muted)', paddingBottom: '10px' }}>
            <h3 style={{ color: 'var(--gold-primary)', margin: 0 }}>⚜️ Onboard New Employee</h3>
            <button onClick={() => setShowAddForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
          </div>
          <form onSubmit={handleAddEmployee} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label style={{ color: 'var(--text-light)', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Username *</label>
              <input required type="text" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} className="form-input" />
            </div>
            <div className="form-group">
              <label style={{ color: 'var(--text-light)', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Password *</label>
              <input required type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="form-input" />
            </div>
            <div className="form-group">
              <label style={{ color: 'var(--text-light)', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Full Name *</label>
              <input required type="text" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} className="form-input" />
            </div>
            <div className="form-group">
              <label style={{ color: 'var(--text-light)', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Email Address *</label>
              <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="form-input" />
            </div>
            <div className="form-group">
              <label style={{ color: 'var(--text-light)', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Phone Contact *</label>
              <input required type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="form-input" />
            </div>
            <div className="form-group">
              <label style={{ color: 'var(--text-light)', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Designation *</label>
              <input required type="text" value={form.designation} onChange={e => setForm({ ...form, designation: e.target.value })} className="form-input" />
            </div>
            <div className="form-group">
              <label style={{ color: 'var(--text-light)', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Role Type *</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="form-input" style={{ width: '100%' }}>
                <option value="RELATIONSHIP_MANAGER">Relationship Manager</option>
                <option value="TELECALLER">Telecaller</option>
                <option value="SALES_MANAGER">Sales Manager</option>
                <option value="HR">HR Manager</option>
                <option value="ACCOUNTS">Finance Accounts</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>
            <div className="form-group">
              <label style={{ color: 'var(--text-light)', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Base Salary (INR Monthly) *</label>
              <input required type="number" value={form.salaryBase} onChange={e => setForm({ ...form, salaryBase: Number(e.target.value) })} className="form-input" />
            </div>
            <div className="form-group">
              <label style={{ color: 'var(--text-light)', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>PAN Card Number</label>
              <input type="text" value={form.panNumber} onChange={e => setForm({ ...form, panNumber: e.target.value })} className="form-input" />
            </div>
            <div className="form-group">
              <label style={{ color: 'var(--text-light)', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Aadhar Card Number</label>
              <input type="text" value={form.aadharNumber} onChange={e => setForm({ ...form, aadharNumber: e.target.value })} className="form-input" />
            </div>
            <div className="form-group">
              <label style={{ color: 'var(--text-light)', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Bank Name</label>
              <input type="text" value={form.bankName} onChange={e => setForm({ ...form, bankName: e.target.value })} className="form-input" />
            </div>
            <div className="form-group">
              <label style={{ color: 'var(--text-light)', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Bank Account Number</label>
              <input type="text" value={form.bankAccountNumber} onChange={e => setForm({ ...form, bankAccountNumber: e.target.value })} className="form-input" />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'end', gap: '10px', marginTop: '10px' }}>
              <button type="button" onClick={() => setShowAddForm(false)} className="btn-outline">Cancel</button>
              <button type="submit" disabled={submitLoading} className="btn-gold" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {submitLoading && <Loader className="animate-spin" size={14} />}
                Add Employee
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px 0' }}>
          <Loader className="animate-spin" size={32} color="#D4AF37" />
        </div>
      ) : employees.length === 0 ? (
        <div className="empty-state">No active employees. Click "Onboard Employee" to register.</div>
      ) : (
        <div className="table-responsive">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role / Designation</th>
                <th>Contact</th>
                <th>Verification Accounts</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-light)' }}>{emp.fullName || emp.name}</div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {emp.username || emp.id}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Briefcase size={12} color="var(--gold-primary)" />
                      <span>{emp.designation || 'Sales Executive'}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', background: 'rgba(212,175,55,0.08)', color: 'var(--gold-primary)', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', marginTop: '4px', textTransform: 'capitalize' }}>
                      {emp.role ? emp.role.replace('_', ' ') : 'Agent'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}><Mail size={12} /> {emp.email}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', marginTop: '4px' }}><Phone size={12} /> {emp.phone}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.75rem' }}>
                      <div>PAN: <strong style={{ color: 'var(--text-light)' }}>{emp.panNumber || 'NA'}</strong></div>
                      <div>Bank Account: <strong style={{ color: 'var(--text-light)' }}>{emp.bankAccountNumber || 'NA'}</strong></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
