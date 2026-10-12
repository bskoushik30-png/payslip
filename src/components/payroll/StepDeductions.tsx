import React from 'react';
import { formatINR } from '../../utils/formatters';
import { ShieldCheck, Receipt, Landmark, Coins, AlertCircle } from 'lucide-react';

interface StepDeductionsProps {
  pfEnabled: boolean;
  onTogglePf: (val: boolean) => void;
  pf: number;
  onChangePf: (val: number) => void;

  esiEnabled: boolean;
  onToggleEsi: (val: boolean) => void;
  esi: number;
  onChangeEsi: (val: number) => void;

  ptEnabled: boolean;
  onTogglePt: (val: boolean) => void;
  pt: number;
  onChangePt: (val: number) => void;

  tdsEnabled: boolean;
  onToggleTds: (val: boolean) => void;
  tds: number;
  onChangeTds: (val: number) => void;

  advanceEnabled: boolean;
  onToggleAdvance: (val: boolean) => void;
  advance: number;
  onChangeAdvance: (val: number) => void;

  loanEnabled: boolean;
  onToggleLoan: (val: boolean) => void;
  loan: number;
  onChangeLoan: (val: number) => void;

  otherDeductionEnabled: boolean;
  onToggleOtherDeduction: (val: boolean) => void;
  otherDeduction: number;
  onChangeOtherDeduction: (val: number) => void;

  totalDeductions: number;
}

export const StepDeductions: React.FC<StepDeductionsProps> = ({
  pfEnabled,
  onTogglePf,
  pf,
  onChangePf,
  esiEnabled,
  onToggleEsi,
  esi,
  onChangeEsi,
  ptEnabled,
  onTogglePt,
  pt,
  onChangePt,
  tdsEnabled,
  onToggleTds,
  tds,
  onChangeTds,
  advanceEnabled,
  onToggleAdvance,
  advance,
  onChangeAdvance,
  loanEnabled,
  onToggleLoan,
  loan,
  onChangeLoan,
  otherDeductionEnabled,
  onToggleOtherDeduction,
  otherDeduction,
  onChangeOtherDeduction,
  totalDeductions,
}) => {
  const deductionItems = [
    {
      id: 'pf',
      label: 'Provident Fund (PF)',
      desc: 'Employee EPF statutory contribution',
      enabled: pfEnabled,
      onToggle: onTogglePf,
      amount: pf,
      onChange: onChangePf,
      placeholder: 'e.g. 1800',
    },
    {
      id: 'esi',
      label: 'Employee State Insurance (ESI)',
      desc: 'Health & medical insurance contribution',
      enabled: esiEnabled,
      onToggle: onToggleEsi,
      amount: esi,
      onChange: onChangeEsi,
      placeholder: 'e.g. 350',
    },
    {
      id: 'pt',
      label: 'Professional Tax (PT)',
      desc: 'State government professional tax',
      enabled: ptEnabled,
      onToggle: onTogglePt,
      amount: pt,
      onChange: onChangePt,
      placeholder: 'e.g. 200',
    },
    {
      id: 'tds',
      label: 'Tax Deducted at Source (TDS)',
      desc: 'Monthly income tax withholding',
      enabled: tdsEnabled,
      onToggle: onToggleTds,
      amount: tds,
      onChange: onChangeTds,
      placeholder: 'e.g. 2500',
    },
    {
      id: 'advance',
      label: 'Salary Advance Recovery',
      desc: 'Recovery for prior month advance',
      enabled: advanceEnabled,
      onToggle: onToggleAdvance,
      amount: advance,
      onChange: onChangeAdvance,
      placeholder: 'e.g. 5000',
    },
    {
      id: 'loan',
      label: 'Company Loan EMI',
      desc: 'Staff personal or emergency loan recovery',
      enabled: loanEnabled,
      onToggle: onToggleLoan,
      amount: loan,
      onChange: onChangeLoan,
      placeholder: 'e.g. 3000',
    },
    {
      id: 'other',
      label: 'Other Voluntary Deductions',
      desc: 'Notice pay / assets / canteen / other',
      enabled: otherDeductionEnabled,
      onToggle: onToggleOtherDeduction,
      amount: otherDeduction,
      onChange: onChangeOtherDeduction,
      placeholder: 'e.g. 500',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-sm">
          4
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Step 4 — Deductions & Recoveries</h3>
          <p className="text-xs text-slate-500">
            Configure applicable statutory contributions and voluntary deductions
          </p>
        </div>
      </div>

      {/* Deduction Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {deductionItems.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-2xl border transition-all ${
              item.enabled
                ? 'bg-white border-rose-200 shadow-xs ring-1 ring-rose-100'
                : 'bg-slate-50/70 border-slate-200/80'
            }`}
          >
            {/* Toggle header */}
            <div className="flex items-start justify-between gap-2 mb-2.5">
              <div>
                <label className="text-xs font-bold text-slate-800 block leading-tight">
                  {item.label}
                </label>
                <span className="text-[11px] text-slate-400 block mt-0.5">{item.desc}</span>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={item.enabled}
                  onChange={(e) => item.onToggle(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600"></div>
              </label>
            </div>

            {/* Input field if enabled */}
            {item.enabled ? (
              <div className="mt-3">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-bold text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={item.amount}
                    onChange={(e) => item.onChange(Math.max(0, Number(e.target.value)))}
                    placeholder={item.placeholder}
                    className="w-full pl-7 pr-3 py-1.5 rounded-lg border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-none bg-white text-slate-800"
                  />
                </div>
              </div>
            ) : (
              <div className="text-[11px] text-slate-400 italic mt-2">
                Not applicable (₹0.00)
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Deductions Total Footer */}
      <div className="p-4 bg-rose-50/70 rounded-xl border border-rose-200/80 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-900">
            Total Monthly Deductions
          </span>
          <p className="text-[11px] text-rose-700">
            Sum of all enabled statutory and voluntary deductions
          </p>
        </div>
        <div className="text-lg sm:text-xl font-extrabold text-rose-700">
          {totalDeductions > 0 ? `-${formatINR(totalDeductions)}` : '₹0.00'}
        </div>
      </div>
    </div>
  );
};
