import React from 'react';
import { Eye, Download, FileText, ArrowUpRight } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatINR } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import { PayrollRecord } from '../../types/payroll';

interface RecentPayslipsProps {
  onViewPayslip: (record: PayrollRecord) => void;
}

export const RecentPayslips: React.FC<RecentPayslipsProps> = ({ onViewPayslip }) => {
  const { payrolls, setActiveTab } = useData();

  // Show the most recent 6 payslips
  const recentList = [...payrolls]
    .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
    .slice(0, 6);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">Recent Payslips</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Latest salary statements generated for company staff
          </p>
        </div>
        <button
          onClick={() => setActiveTab('history')}
          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition group"
        >
          View All History
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>

      {/* Table / List View */}
      {recentList.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <FileText className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-700">No payslips generated yet</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Get started by selecting an employee and creating their monthly salary statement.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-slate-600 text-[11px] font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Period</th>
                <th className="py-3 px-4 text-right">Gross Salary</th>
                <th className="py-3 px-4 text-right">Deductions</th>
                <th className="py-3 px-4 text-right">Net Salary</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentList.map((record) => {
                const emp = record.employee;
                const empName = emp ? `${emp.first_name} ${emp.last_name}` : 'Unknown Employee';
                const empId = emp?.employee_id || record.employee_id;

                return (
                  <tr key={record.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Employee Info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-100">
                          {empName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-xs sm:text-sm">{empName}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{empId}</p>
                        </div>
                      </div>
                    </td>

                    {/* Period */}
                    <td className="py-3 px-4 font-medium text-slate-700 text-xs">
                      {record.month} {record.year}
                    </td>

                    {/* Gross */}
                    <td className="py-3 px-4 text-right font-medium text-slate-700 text-xs sm:text-sm">
                      {formatINR(record.gross_salary)}
                    </td>

                    {/* Deductions */}
                    <td className="py-3 px-4 text-right font-medium text-rose-600 text-xs sm:text-sm">
                      {record.total_deductions > 0 ? `-${formatINR(record.total_deductions)}` : '₹0.00'}
                    </td>

                    {/* Net Salary */}
                    <td className="py-3 px-4 text-right font-bold text-emerald-600 text-xs sm:text-sm">
                      {formatINR(record.net_salary)}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      <Badge
                        variant={
                          record.status === 'Paid'
                            ? 'success'
                            : record.status === 'Generated'
                            ? 'info'
                            : 'warning'
                        }
                      >
                        {record.status}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewPayslip(record)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                          title="View Payslip"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span className="hidden md:inline">View</span>
                        </button>
                        <button
                          onClick={() => onViewPayslip(record)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition"
                          title="Download PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span className="hidden md:inline">PDF</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
