import React from 'react';
import { Employee } from '../../types/employee';
import { MONTHS, getAvailableYears, formatINR } from '../../utils/formatters';
import { User, Calendar, AlertCircle, CheckCircle2, UserCheck } from 'lucide-react';
import { Badge } from '../common/Badge';

interface StepEmployeeMonthProps {
  employees: Employee[];
  selectedEmployeeId: string;
  onSelectEmployee: (employee: Employee) => void;
  month: string;
  onChangeMonth: (month: string) => void;
  year: number;
  onChangeYear: (year: number) => void;
  existingPayrollId?: string | null;
  onLoadExistingPayroll?: () => void;
}

export const StepEmployeeMonth: React.FC<StepEmployeeMonthProps> = ({
  employees,
  selectedEmployeeId,
  onSelectEmployee,
  month,
  onChangeMonth,
  year,
  onChangeYear,
  existingPayrollId,
  onLoadExistingPayroll,
}) => {
  const selectedEmployee = employees.find((e) => e.id === selectedEmployeeId || e.employee_id === selectedEmployeeId);
  const years = getAvailableYears();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
          1
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Step 1 — Employee & Payroll Period</h3>
          <p className="text-xs text-slate-500">
            Select the staff member and salary cycle month/year
          </p>
        </div>
      </div>

      {/* Selectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Employee Dropdown */}
        <div className="md:col-span-1">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Select Employee <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <select
              value={selectedEmployeeId}
              onChange={(e) => {
                const found = employees.find(
                  (emp) => emp.id === e.target.value || emp.employee_id === e.target.value
                );
                if (found) onSelectEmployee(found);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50/50 hover:bg-white focus:bg-white text-slate-800"
            >
              <option value="" disabled>
                -- Choose Employee --
              </option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.employee_id}>
                  {emp.employee_id} — {emp.first_name} {emp.last_name} ({emp.department})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Month Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Payroll Month <span className="text-rose-500">*</span>
          </label>
          <select
            value={month}
            onChange={(e) => onChangeMonth(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50/50 hover:bg-white focus:bg-white text-slate-800"
          >
            {MONTHS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Year Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Payroll Year <span className="text-rose-500">*</span>
          </label>
          <select
            value={year}
            onChange={(e) => onChangeYear(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50/50 hover:bg-white focus:bg-white text-slate-800"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Existing record warning if found */}
      {existingPayrollId && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold">A payslip already exists for this employee for {month} {year}!</p>
              <p className="text-amber-700 mt-0.5">You can update the existing payslip or overwrite it with new calculations.</p>
            </div>
          </div>
          {onLoadExistingPayroll && (
            <button
              type="button"
              onClick={onLoadExistingPayroll}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition shrink-0"
            >
              Load Existing Data
            </button>
          )}
        </div>
      )}

      {/* Selected Employee Snapshot */}
      {selectedEmployee ? (
        <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white font-bold text-base flex items-center justify-center shadow-xs">
              {selectedEmployee.first_name.charAt(0)}
              {selectedEmployee.last_name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-900 text-sm">
                  {selectedEmployee.first_name} {selectedEmployee.last_name}
                </h4>
                <Badge variant={selectedEmployee.status === 'Active' ? 'success' : 'neutral'}>
                  {selectedEmployee.status}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {selectedEmployee.designation} • {selectedEmployee.department} ({selectedEmployee.employment_type})
              </p>
            </div>
          </div>

          <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-emerald-100 sm:pl-4 pt-2 sm:pt-0">
            <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
              Base Salary Default
            </span>
            <p className="text-sm font-extrabold text-slate-900">
              {formatINR(selectedEmployee.base_salary)}
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-500">
          Please choose an employee from the dropdown above to pre-fill their default salary details.
        </div>
      )}
    </div>
  );
};
