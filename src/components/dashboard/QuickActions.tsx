import React from 'react';
import { UserPlus, FileSpreadsheet, History, Download } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { exportPayrollToExcel } from '../../utils/excelExporter';
import { getCurrentMonthYear } from '../../utils/formatters';

interface QuickActionsProps {
  onOpenAddEmployee: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onOpenAddEmployee }) => {
  const { setActiveTab, payrolls } = useData();
  const { month, year } = getCurrentMonthYear();

  const handleExportMonth = () => {
    const currentMonthRecords = payrolls.filter(
      (p) => p.month.toLowerCase() === month.toLowerCase() && Number(p.year) === Number(year)
    );
    exportPayrollToExcel(currentMonthRecords.length ? currentMonthRecords : payrolls, month, year);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* 1. Add Employee */}
      <button
        onClick={onOpenAddEmployee}
        className="group relative flex items-center gap-4 p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:shadow-md hover:border-emerald-300 transition-all text-left cursor-pointer"
      >
        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition duration-200">
          <UserPlus className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition">
            Add Employee
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Register new employee and salary structure
          </p>
        </div>
      </button>

      {/* 2. Generate Payslip */}
      <button
        onClick={() => setActiveTab('generate-payslip')}
        className="group relative flex items-center gap-4 p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:shadow-md hover:border-emerald-300 transition-all text-left cursor-pointer"
      >
        <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition duration-200">
          <FileSpreadsheet className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition">
            Generate Payslip
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Calculate salary, attendance & generate PDF
          </p>
        </div>
      </button>

      {/* 3. View Payroll History */}
      <button
        onClick={() => setActiveTab('history')}
        className="group relative flex items-center gap-4 p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:shadow-md hover:border-emerald-300 transition-all text-left cursor-pointer"
      >
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition duration-200">
          <History className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition">
            View Payroll History
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Browse previous payrolls and export reports
          </p>
        </div>
      </button>
    </div>
  );
};
