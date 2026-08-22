import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  DollarSign,
  Download,
  Eye,
  FileText,
  CheckCircle2,
  TrendingUp,
  ShieldAlert,
  CreditCard,
  Building,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHRMS } from '../../context/HRMSContext';
import { PayslipModal } from '../../components/common/PayslipModal';
import { PayrollRecord } from '../../types';

export const EmployeePayroll: React.FC = () => {
  const { currentUser } = useAuth();
  const { payroll, showToast } = useHRMS();
  const [selectedPayslip, setSelectedPayslip] = useState<PayrollRecord | null>(null);

  const empId = currentUser?.id || 'emp-001';
  const myPayrollRecords = payroll.filter((p) => p.employeeId === empId);

  const salary = currentUser?.salary || {
    basic: 48000,
    hra: 18000,
    allowances: 12000,
    taxDeduction: 5200,
    providentFund: 4800,
    otherDeductions: 1000,
    netSalary: 67000,
    currency: '₹'
  };

  const grossEarnings = salary.basic + salary.hra + salary.allowances;
  const totalDeductions = salary.taxDeduction + salary.providentFund + salary.otherDeductions;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-display">
            Payroll & Compensation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Read-only breakdown of your compensation structure, tax deductions, and historical pay slips.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Salary Account Verified
          </span>
        </div>
      </div>

      {/* Primary Compensation Snapshot Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Take Home */}
        <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 p-5 rounded-2xl text-white shadow-md flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
            Net Monthly Payout
          </span>
          <div className="my-3">
            <p className="text-3xl font-bold font-display tracking-tight text-white">
              ₹{salary.netSalary.toLocaleString('en-IN')}
            </p>
            <span className="text-[11px] text-emerald-300 font-medium">Direct Bank Transfer</span>
          </div>
          <span className="text-[10px] text-indigo-300/80">Credited on the last working day</span>
        </div>

        {/* Gross CTC Earnings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Gross Earnings
          </span>
          <div className="my-3">
            <p className="text-3xl font-bold font-display tracking-tight text-slate-900">
              ₹{grossEarnings.toLocaleString('en-IN')}
            </p>
            <span className="text-[11px] text-slate-500">Basic + HRA + Allowances</span>
          </div>
          <span className="text-[10px] text-slate-400">Before statutory deductions</span>
        </div>

        {/* Total Deductions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Statutory Deductions
          </span>
          <div className="my-3">
            <p className="text-3xl font-bold font-display tracking-tight text-rose-700">
              ₹{totalDeductions.toLocaleString('en-IN')}
            </p>
            <span className="text-[11px] text-slate-500">EPF + TDS + Professional Tax</span>
          </div>
          <span className="text-[10px] text-slate-400">Deposited to govt portals</span>
        </div>

        {/* Annual CTC */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Annual Cost to Company
          </span>
          <div className="my-3">
            <p className="text-3xl font-bold font-display tracking-tight text-slate-900">
              ₹{(grossEarnings * 12).toLocaleString('en-IN')}
            </p>
            <span className="text-[11px] text-indigo-600 font-semibold">12x Monthly Package</span>
          </div>
          <span className="text-[10px] text-slate-400">Fixed annual baseline</span>
        </div>
      </div>

      {/* Salary Component Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Earnings Breakdown
            </h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              Total: ₹{grossEarnings.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-50">
              <div>
                <span className="font-semibold text-slate-800">Basic Salary</span>
                <p className="text-[11px] text-slate-500">Core component of CTC</p>
              </div>
              <span className="font-bold text-slate-900">₹{salary.basic.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-slate-50">
              <div>
                <span className="font-semibold text-slate-800">House Rent Allowance (HRA)</span>
                <p className="text-[11px] text-slate-500">Tax exempt with rent receipts</p>
              </div>
              <span className="font-bold text-slate-900">₹{salary.hra.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-slate-50">
              <div>
                <span className="font-semibold text-slate-800">Special & Travel Allowances</span>
                <p className="text-[11px] text-slate-500">Fixed flexi-benefits & transport</p>
              </div>
              <span className="font-bold text-slate-900">₹{salary.allowances.toLocaleString('en-IN')}</span>
            </div>

            <div className="pt-2 flex justify-between font-bold text-slate-900 text-sm">
              <span>Gross Monthly Earnings</span>
              <span className="text-indigo-900">₹{grossEarnings.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Deductions Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              Statutory & Tax Deductions
            </h3>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
              Total: -₹{totalDeductions.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-50">
              <div>
                <span className="font-semibold text-slate-800">Provident Fund (EPF)</span>
                <p className="text-[11px] text-slate-500">12% employee contribution</p>
              </div>
              <span className="font-bold text-rose-700">
                -₹{salary.providentFund.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-slate-50">
              <div>
                <span className="font-semibold text-slate-800">Income Tax (TDS)</span>
                <p className="text-[11px] text-slate-500">Based on standard tax regime</p>
              </div>
              <span className="font-bold text-rose-700">
                -₹{salary.taxDeduction.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-slate-50">
              <div>
                <span className="font-semibold text-slate-800">Professional Tax & Other</span>
                <p className="text-[11px] text-slate-500">State government levy</p>
              </div>
              <span className="font-bold text-rose-700">
                -₹{salary.otherDeductions.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="pt-2 flex justify-between font-bold text-slate-900 text-sm">
              <span>Total Monthly Deductions</span>
              <span className="text-rose-700">-₹{totalDeductions.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Payslips Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Historical Payslips & Records</h3>
            <p className="text-xs text-slate-500">Download or preview certified salary certificates.</p>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
            {myPayrollRecords.length} Slips Available
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-600 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Pay Period Month</th>
                <th className="py-3.5 px-4">Payslip Ref #</th>
                <th className="py-3.5 px-4">Gross Earnings</th>
                <th className="py-3.5 px-4">Total Deductions</th>
                <th className="py-3.5 px-4">Net Salary</th>
                <th className="py-3.5 px-4">Disbursal Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {myPayrollRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    {rec.month}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">{rec.payslipNumber}</td>
                  <td className="py-3.5 px-4 text-slate-800">
                    ₹{(rec.basic + rec.allowances).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-rose-600">-₹{rec.deductions.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700">
                    ₹{rec.netSalary.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">{rec.paymentDate}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedPayslip(rec)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Payslip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payslip Modal */}
      {selectedPayslip && (
        <PayslipModal
          record={selectedPayslip}
          employee={currentUser || undefined}
          onClose={() => setSelectedPayslip(null)}
        />
      )}
    </div>
  );
};
