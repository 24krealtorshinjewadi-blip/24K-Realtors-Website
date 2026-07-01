import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  LayoutDashboard, Users, Clock, Calendar, CheckSquare, 
  PhoneCall, Building, MapPin, CreditCard, BarChart3, 
  Settings, LogOut, Bell, Menu, X 
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<any>;
  allowedRoles?: string[];
}

export const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigationItems: NavItem[] = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Employees (HR)', path: '/dashboard/employees', icon: Users, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'HR'] },
    { label: 'Attendance', path: '/dashboard/attendance', icon: Clock },
    { label: 'Leaves', path: '/dashboard/leaves', icon: Calendar },
    { label: 'Follow-up Tasks', path: '/dashboard/tasks', icon: CheckSquare },
    { label: 'Lead CRM', path: '/dashboard/leads', icon: PhoneCall, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER', 'RELATIONSHIP_MANAGER', 'TELECALLER'] },
    { label: 'Properties', path: '/dashboard/properties', icon: Building },
    { label: 'Site Visits', path: '/dashboard/visits', icon: MapPin, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER', 'RELATIONSHIP_MANAGER'] },
    { label: 'Payroll & ERP', path: '/dashboard/payroll', icon: CreditCard, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'HR', 'ACCOUNTS'] },
    { label: 'Analytics', path: '/dashboard/analytics', icon: BarChart3, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER'] },
    { label: 'Settings', path: '/dashboard/settings', icon: Settings }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredNavItems = navigationItems.filter(item => {
    if (!item.allowedRoles) return true;
    return user && item.allowedRoles.includes(user.role);
  });

  return (
    <div className="flex h-screen bg-[#020617] text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-[#070f1e] border-r border-[#D4AF37]/20 transition-transform duration-300 transform lg:translate-x-0 lg:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800">
          <div className="flex flex-col">
            <span className="font-bold text-md tracking-wider text-white">24K OPERATOR</span>
            <span className="text-[10px] text-[#D4AF37] font-semibold tracking-[0.2em] uppercase">CONTROL PANEL</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/5 text-white border-l-4 border-[#D4AF37] pl-3' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-[#D4AF37]' : 'text-slate-400'} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-rose-400 hover:bg-rose-950/20 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-[#070f1e] border-b border-slate-800 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-400 hover:text-white">
              <Menu size={22} />
            </button>
            <h1 className="text-lg font-semibold text-white">
              {filteredNavItems.find(item => item.path === location.pathname)?.label || 'Overview'}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            {/* Notification Bell */}
            <button className="relative text-slate-400 hover:text-white">
              <Bell size={20} />
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#D4AF37] text-slate-950 text-[10px] font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {/* Profile Summary */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#AA8B24] flex items-center justify-center text-slate-950 font-bold text-sm">
                {user?.fullName ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'UR'}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-sm font-medium text-white">{user?.fullName || 'User'}</span>
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{user?.designation || user?.role}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Views */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#020617]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
