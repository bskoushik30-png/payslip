import React from 'react';
import { Users, IndianRupee, FileCheck, Clock, TrendingUp } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatINR, getCurrentMonthYear } from '../../utils/formatters';

export const MetricCards: React.FC = () => {
  const { employees, payrolls } = useData();
  const { month, year } = getCurrentMonthYear();

  // Current month payroll records
  const currentMonthPayrolls = payrolls.filter(
    (p) => p.month.toLowerCase() === month.toLowerCase() && Number(p.year) === Number(year)
  );

  const activeEmployees = employees.filter((e) => e.status === 'Active');
  const totalEmployeesCount = employees.length;
  const activeEmployeesCount = activeEmployees.length;

  const currentMonthGross = currentMonthPayrolls.reduce((sum, p) => sum + (p.gross_salary || 0), 0);
  const currentMonthNet = currentMonthPayrolls.reduce((sum, p) => sum + (p.net_salary || 0), 0);

  const generatedCount = currentMonthPayrolls.length;
  const pendingCount = Math.max(0, activeEmployeesCount - generatedCount);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {/* 1. Total Employees */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition duration-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Employees
          </span>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            {totalEmployeesCount}
          </span>
          <span className="text-xs font-semibold text-emerald-600">
            {activeEmployeesCount} Active
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-2">
          Across {new Set(employees.map((e) => e.department)).size} company departments
        </p>
      </div>

      {/* 2. Current Month Payroll (Gross) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition duration-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Current Gross Payroll
          </span>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <IndianRupee className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display truncate">
            {formatINR(currentMonthGross, false)}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-2 truncate">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Net Disbursal: {formatINR(currentMonthNet, false)}</span>
        </div>
      </div>

      {/* 3. Payslips Generated */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition duration-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Payslips Generated
          </span>
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <FileCheck className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            {generatedCount}
          </span>
          <span className="text-xs font-bold text-slate-400">
            / {activeEmployeesCount} ({Math.round(activeEmployeesCount ? (generatedCount / activeEmployeesCount) * 100 : 0)}%)
          </span>
        </div>
        {/* Progress bar */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-teal-500 h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(100, Math.round(activeEmployeesCount ? (generatedCount / activeEmployeesCount) * 100 : 0))}%`,
            }}
          />
        </div>
      </div>

      {/* 4. Pending Payslips */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition duration-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Pending Payslips
          </span>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            {pendingCount}
          </span>
          <span className="text-xs font-semibold text-amber-600">
            {pendingCount === 0 ? 'All Completed' : 'Requires Generation'}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-2">
          For month of {month} {year}
        </p>
      </div>
    </div>
  );
};
