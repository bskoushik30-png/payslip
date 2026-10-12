import React from 'react';
import { MetricCards } from './MetricCards';
import { QuickActions } from './QuickActions';
import { RecentPayslips } from './RecentPayslips';
import { useData } from '../../context/DataContext';
import { getCurrentMonthYear } from '../../utils/formatters';
import { PayrollRecord } from '../../types/payroll';

interface DashboardProps {
  onOpenAddEmployee: () => void;
  onViewPayslip: (record: PayrollRecord) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onOpenAddEmployee,
  onViewPayslip,
}) => {
  const { companySettings } = useData();
  const { month, year } = getCurrentMonthYear();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <span className="inline-block px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full mb-2">
            HR & Payroll Dashboard
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-display">
            Welcome, Payroll Administrator
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Managing salaries, loss of pay deductions, and PDF payslips for{' '}
            <span className="font-semibold text-white">{companySettings.company_name}</span>.
          </p>
        </div>
        <div className="relative z-10 text-right sm:border-l sm:border-slate-700/60 sm:pl-6">
          <p className="text-xs text-slate-400 font-medium">Active Cycle</p>
          <p className="text-base sm:text-lg font-extrabold text-emerald-400">
            {month} {year}
          </p>
        </div>
        {/* Subtle decorative glow */}
        <div className="absolute right-0 top-0 w-80 h-full bg-emerald-500/10 blur-2xl pointer-events-none" />
      </div>

      {/* Metric Summary Cards */}
      <MetricCards />

      {/* Quick Actions */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Quick Workflows
        </h3>
        <QuickActions onOpenAddEmployee={onOpenAddEmployee} />
      </div>

      {/* Recent Payslips */}
      <RecentPayslips onViewPayslip={onViewPayslip} />
    </div>
  );
};
