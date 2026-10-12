import React, { useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  Eye,
  Edit2,
  Trash2,
  FileSpreadsheet,
  Building,
  UserCheck,
  AlertCircle,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Employee } from '../../types/employee';
import { formatINR, formatDate } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import { EmployeeFormModal } from './EmployeeFormModal';
import { EmployeeDetailModal } from './EmployeeDetailModal';

interface EmployeeListProps {
  isAddModalOpenFromParent?: boolean;
  onCloseAddModalFromParent?: () => void;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({
  isAddModalOpenFromParent,
  onCloseAddModalFromParent,
}) => {
  const {
    employees,
    deleteEmployee,
    setSelectedEmployeeForPayroll,
    setActiveTab,
  } = useData();

  // Local modal states
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Combined modal open state
  const isModalOpen = isAddEditOpen || Boolean(isAddModalOpenFromParent);

  const handleCloseModal = () => {
    setIsAddEditOpen(false);
    setEditingEmployee(null);
    if (onCloseAddModalFromParent) onCloseAddModalFromParent();
  };

  const handleOpenAdd = () => {
    setEditingEmployee(null);
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setIsAddEditOpen(true);
  };

  const handleGeneratePayslip = (emp: Employee) => {
    setSelectedEmployeeForPayroll(emp);
    setActiveTab('generate-payslip');
  };

  const confirmDelete = async () => {
    if (employeeToDelete) {
      await deleteEmployee(employeeToDelete.id);
      setEmployeeToDelete(null);
    }
  };

  const departments = ['All', ...Array.from(new Set(employees.map((e) => e.department)))];

  // Filtering
  const filteredEmployees = employees.filter((emp) => {
    const fullName = `${emp.first_name} ${emp.last_name}`.toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      fullName.includes(query) ||
      emp.employee_id.toLowerCase().includes(query) ||
      emp.email.toLowerCase().includes(query) ||
      emp.designation.toLowerCase().includes(query);

    const matchesDept = departmentFilter === 'All' || emp.department === departmentFilter;
    const matchesStatus = statusFilter === 'All' || emp.status === statusFilter;

    return matchesQuery && matchesDept && matchesStatus;
  });

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
            Employee Directory
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage company workforce records, departments, and payroll configurations ({employees.length} total)
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs shadow-emerald-600/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Employee
        </button>
      </div>

      {/* Search & Filters */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, employee ID, designation, or email..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 hover:bg-white focus:bg-white transition"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="w-1/2 md:w-44">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === 'All' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
          </div>

          <div className="w-1/2 md:w-36">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Employees Table (Desktop) & Cards (Mobile) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredEmployees.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <UserCheck className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">No employees found</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {searchQuery || departmentFilter !== 'All' || statusFilter !== 'All'
                ? 'Try adjusting your search criteria or clear active filters.'
                : 'No employees have been registered yet. Click "Add Employee" to create one.'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 text-[11px] font-bold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-4">Employee ID</th>
                    <th className="py-3.5 px-4">Employee Name</th>
                    <th className="py-3.5 px-4">Designation</th>
                    <th className="py-3.5 px-4">Department</th>
                    <th className="py-3.5 px-4">Joining Date</th>
                    <th className="py-3.5 px-4 text-right">Base Salary</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-xs text-slate-600">
                        {emp.employee_id}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-100">
                            {emp.first_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-xs sm:text-sm">
                              {emp.first_name} {emp.last_name}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate max-w-xs">{emp.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-700 text-xs font-medium">
                        {emp.designation}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 text-xs">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 font-medium">
                          {emp.department}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 text-xs">
                        {formatDate(emp.joining_date)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-bold text-slate-900 text-xs sm:text-sm">
                        {formatINR(emp.base_salary)}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <Badge variant={emp.status === 'Active' ? 'success' : 'neutral'}>
                          {emp.status}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Generate Payslip Shortcut */}
                          <button
                            onClick={() => handleGeneratePayslip(emp)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                            title="Generate Payslip"
                          >
                            <FileSpreadsheet className="w-4 h-4" />
                          </button>

                          {/* View Details */}
                          <button
                            onClick={() => setViewingEmployee(emp)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                            title="View Employee Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => handleOpenEdit(emp)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Edit Employee"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setEmployeeToDelete(emp)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                            title="Delete Employee"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredEmployees.map((emp) => (
                <div key={emp.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-sm flex items-center justify-center shrink-0 border border-emerald-100">
                        {emp.first_name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">
                          {emp.first_name} {emp.last_name}
                        </h4>
                        <span className="text-[11px] font-mono text-slate-400 font-semibold">
                          {emp.employee_id}
                        </span>
                      </div>
                    </div>
                    <Badge variant={emp.status === 'Active' ? 'success' : 'neutral'}>
                      {emp.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Department</span>
                      <span className="font-semibold text-slate-800">{emp.department}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Base Salary</span>
                      <span className="font-bold text-emerald-700">{formatINR(emp.base_salary)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => handleGeneratePayslip(emp)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      Payslip
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setViewingEmployee(emp)}
                        className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(emp)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEmployeeToDelete(emp)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Add / Edit Modal */}
      <EmployeeFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        employeeToEdit={editingEmployee}
      />

      {/* View Detail Modal */}
      <EmployeeDetailModal
        isOpen={!!viewingEmployee}
        onClose={() => setViewingEmployee(null)}
        employee={viewingEmployee}
        onEdit={(emp) => handleOpenEdit(emp)}
      />

      {/* Delete Confirmation Dialog */}
      {employeeToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 text-center animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Delete Employee?</h3>
            <p className="text-xs text-slate-500 mt-1">
              Are you sure you want to remove{' '}
              <strong className="text-slate-800">
                {employeeToDelete.first_name} {employeeToDelete.last_name} ({employeeToDelete.employee_id})
              </strong>
              ? This action cannot be undone.
            </p>

            <div className="flex items-center gap-2 mt-5">
              <button
                onClick={() => setEmployeeToDelete(null)}
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
