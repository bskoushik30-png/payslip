import React from 'react';
import { formatINR } from '../../utils/formatters';
import { IndianRupee, Bus, PlusCircle, ArrowDownRight, Sparkles } from 'lucide-react';

interface StepEarningsProps {
  baseSalary: number;
  onChangeBaseSalary: (val: number) => void;
  lossOfPay: number;
  adjustedBaseSalary: number;

  hra: number;
  onChangeHra: (val: number) => void;

  busPassEnabled: boolean;
  onToggleBusPass: (enabled: boolean) => void;
  busPass: number;
  onChangeBusPass: (val: number) => void;

  travelAllowance: number;
  onChangeTravelAllowance: (val: number) => void;

  otherAllowance: number;
  onChangeOtherAllowance: (val: number) => void;

  bonus: number;
  onChangeBonus: (val: number) => void;

  overtime: number;
  onChangeOvertime: (val: number) => void;

  otherEarnings: number;
  onChangeOtherEarnings: (val: number) => void;

  grossSalary: number;
}

export const StepEarnings: React.FC<StepEarningsProps> = ({
  baseSalary,
  onChangeBaseSalary,
  lossOfPay,
  adjustedBaseSalary,
  hra,
  onChangeHra,
  busPassEnabled,
  onToggleBusPass,
  busPass,
  onChangeBusPass,
  travelAllowance,
  onChangeTravelAllowance,
  otherAllowance,
  onChangeOtherAllowance,
  bonus,
  onChangeBonus,
  overtime,
  onChangeOvertime,
  otherEarnings,
  onChangeOtherEarnings,
  grossSalary,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
          3
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Step 3 — Earnings & Allowances</h3>
          <p className="text-xs text-slate-500">
            Configure basic pay, loss of pay adjustments, and monthly allowances
          </p>
        </div>
      </div>

      {/* Base Salary & Loss of Pay Adjuster Section */}
      <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          {/* Base Salary Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Monthly Base Salary (₹) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="500"
              value={baseSalary}
              onChange={(e) => onChangeBaseSalary(Math.max(0, Number(e.target.value)))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Loss of Pay Display */}
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">
              Loss of Pay Deduction (LOP)
            </label>
            <div className="px-3.5 py-2.5 rounded-xl border border-rose-200 bg-rose-50/40 text-rose-700 font-bold text-sm flex items-center justify-between">
              <span>{lossOfPay > 0 ? `-${formatINR(lossOfPay)}` : '₹0.00'}</span>
              <span className="text-[10px] text-rose-500 font-normal">Auto-calculated</span>
            </div>
          </div>

          {/* Adjusted Base Salary Result */}
          <div>
            <label className="block text-xs font-bold text-emerald-800 mb-1">
              Adjusted Base Salary (Payable)
            </label>
            <div className="px-3.5 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-900 font-extrabold text-sm">
              {formatINR(adjustedBaseSalary)}
            </div>
          </div>
        </div>
      </div>

      {/* Allowances Grid */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Monthly Allowances & Variable Pay
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. HRA */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              House Rent Allowance (HRA) (₹)
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={hra}
              onChange={(e) => onChangeHra(Math.max(0, Number(e.target.value)))}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* 2. Other Allowance */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Other Standard Allowance (₹)
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={otherAllowance}
              onChange={(e) => onChangeOtherAllowance(Math.max(0, Number(e.target.value)))}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* 3. Travel / Conveyance */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Travel / Conveyance Allowance (₹)
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={travelAllowance}
              onChange={(e) => onChangeTravelAllowance(Math.max(0, Number(e.target.value)))}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* 4. Bus Pass Allowance with Enable / Disable toggle */}
          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 cursor-pointer">
                <Bus className="w-3.5 h-3.5 text-blue-600" />
                Bus Pass Allowance
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={busPassEnabled}
                  onChange={(e) => onToggleBusPass(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {busPassEnabled ? (
              <input
                type="number"
                min="0"
                step="100"
                value={busPass}
                onChange={(e) => onChangeBusPass(Math.max(0, Number(e.target.value)))}
                placeholder="Enter Bus Pass Amount"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              />
            ) : (
              <div className="text-[11px] text-slate-400 italic">
                Disabled (Amount: ₹0)
              </div>
            )}
          </div>

          {/* 5. Bonus / Performance Incentive */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Bonus / Incentive (₹)
            </label>
            <input
              type="number"
              min="0"
              step="500"
              value={bonus}
              onChange={(e) => onChangeBonus(Math.max(0, Number(e.target.value)))}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* 6. Overtime Pay */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Overtime Pay (₹)
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={overtime}
              onChange={(e) => onChangeOvertime(Math.max(0, Number(e.target.value)))}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* 7. Other Earnings */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Other Earnings / Arrears (₹)
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={otherEarnings}
              onChange={(e) => onChangeOtherEarnings(Math.max(0, Number(e.target.value)))}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Gross Salary Total Footer */}
      <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-200/80 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Total Gross Earnings
          </span>
          <p className="text-[11px] text-emerald-700">
            Adjusted Base + All allowances and incentives
          </p>
        </div>
        <div className="text-lg sm:text-xl font-extrabold text-emerald-900">
          {formatINR(grossSalary)}
        </div>
      </div>
    </div>
  );
};
