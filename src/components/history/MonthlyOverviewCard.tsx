import React from 'react';
import { PayrollRecord } from '../../types/payroll';
import { formatINR } from '../../utils/formatters';
import { exportPayrollToExcel } from '../../utils/excelExporter';
import { Download, Users, FileSpreadsheet, IndianRupee, ShieldCheck } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface MonthlyOverviewCardProps {
  selectedMonth: string;
  selectedYear: number;
  filteredPayrolls: PayrollRecord[];
  allPayrolls: PayrollRecord[];
}

export const MonthlyOverviewCard: React.FC<MonthlyOverviewCardProps> = ({
  selectedMonth,
  selectedYear,
  filteredPayrolls,
  allPayrolls,
}) => {
  const { showToast } = useToast();

  const totalEmployees = filteredPayrolls.length;
  const totalGross = filteredPayrolls.reduce((sum, p) => sum + (p.gross_salary || 0), 0);
  const totalDeductions = filteredPayrolls.reduce((sum, p) => sum + (p.total_deductions || 0), 0);
  const totalNet = filteredPayrolls.reduce((sum, p) => sum + (p.net_salary || 0), 0);

  const handleExport = () => {
    if (filteredPayrolls.length === 0) {
      showToast('No records available for export in this view', 'warning');
      return;
    }
    exportPayrollToExcel(filteredPayrolls, selectedMonth, selectedYear);
    showToast(`Exported Payroll_Report_${selectedMonth}_${selectedYear}.xlsx`, 'success');
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 shadow-md relative overflow-hidden border border-slate-700/80">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        {/* Left summary title */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            Monthly Payroll Overview
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold font-display uppercase tracking-tight text-white">
            {selectedMonth} {selectedYear}
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Aggregated disbursement metrics and compliance export
          </p>
        </div>

        {/* Middle Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Employees
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-white">
              {totalEmployees}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Gross Payroll
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-slate-100">
              {formatINR(totalGross, false)}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-rose-400 block tracking-wider">
              Total Deductions
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-rose-300">
              {formatINR(totalDeductions, false)}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">
              Net Disbursal
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-emerald-400">
              {formatINR(totalNet, false)}
            </span>
          </div>
        </div>

        {/* Right Button: Export Payroll to Excel */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={handleExport}
            disabled={filteredPayrolls.length === 0}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export Payroll to Excel (.xlsx)
          </button>
        </div>
      </div>

      {/* Decorative ambient background */}
      <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};
