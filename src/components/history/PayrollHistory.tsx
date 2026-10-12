import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { PayrollRecord } from '../../types/payroll';
import { formatINR, formatDate, MONTHS, getAvailableYears, getCurrentMonthYear } from '../../utils/formatters';
import { MonthlyOverviewCard } from './MonthlyOverviewCard';
import { Badge } from '../common/Badge';
import {
  Search,
  Filter,
  Eye,
  Download,
  Edit2,
  Trash2,
  FileSpreadsheet,
  Calendar,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { generatePayslipPDF } from '../../utils/pdfGenerator';
import { useToast } from '../../context/ToastContext';

interface PayrollHistoryProps {
  onViewPayslip: (record: PayrollRecord) => void;
}

export const PayrollHistory: React.FC<PayrollHistoryProps> = ({ onViewPayslip }) => {
  const { payrolls, employees, deletePayroll, setEditingPayroll, setActiveTab } = useData();
  const { showToast } = useToast();
  const { month: currMonth, year: currYear } = getCurrentMonthYear();

  // Filter States
  const [selectedMonth, setSelectedMonth] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<number | string>(currYear);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Delete State
  const [recordToDelete, setRecordToDelete] = useState<PayrollRecord | null>(null);

  // Departments List
  const departments = ['All', ...Array.from(new Set(employees.map((e) => e.department)))];
  const years = ['All', ...getAvailableYears()];

  // Filter logic
  const filteredRecords = useMemo(() => {
    return payrolls.filter((record) => {
      const emp = record.employee;
      const empName = emp ? `${emp.first_name} ${emp.last_name}`.toLowerCase() : '';
      const empId = (emp?.employee_id || record.employee_id).toLowerCase();
      const query = searchQuery.toLowerCase().trim();

      const matchesSearch = !query || empName.includes(query) || empId.includes(query);
      const matchesMonth = selectedMonth === 'All' || record.month.toLowerCase() === selectedMonth.toLowerCase();
      const matchesYear = selectedYear === 'All' || Number(record.year) === Number(selectedYear);
      const matchesDept = selectedDepartment === 'All' || emp?.department === selectedDepartment;

      return matchesSearch && matchesMonth && matchesYear && matchesDept;
    });
  }, [payrolls, searchQuery, selectedMonth, selectedYear, selectedDepartment]);

  // Paginated records
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRecords.slice(start, start + itemsPerPage);
  }, [filteredRecords, currentPage, itemsPerPage]);

  const handleEditRecord = (record: PayrollRecord) => {
    setEditingPayroll(record);
    setActiveTab('generate-payslip');
  };

  const confirmDelete = async () => {
    if (recordToDelete) {
      await deletePayroll(recordToDelete.id);
      setRecordToDelete(null);
    }
  };

  const handleQuickDownload = async (record: PayrollRecord) => {
    onViewPayslip(record);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
            Payroll History & Records
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Search, review, re-generate, or export past company payroll disbursements
          </p>
        </div>

        <button
          onClick={() => setActiveTab('generate-payslip')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-xs shadow-emerald-600/20"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Generate New Payslip
        </button>
      </div>

      {/* Monthly Overview Summary Card */}
      <MonthlyOverviewCard
        selectedMonth={selectedMonth === 'All' ? currMonth : selectedMonth}
        selectedYear={selectedYear === 'All' ? currYear : Number(selectedYear)}
        filteredPayrolls={filteredRecords}
        allPayrolls={payrolls}
      />

      {/* Filters Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by employee name or ID..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 hover:bg-white focus:bg-white transition"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Month */}
          <select
            value={selectedMonth}
            onChange={(e) => {
              setSelectedMonth(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700"
          >
            <option value="All">All Months</option>
            {MONTHS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          {/* Year */}
          <select
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y === 'All' ? 'All Years' : y}
              </option>
            ))}
          </select>

          {/* Department */}
          <select
            value={selectedDepartment}
            onChange={(e) => {
              setSelectedDepartment(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d === 'All' ? 'All Departments' : d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table & Pagination Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredRecords.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">No payroll records match your filters</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Try resetting the month/year filter or search query.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 text-[11px] font-bold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-4">Employee</th>
                    <th className="py-3.5 px-4">Employee ID</th>
                    <th className="py-3.5 px-4">Month / Year</th>
                    <th className="py-3.5 px-4 text-right">Gross Salary</th>
                    <th className="py-3.5 px-4 text-right">Total Deductions</th>
                    <th className="py-3.5 px-4 text-right">Net Salary</th>
                    <th className="py-3.5 px-4">Generated Date</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedRecords.map((record) => {
                    const emp = record.employee;
                    const empName = emp ? `${emp.first_name} ${emp.last_name}` : 'Unknown';
                    const empId = emp?.employee_id || record.employee_id;

                    return (
                      <tr key={record.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Employee Name */}
                        <td className="py-3.5 px-4 font-bold text-slate-900 text-xs sm:text-sm">
                          {empName}
                          <span className="block text-[11px] text-slate-400 font-normal">
                            {emp?.designation || '-'}
                          </span>
                        </td>

                        {/* Employee ID */}
                        <td className="py-3.5 px-4 font-mono font-bold text-xs text-slate-600">
                          {empId}
                        </td>

                        {/* Month / Year */}
                        <td className="py-3.5 px-4 font-semibold text-slate-700 text-xs">
                          {record.month} {record.year}
                        </td>

                        {/* Gross */}
                        <td className="py-3.5 px-4 text-right font-medium text-slate-800 text-xs sm:text-sm">
                          {formatINR(record.gross_salary)}
                        </td>

                        {/* Deductions */}
                        <td className="py-3.5 px-4 text-right font-medium text-rose-600 text-xs sm:text-sm">
                          {record.total_deductions > 0 ? `-${formatINR(record.total_deductions)}` : '₹0.00'}
                        </td>

                        {/* Net */}
                        <td className="py-3.5 px-4 text-right font-extrabold text-emerald-600 text-xs sm:text-sm">
                          {formatINR(record.net_salary)}
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-4 text-xs text-slate-500">
                          {formatDate(record.created_at)}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 text-center">
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
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onViewPayslip(record)}
                              className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                              title="View Payslip Preview"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => onViewPayslip(record)}
                              className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition"
                              title="Download PDF"
                            >
                              <Download className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleEditRecord(record)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Edit Salary Record"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setRecordToDelete(record)}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="md:hidden divide-y divide-slate-100">
              {paginatedRecords.map((record) => {
                const emp = record.employee;
                const empName = emp ? `${emp.first_name} ${emp.last_name}` : 'Unknown';
                const empId = emp?.employee_id || record.employee_id;

                return (
                  <div key={record.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{empName}</h4>
                        <p className="text-[11px] font-mono text-slate-400">
                          {empId} • {record.month} {record.year}
                        </p>
                      </div>
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
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Gross Salary</span>
                        <span className="font-semibold text-slate-800">
                          {formatINR(record.gross_salary)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Net Take-Home</span>
                        <span className="font-bold text-emerald-700">
                          {formatINR(record.net_salary)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-400">
                        {formatDate(record.created_at)}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onViewPayslip(record)}
                          className="px-2.5 py-1 text-xs font-bold text-slate-700 bg-slate-100 rounded-lg"
                        >
                          View PDF
                        </button>
                        <button
                          onClick={() => handleEditRecord(record)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setRecordToDelete(record)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, filteredRecords.length)} of{' '}
                  {filteredRecords.length} records
                </span>

                <div className="flex items-center gap-1">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-1 font-semibold text-slate-800">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Record Confirmation Dialog */}
      {recordToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 text-center animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Delete Payroll Record?</h3>
            <p className="text-xs text-slate-500 mt-1">
              Are you sure you want to delete payslip for{' '}
              <strong className="text-slate-800">
                {recordToDelete.employee ? `${recordToDelete.employee.first_name} ${recordToDelete.employee.last_name}` : recordToDelete.employee_id} ({recordToDelete.month} {recordToDelete.year})
              </strong>
              ?
            </p>

            <div className="flex items-center gap-2 mt-5">
              <button
                onClick={() => setRecordToDelete(null)}
                className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs shadow-rose-600/20 transition"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
