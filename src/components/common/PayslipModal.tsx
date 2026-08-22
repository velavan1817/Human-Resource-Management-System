import React from 'react';
import { motion } from 'motion/react';
import { X, Printer, Download, CheckCircle, ShieldCheck } from 'lucide-react';
import { PayrollRecord, Employee } from '../../types';
import { useHRMS } from '../../context/HRMSContext';

interface PayslipModalProps {
  record: PayrollRecord;
  employee?: Employee;
  onClose: () => void;
}

export const PayslipModal: React.FC<PayslipModalProps> = ({ record, employee, onClose }) => {
  const { showToast } = useHRMS();

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    showToast('Payslip Downloaded', `${record.payslipNumber}.pdf downloaded to your device.`, 'success');
  };

  const basic = record.basic || 48000;
  const allowances = record.allowances || 30000;
  const deductions = record.deductions || 11000;
  const gross = basic + allowances;
  const net = record.netSalary || gross - deductions;

  // Breakdown estimations
  const hra = Math.round(basic * 0.4);
  const specialAllowance = allowances - hra;
  const pf = Math.round(basic * 0.12);
  const tax = deductions - pf;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200"
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <span className="font-semibold text-sm text-slate-800">Official Salary Slip</span>
            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
              {record.month}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-medium transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 print:p-0 text-slate-800 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
                  D
                </div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900">Dayflow Technologies Inc.</h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Embassy Tech Village, Outer Ring Road, Bengaluru, Karnataka 560103
              </p>
              <p className="text-xs text-slate-500">CIN: U72200KA2022PTC159042 • support@dayflow.com</p>
            </div>

            <div className="sm:text-right">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Payslip For</span>
              <p className="text-base font-bold text-indigo-900">{record.month}</p>
              <p className="text-xs text-slate-500 mt-0.5">Ref: {record.payslipNumber}</p>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 mt-1.5">
                <CheckCircle className="w-3 h-3" /> Disbursed on {record.paymentDate}
              </span>
            </div>
          </div>

          {/* Employee & Bank Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
            <div>
              <span className="text-slate-400 uppercase text-[10px] font-semibold tracking-wider">Employee Name</span>
              <p className="font-semibold text-slate-900 mt-0.5">{record.employeeName}</p>
            </div>
            <div>
              <span className="text-slate-400 uppercase text-[10px] font-semibold tracking-wider">Employee ID</span>
              <p className="font-semibold text-slate-900 mt-0.5">{employee?.empId || 'EMP001'}</p>
            </div>
            <div>
              <span className="text-slate-400 uppercase text-[10px] font-semibold tracking-wider">Department</span>
              <p className="font-semibold text-slate-900 mt-0.5">{record.department}</p>
            </div>
            <div>
              <span className="text-slate-400 uppercase text-[10px] font-semibold tracking-wider">Designation</span>
              <p className="font-semibold text-slate-900 mt-0.5">{record.position}</p>
            </div>
            <div>
              <span className="text-slate-400 uppercase text-[10px] font-semibold tracking-wider">Bank Account</span>
              <p className="font-semibold text-slate-900 mt-0.5">{record.bankAccount}</p>
            </div>
            <div>
              <span className="text-slate-400 uppercase text-[10px] font-semibold tracking-wider">Payment Mode</span>
              <p className="font-semibold text-slate-900 mt-0.5">{record.paymentMethod}</p>
            </div>
            <div>
              <span className="text-slate-400 uppercase text-[10px] font-semibold tracking-wider">Pay Period Days</span>
              <p className="font-semibold text-slate-900 mt-0.5">31 Days (Paid)</p>
            </div>
            <div>
              <span className="text-slate-400 uppercase text-[10px] font-semibold tracking-wider">Joining Date</span>
              <p className="font-semibold text-slate-900 mt-0.5">{employee?.joiningDate || '2023-03-15'}</p>
            </div>
          </div>

          {/* Earnings & Deductions Tables */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Earnings */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-100/80 px-4 py-2.5 border-b border-slate-200 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Earnings</span>
                <span className="text-xs font-bold text-slate-700">Amount (₹)</span>
              </div>
              <div className="p-4 space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Basic Salary</span>
                  <span className="font-medium text-slate-900">₹{basic.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>House Rent Allowance (HRA)</span>
                  <span className="font-medium text-slate-900">₹{hra.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Special & Travel Allowances</span>
                  <span className="font-medium text-slate-900">₹{specialAllowance.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Performance Incentive</span>
                  <span className="font-medium text-slate-900">₹0</span>
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-xs">
                  <span>Gross Earnings (A)</span>
                  <span>₹{gross.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-100/80 px-4 py-2.5 border-b border-slate-200 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Deductions</span>
                <span className="text-xs font-bold text-slate-700">Amount (₹)</span>
              </div>
              <div className="p-4 space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Provident Fund (Employee PF)</span>
                  <span className="font-medium text-slate-900">₹{pf.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Income Tax (TDS)</span>
                  <span className="font-medium text-slate-900">₹{tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Professional Tax</span>
                  <span className="font-medium text-slate-900">₹200</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Other Deductions</span>
                  <span className="font-medium text-slate-900">₹0</span>
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between font-bold text-rose-700 text-xs">
                  <span>Total Deductions (B)</span>
                  <span>₹{deductions.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Salary Summary Callout */}
          <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold uppercase text-indigo-700 tracking-wider">
                Net Disbursed Take-Home Salary
              </span>
              <p className="text-xs text-indigo-600 mt-0.5">Gross Earnings (A) - Total Deductions (B)</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-indigo-950 font-display">
                ₹{net.toLocaleString('en-IN')}
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5 italic">
                (Indian Rupees Sixty-Seven Thousand Only)
              </p>
            </div>
          </div>

          {/* Signatures & Footer Notice */}
          <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-4 text-xs text-slate-500">
            <div>
              <p className="font-semibold text-slate-700">Note:</p>
              <p className="mt-0.5 text-[11px] leading-relaxed">
                This is a computer-generated salary slip and does not require a physical signature. For any payroll queries, write to payroll@dayflow.com.
              </p>
            </div>
            <div className="text-right flex flex-col justify-end items-end">
              <div className="w-28 border-b border-slate-300 pb-1 text-center font-display font-medium text-slate-600 text-xs italic">
                Priya Sharma
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Authorized HR Signatory</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
