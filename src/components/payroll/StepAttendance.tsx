import React from 'react';
import { CalendarCheck, Info, Check, AlertCircle } from 'lucide-react';

interface StepAttendanceProps {
  workingDays: number;
  onChangeWorkingDays: (val: number) => void;
  presentDays: number;
  onChangePresentDays: (val: number) => void;
  paidLeave: number;
  onChangePaidLeave: (val: number) => void;
  unpaidLeave: number;
  onChangeUnpaidLeave: (val: number) => void;
  holidays: number;
  onChangeHolidays: (val: number) => void;
  payableDays: number;
  validationErrors?: string[];
}

export const StepAttendance: React.FC<StepAttendanceProps> = ({
  workingDays,
  onChangeWorkingDays,
  presentDays,
  onChangePresentDays,
  paidLeave,
  onChangePaidLeave,
  unpaidLeave,
  onChangeUnpaidLeave,
  holidays,
  onChangeHolidays,
  payableDays,
  validationErrors = [],
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-sm">
          2
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Step 2 — Monthly Attendance & Leaves</h3>
          <p className="text-xs text-slate-500">
            Record working days, presence, paid leaves, and loss of pay unpaid absences
          </p>
        </div>
      </div>

      {/* Quick Attendance Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Working Days
          </span>
          <span className="text-lg font-extrabold text-slate-800">{workingDays}</span>
        </div>

        <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
            Present Days
          </span>
          <span className="text-lg font-extrabold text-emerald-700">{presentDays}</span>
        </div>

        <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
            Paid Leave
          </span>
          <span className="text-lg font-extrabold text-blue-700">{paidLeave}</span>
        </div>

        <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">
            Unpaid (LOP)
          </span>
          <span className="text-lg font-extrabold text-rose-700">{unpaidLeave}</span>
        </div>

        <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block">
            Holidays
          </span>
          <span className="text-lg font-extrabold text-purple-700">{holidays}</span>
        </div>

        <div className="p-3 bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-xl shadow-xs text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-100 block">
            Payable Days
          </span>
          <span className="text-lg font-black">{payableDays}</span>
        </div>
      </div>

      {/* Manual Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Working Days */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Total Working Days in Month <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            min="1"
            max="31"
            step="0.5"
            value={workingDays}
            onChange={(e) => onChangeWorkingDays(Math.max(0, Number(e.target.value)))}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
          <p className="text-[11px] text-slate-400 mt-1">Excludes official weekend/holidays</p>
        </div>

        {/* 2. Present Days */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Present Days <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            min="0"
            max="31"
            step="0.5"
            value={presentDays}
            onChange={(e) => onChangePresentDays(Math.max(0, Number(e.target.value)))}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
          <p className="text-[11px] text-slate-400 mt-1">Actual days worked</p>
        </div>

        {/* 3. Paid Leave */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Paid Leave Days
          </label>
          <input
            type="number"
            min="0"
            max="31"
            step="0.5"
            value={paidLeave}
            onChange={(e) => onChangePaidLeave(Math.max(0, Number(e.target.value)))}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
          <p className="text-[11px] text-slate-400 mt-1">Casual / Sick / Earned leaves</p>
        </div>

        {/* 4. Unpaid Leave (Loss of Pay) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Unpaid Leave / Absent Days (LOP)
          </label>
          <input
            type="number"
            min="0"
            max="31"
            step="0.5"
            value={unpaidLeave}
            onChange={(e) => onChangeUnpaidLeave(Math.max(0, Number(e.target.value)))}
            className="w-full px-3.5 py-2 rounded-xl border border-rose-200 text-rose-700 bg-rose-50/20 text-sm font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-none"
          />
          <p className="text-[11px] text-rose-500 mt-1">Deducts daily salary proportional to LOP</p>
        </div>

        {/* 5. Number of Holidays */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Number of Holidays
          </label>
          <input
            type="number"
            min="0"
            max="15"
            step="1"
            value={holidays}
            onChange={(e) => onChangeHolidays(Math.max(0, Number(e.target.value)))}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
          <p className="text-[11px] text-slate-400 mt-1">Company public holidays</p>
        </div>

        {/* 6. Payable Days Display */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Computed Payable Days
          </label>
          <div className="w-full px-3.5 py-2 rounded-xl border border-emerald-200 bg-emerald-50/50 text-emerald-800 text-sm font-extrabold flex items-center justify-between">
            <span>{payableDays} Days</span>
            <span className="text-[10px] font-normal text-emerald-600">(Present + Paid)</span>
          </div>
          <p className="text-[11px] text-emerald-600 mt-1">Used for final salary calculation</p>
        </div>
      </div>
    </div>
  );
};
