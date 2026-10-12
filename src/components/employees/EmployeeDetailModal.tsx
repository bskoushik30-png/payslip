import React from 'react';
import { Modal } from '../common/Modal';
import { Employee } from '../../types/employee';
import { formatINR, formatDate } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import {
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  Building2,
  IndianRupee,
  FileSpreadsheet,
  Edit2,
} from 'lucide-react';
import { useData } from '../../context/DataContext';

interface EmployeeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onEdit: (employee: Employee) => void;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  isOpen,
  onClose,
  employee,
  onEdit,
}) => {
  const { setActiveTab, setSelectedEmployeeForPayroll } = useData();

  if (!employee) return null;

  const handleGeneratePayslip = () => {
    setSelectedEmployeeForPayroll(employee);
    setActiveTab('generate-payslip');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${employee.first_name} ${employee.last_name}`}
      subtitle={`Employee ID: ${employee.employee_id}`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Header Profile Summary */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/80 gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md shadow-emerald-600/20">
              {employee.first_name.charAt(0)}
              {employee.last_name.charAt(0)}
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">
                {employee.first_name} {employee.last_name}
              </h4>
              <p className="text-xs text-slate-500 font-medium">{employee.designation}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <Badge variant={employee.status === 'Active' ? 'success' : 'neutral'}>
                  {employee.status}
                </Badge>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-600">
                  {employee.department}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500">{employee.employment_type}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onEdit(employee);
              }}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit
            </button>
            <button
              onClick={handleGeneratePayslip}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition shadow-xs shadow-emerald-600/20"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Generate Payslip
            </button>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Contact Details */}
          <div className="p-4 rounded-xl border border-slate-100 bg-white space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Contact & Personal
            </h5>

            <div className="flex items-center gap-2.5 text-xs text-slate-700">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate">{employee.email}</span>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-slate-700">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{employee.mobile}</span>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-slate-700">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                Joined on: <strong className="text-slate-800">{formatDate(employee.joining_date)}</strong>
              </span>
            </div>

            {employee.dob && (
              <div className="flex items-center gap-2.5 text-xs text-slate-700">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span>DOB: {formatDate(employee.dob)}</span>
              </div>
            )}

            {employee.address && (
              <div className="flex items-start gap-2.5 text-xs text-slate-700 pt-1">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{employee.address}</span>
              </div>
            )}
          </div>

          {/* Salary Structure Defaults */}
          <div className="p-4 rounded-xl border border-slate-100 bg-white space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Salary Configuration
            </h5>

            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-50">
              <span className="text-slate-500">Base Monthly Salary:</span>
              <span className="font-bold text-slate-900">{formatINR(employee.base_salary)}</span>
            </div>

            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-50">
              <span className="text-slate-500">Default HRA (House Rent):</span>
              <span className="font-semibold text-slate-800">{formatINR(employee.default_hra)}</span>
            </div>

            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-50">
              <span className="text-slate-500">Other Allowances:</span>
              <span className="font-semibold text-slate-800">{formatINR(employee.default_other_allowance)}</span>
            </div>

            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-50">
              <span className="text-slate-500">Bus Pass Allowance:</span>
              <span className="font-semibold text-slate-800">{formatINR(employee.default_bus_pass)}</span>
            </div>

            <div className="pt-2 flex flex-wrap gap-2 text-[11px]">
              <span className={`px-2 py-0.5 rounded-md font-medium ${employee.pf_applicable ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-400'}`}>
                PF: {employee.pf_applicable ? 'Enabled' : 'Disabled'}
              </span>
              <span className={`px-2 py-0.5 rounded-md font-medium ${employee.esi_applicable ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-400'}`}>
                ESI: {employee.esi_applicable ? 'Enabled' : 'Disabled'}
              </span>
              <span className={`px-2 py-0.5 rounded-md font-medium ${employee.professional_tax_applicable ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-400'}`}>
                PT: {employee.professional_tax_applicable ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
          >
            Close Details
          </button>
        </div>
      </div>
    </Modal>
  );
};
