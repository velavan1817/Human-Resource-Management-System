import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import {
  TrendingUp,
  Download,
  Calendar,
  Building,
  Users,
  DollarSign,
  PieChart as PieIcon,
  CheckCircle2,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';
import { exportToCSV } from '../../components/common/ExportCSV';

export const AdminReports: React.FC = () => {
  const { employees, leaves, payroll, showToast } = useHRMS();
  const [timeRange, setTimeRange] = useState('2026-YTD');

  // Chart 1: Monthly Attendance Compliance Rate Trend
  const attendanceTrendData = [
    { month: 'Jan', rate: 92.4, onTime: 90.1 },
    { month: 'Feb', rate: 93.8, onTime: 91.5 },
    { month: 'Mar', rate: 95.1, onTime: 93.0 },
    { month: 'Apr', rate: 94.2, onTime: 92.4 },
    { month: 'May', rate: 96.0, onTime: 94.8 },
    { month: 'Jun', rate: 95.5, onTime: 93.7 },
    { month: 'Jul', rate: 96.8, onTime: 95.2 },
    { month: 'Aug (Cur)', rate: 97.2, onTime: 96.0 }
  ];

  // Chart 2: Department Headcount & Payroll Spend
  const deptData = [
    { name: 'Engineering', employees: 5, payroll: 372000 },
    { name: 'Product', employees: 2, payroll: 165000 },
    { name: 'Design', employees: 1, payroll: 72000 },
    { name: 'HR', employees: 1, payroll: 78000 },
    { name: 'Marketing', employees: 1, payroll: 62000 }
  ];

  // Chart 3: Leave Distribution by Category
  const leaveCategoryData = [
    { name: 'Paid Leave (PL)', value: 14, color: '#10b981' },
    { name: 'Sick Leave (SL)', value: 8, color: '#6366f1' },
    { name: 'Casual Leave (CL)', value: 4, color: '#f59e0b' },
    { name: 'Unpaid Leave (LWP)', value: 1, color: '#94a3b8' }
  ];

  // Chart 4: Monthly Payroll Expense Trend
  const payrollExpenseTrend = [
    { month: 'Jan', amount: 580000 },
    { month: 'Feb', amount: 610000 },
    { month: 'Mar', amount: 645000 },
    { month: 'Apr', amount: 690000 },
    { month: 'May', amount: 710000 },
    { month: 'Jun', amount: 725000 },
    { month: 'Jul', amount: 749000 }
  ];

  const handleExportSummary = () => {
    const summaryRows = [
      { Metric: 'Total Organization Headcount', Value: employees.length },
      { Metric: 'Average Monthly Attendance Rate', Value: '96.2%' },
      { Metric: 'Annual Employee Retention Rate', Value: '98.5%' },
      { Metric: 'Total July Payroll Expenditure (INR)', Value: '7,49,000' },
      { Metric: 'Pending Leave Approvals', Value: leaves.filter((l) => l.status === 'Pending').length }
    ];
    exportToCSV('Dayflow-Executive-HR-Report-2026.csv', summaryRows);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-display">
            Workforce Intelligence & HR Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Executive metrics on organizational growth, attendance compliance, and compensation trends.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
          >
            <option value="2026-YTD">Year to Date (2026)</option>
            <option value="Q3-2026">Q3 (Jul - Sep 2026)</option>
            <option value="Q2-2026">Q2 (Apr - Jun 2026)</option>
          </select>
          <button
            onClick={handleExportSummary}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export Executive Report
          </button>
        </div>
      </div>

      {/* KPI Highlight Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Employee Retention Rate
          </span>
          <div className="my-2">
            <p className="text-3xl font-bold font-display text-emerald-700">98.5%</p>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +1.2% year-over-year
            </span>
          </div>
          <span className="text-[10px] text-slate-400">Industry benchmark: 89%</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Avg. Shift Compliance
          </span>
          <div className="my-2">
            <p className="text-3xl font-bold font-display text-slate-900">96.8%</p>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> High punctual turnout
            </span>
          </div>
          <span className="text-[10px] text-slate-400">Target goal: 95.0%</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Average Tenure
          </span>
          <div className="my-2">
            <p className="text-3xl font-bold font-display text-slate-900">2.8 Yrs</p>
            <span className="text-[11px] text-indigo-600 font-semibold mt-0.5 block">
              Healthy team longevity
            </span>
          </div>
          <span className="text-[10px] text-slate-400">Across 7 departments</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Annual Leave Burn Rate
          </span>
          <div className="my-2">
            <p className="text-3xl font-bold font-display text-indigo-900">42.1%</p>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Balanced time-off pacing</span>
          </div>
          <span className="text-[10px] text-slate-400">Optimal for Q3 season</span>
        </div>
      </div>

      {/* Primary Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Compliance Trend */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Attendance & Punctuality Trend</h3>
              <p className="text-xs text-slate-500">2026 Monthly percentage compliance (%)</p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              Avg 96.2%
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="rateGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <YAxis domain={[85, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="rate"
                  name="Attendance %"
                  stroke="#4f46e5"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#rateGradient)"
                />
                <Line
                  type="monotone"
                  dataKey="onTime"
                  name="Punctual %"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Payroll Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Payroll Expenditure by Unit</h3>
              <p className="text-xs text-slate-500">Monthly compensation budget in INR (₹)</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <YAxis
                  tickFormatter={(val) => `₹${val / 1000}k`}
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Monthly Payroll']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="payroll" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leave Category Distribution Pie */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Leave Category Utilization</h3>
              <p className="text-xs text-slate-500">Breakdown of submitted time-off types</p>
            </div>
          </div>

          <div className="h-64 w-full flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="h-52 w-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leaveCategoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {leaveCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 text-xs">
              {leaveCategoryData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-md" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-700 font-medium">{item.name}:</span>
                  <span className="font-bold text-slate-900">{item.value} days</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Payroll Growth */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Organization Payroll Growth</h3>
              <p className="text-xs text-slate-500">Jan – Jul 2026 total salary disbursals</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={payrollExpenseTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <YAxis
                  domain={[500000, 800000]}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Disbursed']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#10b981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
