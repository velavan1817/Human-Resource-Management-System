import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  DollarSign,
  Download,
  Eye,
  Edit2,
  CheckCircle2,
  Clock,
  Sparkles,
  CreditCard,
  Plus,
  Search,
  Filter,
  FileText,
  X,
  AlertCircle
} from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';
import { PayrollRecord, Employee } from '../../types';
import { PayslipModal } from '../../components/common/PayslipModal';
import { exportToCSV } from '../../components/common/ExportCSV';

export const AdminPayroll: React.FC = () => {
  const { employees, payroll, updatePayrollStatus, updateEmployee, showToast } = useHRMS();

  const [selectedMonth, setSelectedMonth] = useState('July 2026');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayslip, setSelectedPayslip] = useState<{
    record: PayrollRecord;
    employee?: Employee;
  } | null>(null);

  // Edit salary structure modal
  const [editingEmpSalary, setEditingEmpSalary] = useState<Employee | null>(null);
  const [salaryForm, setSalaryForm] = useState({
    basic: 45000,
    hra: 15000,
    allowances: 10000,
    taxDeduction: 4000,
    providentFund: 4000
  });

  const [isProcessingBatch, setIsProcessingBatch] = useState(false);

  // Filter records by month and search
  const filteredPayroll = payroll.filter((p) => {
    const matchesMonth = p.month === selectedMonth;
    const matchesSearch =
      p.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.payslipNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesMonth && matchesSearch;
  });

  const totalDisbursed = filteredPayroll
    .filter((p) => p.status === 'Paid')
    .reduce((sum, p) => sum + p.netSalary, 0);

  const totalGross = filteredPayroll.reduce(
    (sum, p) => sum + (p.basic + p.allowances),
    0
  );

  const totalDeductions = filteredPayroll.reduce((sum, p) => sum + p.deductions, 0);

  const paidCount = filteredPayroll.filter((p) => p.status === 'Paid').length;

  const handleOpenSalaryEdit = (empId: string) => {
    const emp = employees.find((e) => e.id === empId || e.empId === empId);
    if (emp) {
      setEditingEmpSalary(emp);
      setSalaryForm({
        basic: emp.salary.basic,
        hra: emp.salary.hra,
        allowances: emp.salary.allowances,
        taxDeduction: emp.salary.taxDeduction,
        providentFund: emp.salary.providentFund
      });
    }
  };

  const handleSaveSalaryStructure = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmpSalary) return;

    const net =
      salaryForm.basic +
      salaryForm.hra +
      salaryForm.allowances -
      (salaryForm.taxDeduction + salaryForm.providentFund);

    updateEmployee(editingEmpSalary.id, {
      salary: {
        ...editingEmpSalary.salary,
        basic: salaryForm.basic,
        hra: salaryForm.hra,
        allowances: salaryForm.allowances,
        taxDeduction: salaryForm.taxDeduction,
        providentFund: salaryForm.providentFund,
        netSalary: net
      }
    });

    setEditingEmpSalary(null);
    showToast(
      'Salary Updated',
      `Compensation package for ${editingEmpSalary.name} has been updated.`,
      'success'
    );
  };

  const handleRunAugustPayroll = () => {
    setIsProcessingBatch(true);
    setTimeout(() => {
      setIsProcessingBatch(false);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
      showToast(
        'Payroll Cycle Executed',
        'August 2026 salary registers and encrypted PDF payslips generated successfully.',
        'success'
      );
    }, 1000);
  };

  const handleExport = () => {
    const data = filteredPayroll.map((p) => ({
      Month: p.month,
      PayslipNo: p.payslipNumber,
      EmployeeID: p.empId,
      EmployeeName: p.employeeName,
      Department: p.department,
      BasicPay: p.basic,
      HRA: p.hra,
      Allowances: p.allowances,
      Deductions: p.deductions,
      NetSalary: p.netSalary,
      Status: p.status,
      PaymentDate: p.paymentDate
    }));
    exportToCSV(`Dayflow-Payroll-${selectedMonth.replace(' ', '-')}.csv`, data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-display">
            Payroll Processing & Compensation Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Calculate salary registers, manage employee compensation packages, and generate payslips.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export Payroll Register
          </button>
          <button
            onClick={handleRunAugustPayroll}
            disabled={isProcessingBatch}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isProcessingBatch ? 'Executing Cycle...' : 'Process Next Month Cycle'}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Total Net Disbursed
          </span>
          <p className="text-2xl font-bold text-emerald-700 font-display mt-1">
            ₹{totalDisbursed.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-slate-500 font-medium">
            {paidCount} / {filteredPayroll.length} payouts settled
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Gross Earnings
          </span>
          <p className="text-2xl font-bold text-slate-900 font-display mt-1">
            ₹{totalGross.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-slate-500 font-medium">Basic + allowances</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Statutory Deductions
          </span>
          <p className="text-2xl font-bold text-rose-700 font-display mt-1">
            ₹{totalDeductions.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-slate-500 font-medium">EPF + TDS withholdings</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Disbursal Period
          </span>
          <p className="text-2xl font-bold text-indigo-900 font-display mt-1">{selectedMonth}</p>
          <span className="text-[11px] text-emerald-600 font-medium">Settlement completed</span>
        </div>
      </div>

      {/* Filter and Month Selector */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search employee or slip ref..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-600">Payroll Cycle:</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:bg-white"
          >
            <option value="July 2026">July 2026 (Completed)</option>
            <option value="June 2026">June 2026 (Archived)</option>
          </select>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-600 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5 px-4">Emp ID</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Basic Pay</th>
                <th className="py-3.5 px-4">Allowances</th>
                <th className="py-3.5 px-4">Deductions</th>
                <th className="py-3.5 px-4">Net Salary</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredPayroll.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-slate-400">
                    No payroll entries found.
                  </td>
                </tr>
              ) : (
                filteredPayroll.map((item) => {
                  const emp = employees.find((e) => e.id === item.employeeId);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900">{item.employeeName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{item.payslipNumber}</p>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-700">{item.empId}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                          {item.department}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-800">₹{item.basic.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 text-slate-800">₹{item.allowances.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 text-rose-600">-₹{item.deductions.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 font-bold text-emerald-700">
                        ₹{item.netSalary.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedPayslip({ record: item, employee: emp })}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                            title="Preview Certified Payslip"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenSalaryEdit(item.employeeId)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Compensation Package"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Salary Structure Modal */}
      {editingEmpSalary && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">
                Adjust Package: {editingEmpSalary.name}
              </h3>
              <button
                onClick={() => setEditingEmpSalary(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSalaryStructure} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Basic Salary (₹)</label>
                <input
                  type="number"
                  required
                  value={salaryForm.basic}
                  onChange={(e) =>
                    setSalaryForm({ ...salaryForm, basic: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">HRA Allowance (₹)</label>
                  <input
                    type="number"
                    value={salaryForm.hra}
                    onChange={(e) => setSalaryForm({ ...salaryForm, hra: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Other Allowances (₹)</label>
                  <input
                    type="number"
                    value={salaryForm.allowances}
                    onChange={(e) =>
                      setSalaryForm({ ...salaryForm, allowances: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tax TDS (₹)</label>
                  <input
                    type="number"
                    value={salaryForm.taxDeduction}
                    onChange={(e) =>
                      setSalaryForm({ ...salaryForm, taxDeduction: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">PF Contribution (₹)</label>
                  <input
                    type="number"
                    value={salaryForm.providentFund}
                    onChange={(e) =>
                      setSalaryForm({ ...salaryForm, providentFund: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between text-emerald-950 font-semibold">
                <span>Calculated Net Salary:</span>
                <span className="font-bold text-emerald-700 text-sm font-display">
                  ₹
                  {(
                    salaryForm.basic +
                    salaryForm.hra +
                    salaryForm.allowances -
                    (salaryForm.taxDeduction + salaryForm.providentFund)
                  ).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingEmpSalary(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
                >
                  Update Structure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certified Payslip Preview Modal */}
      {selectedPayslip && (
        <PayslipModal
          record={selectedPayslip.record}
          employee={selectedPayslip.employee}
          onClose={() => setSelectedPayslip(null)}
        />
      )}
    </div>
  );
};
