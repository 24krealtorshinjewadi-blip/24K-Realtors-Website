import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient';
import { 
  Users, CheckCircle2, Building2, ClipboardList, 
  ArrowUpRight, AlertCircle, Loader2
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  Tooltip, PieChart, Pie, Cell 
} from 'recharts';

interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  convertedLeads: number;
  activeProperties: number;
}

export const Overview: React.FC = () => {
  const { data: stats, isLoading, error } = useQuery<DashboardStats>({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const response = await apiClient.get('/dashboard/stats');
      return response.data;
    }
  });

  const chartData = [
    { name: 'Jan', leads: 40, sales: 24 },
    { name: 'Feb', leads: 45, sales: 28 },
    { name: 'Mar', leads: 78, sales: 50 },
    { name: 'Apr', leads: 60, sales: 42 },
    { name: 'May', leads: 95, sales: 65 },
    { name: 'Jun', leads: 120, sales: 85 }
  ];

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#D4AF37]" size={36} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-950/20 border border-rose-500/20 text-rose-400 p-6 rounded-xl flex items-center gap-4">
        <AlertCircle size={24} />
        <div>
          <h3 className="font-bold">Execution Interrupted</h3>
          <p className="text-sm opacity-80">Failed to fetch platform metrics from core API services.</p>
        </div>
      </div>
    );
  }

  const kpis = [
    { label: 'Total Leads', val: stats?.totalLeads || 0, icon: Users, desc: 'Acquired leads in pipeline', color: 'text-[#D4AF37]' },
    { label: 'Active Leads', val: stats?.contactedLeads || 0, icon: ClipboardList, desc: 'Leads currently in contact', color: 'text-amber-400' },
    { label: 'Converted', val: stats?.convertedLeads || 0, icon: CheckCircle2, desc: 'Successfully closed deals', color: 'text-emerald-400' },
    { label: 'Active Inventory', val: stats?.activeProperties || 0, icon: Building2, desc: 'Verified luxury listings', color: 'text-sky-400' },
  ];

  const pieData = [
    { name: 'New Leads', value: stats?.newLeads || 0 },
    { name: 'Contacted', value: stats?.contactedLeads || 0 },
    { name: 'Converted', value: stats?.convertedLeads || 0 },
  ];
  const COLORS = ['#D4AF37', '#60a5fa', '#34d399'];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-[#070f1e] border border-slate-800 hover:border-[#D4AF37]/30 transition-all p-6 rounded-xl relative group">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg bg-slate-800/40 ${kpi.color}`}>
                  <Icon size={20} />
                </div>
                <button className="text-slate-500 hover:text-white transition-colors">
                  <ArrowUpRight size={18} />
                </button>
              </div>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{kpi.label}</h3>
              <p className="text-3xl font-bold text-white mt-2 tracking-tight">{kpi.val}</p>
              <p className="text-xs text-slate-500 mt-2">{kpi.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Graphs Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-[#070f1e] border border-slate-800 p-6 rounded-xl lg:col-span-2">
          <h3 className="text-md font-bold text-white mb-6 flex items-center gap-2">
            <span>📈 Pipeline Trend Index</span>
            <span className="text-[10px] bg-slate-800 text-[#D4AF37] px-2 py-0.5 rounded font-semibold uppercase tracking-wider">Live</span>
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#070f1e', borderColor: '#1e293b' }} />
                <Area type="monotone" dataKey="leads" stroke="#D4AF37" strokeWidth={2} fillOpacity={1} fill="url(#colorLeads)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#070f1e] border border-slate-800 p-6 rounded-xl flex flex-col justify-between">
          <div>
            <h3 className="text-md font-bold text-white mb-6">📊 Pipeline Distribution</h3>
            <div className="h-48 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            {pieData.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                  <span className="text-slate-400">{item.name}</span>
                </div>
                <strong className="text-white">{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
