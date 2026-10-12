import React from 'react';
import { formatINR } from '../../utils/formatters';
import { numberToWordsINR } from '../../utils/numberToWords';
import { SalaryCalculationResult } from '../../utils/calculations';
import { Eye, FileDown, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

interface LiveSalarySummaryProps {
  calculation: SalaryCalculationResult;
  onPreview: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  isEditingExisting?: boolean;
}

export const LiveSalarySummary: React.FC<LiveSalarySummaryProps> = ({
  calculation,
  onPreview,
  onSubmit,
  isSubmitting,
  isEditingExisting,
}) => {
  const {
    payable_days,
    loss_of_pay,
    adjusted_base_salary,
    gross_salary,
    total_deductions,
    net_salary,
    validationErrors,
  } = calculation;

  const amountInWords = numberToWordsINR(net_salary);
  const hasErrors = validationErrors.length > 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md p-5 space-y-5 sticky top-20">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Live Payroll Summary
        </h4>
        <span className="text-[11px] font-semibold text-slate-400">Real-Time Calc</span>
      </div>

      {/* Validation alert if any */}
      {hasErrors && (
        <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-amber-800 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Attendance / Input Warning</span>
          </div>
          {validationErrors.map((err, i) => (
            <p key={i} className="text-[11px] pl-5 leading-tight">
              • {err}
            </p>
          ))}
        </div>
      )}

      {/* Salary Breakdown List */}
      <div className="space-y-2.5 text-xs text-slate-600">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Payable Days:</span>
          <span className="font-semibold text-slate-800">{payable_days} days</span>
        </div>

        {loss_of_pay > 0 && (
          <div className="flex items-center justify-between text-rose-600">
            <span>Loss of Pay (LOP):</span>
            <span className="font-bold">-{formatINR(loss_of_pay)}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
          <span className="font-medium text-slate-700">Gross Earnings:</span>
          <span className="font-bold text-slate-900 text-sm">{formatINR(gross_salary)}</span>
        </div>

        <div className="flex items-center justify-between text-rose-600">
          <span className="font-medium">Total Deductions:</span>
          <span className="font-bold text-sm">
            {total_deductions > 0 ? `-${formatINR(total_deductions)}` : '₹0.00'}
          </span>
        </div>
      </div>

      {/* Net Salary Highlight Card */}
      <div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-950 text-white p-4 rounded-2xl shadow-inner space-y-2">
        <div className="flex items-center justify-between text-xs text-emerald-300 font-semibold uppercase tracking-wider">
          <span>Net Take-Home Pay</span>
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold font-display text-emerald-400 tracking-tight">
          {formatINR(net_salary)}
        </div>
        <div className="pt-2 border-t border-slate-700/60">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">
            Amount in Words:
          </p>
          <p className="text-xs text-slate-200 font-medium italic leading-snug">
            "{amountInWords}"
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2">
        <button
          type="button"
          onClick={onPreview}
          disabled={hasErrors}
          className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200/80 active:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Eye className="w-4 h-4 text-slate-600" />
          Preview Salary Slip
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting || hasErrors}
          className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <CheckCircle className="w-4 h-4" />
          {isSubmitting
            ? 'Saving Payroll...'
            : isEditingExisting
            ? 'Update & Save Payslip'
            : 'Save & Generate Payslip'}
        </button>
      </div>
    </div>
  );
};
