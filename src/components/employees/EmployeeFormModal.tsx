import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Employee, CreateEmployeeInput, EmploymentType, EmployeeStatus } from '../../types/employee';
import { useData } from '../../context/DataContext';
import { User, Briefcase, IndianRupee, Shield, Check } from 'lucide-react';

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeToEdit?: Employee | null;
}

const DEPARTMENTS = [
  'Engineering',
  'Product',
  'Design',
  'Human Resources',
  'Finance',
  'Operations',
  'Marketing',
  'Sales',
  'Quality Assurance',
  'Legal & Admin',
];

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  isOpen,
  onClose,
  employeeToEdit,
}) => {
  const { createEmployee, updateEmployee } = useData();
  const [activeSection, setActiveSection] = useState<'personal' | 'employment' | 'payroll'>('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState<CreateEmployeeInput>({
    employee_id: '',
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
    dob: '',
    joining_date: new Date().toISOString().split('T')[0],
    address: '',
    designation: '',
    department: 'Engineering',
    employment_type: 'Full Time',
    status: 'Active',
    base_salary: 0,
    default_hra: 0,
    default_other_allowance: 0,
    default_bus_pass: 0,
    pf_applicable: false,
    esi_applicable: false,
    professional_tax_applicable: false,
  });

  useEffect(() => {
    if (employeeToEdit) {
      setFormData({
        employee_id: employeeToEdit.employee_id,
        first_name: employeeToEdit.first_name,
        last_name: employeeToEdit.last_name,
        email: employeeToEdit.email,
        mobile: employeeToEdit.mobile,
        dob: employeeToEdit.dob || '',
        joining_date: employeeToEdit.joining_date || new Date().toISOString().split('T')[0],
        address: employeeToEdit.address || '',
        designation: employeeToEdit.designation,
        department: employeeToEdit.department,
        employment_type: employeeToEdit.employment_type,
        status: employeeToEdit.status,
        base_salary: employeeToEdit.base_salary || 0,
        default_hra: employeeToEdit.default_hra || 0,
        default_other_allowance: employeeToEdit.default_other_allowance || 0,
        default_bus_pass: employeeToEdit.default_bus_pass || 0,
        pf_applicable: Boolean(employeeToEdit.pf_applicable),
        esi_applicable: Boolean(employeeToEdit.esi_applicable),
        professional_tax_applicable: Boolean(employeeToEdit.professional_tax_applicable),
      });
    } else {
      // Auto-suggest next EMP ID
      const autoId = 'EMP' + String(Math.floor(100 + Math.random() * 900));
      setFormData({
        employee_id: autoId,
        first_name: '',
        last_name: '',
        email: '',
        mobile: '',
        dob: '',
        joining_date: new Date().toISOString().split('T')[0],
        address: '',
        designation: '',
        department: 'Engineering',
        employment_type: 'Full Time',
        status: 'Active',
        base_salary: 0,
        default_hra: 0,
        default_other_allowance: 0,
        default_bus_pass: 0,
        pf_applicable: false,
        esi_applicable: false,
        professional_tax_applicable: false,
      });
    }
    setFormError(null);
    setActiveSection('personal');
  }, [employeeToEdit, isOpen]);

  const handleChange = (field: keyof CreateEmployeeInput, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!formData.employee_id.trim()) {
      setFormError('Employee ID is required.');
      setActiveSection('personal');
      return;
    }
    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      setFormError('First and Last names are required.');
      setActiveSection('personal');
      return;
    }
    if (!formData.email.trim()) {
      setFormError('Valid Email is required.');
      setActiveSection('personal');
      return;
    }
    if (!formData.designation.trim()) {
      setFormError('Designation is required.');
      setActiveSection('employment');
      return;
    }
    if (Number(formData.base_salary) < 0) {
      setFormError('Base Salary cannot be negative.');
      setActiveSection('payroll');
      return;
    }

    setIsSubmitting(true);
    try {
      if (employeeToEdit) {
        await updateEmployee(employeeToEdit.id, formData);
      } else {
        await createEmployee(formData);
      }
      onClose();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save employee.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={employeeToEdit ? `Edit Employee: ${employeeToEdit.first_name} ${employeeToEdit.last_name}` : 'Add New Employee'}
      subtitle="Configure personal, employment, and monthly salary defaults"
      maxWidth="3xl"
    >
      {formError && (
        <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
          {formError}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6 gap-2">
        <button
          type="button"
          onClick={() => setActiveSection('personal')}
          className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold transition border-b-2 ${
            activeSection === 'personal'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <User className="w-4 h-4" />
          1. Personal Information
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('employment')}
          className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold transition border-b-2 ${
            activeSection === 'employment'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          2. Employment Details
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('payroll')}
          className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold transition border-b-2 ${
            activeSection === 'payroll'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <IndianRupee className="w-4 h-4" />
          3. Payroll Defaults
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Section 1: Personal Information */}
        {activeSection === 'personal' && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Employee ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.employee_id}
                  onChange={(e) => handleChange('employee_id', e.target.value.toUpperCase())}
                  placeholder="e.g. EMP001"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  First Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={(e) => handleChange('first_name', e.target.value)}
                  placeholder="e.g. Aarav"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Last Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={(e) => handleChange('last_name', e.target.value)}
                  placeholder="e.g. Sharma"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Work Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="aarav.sharma@company.com"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.mobile}
                  onChange={(e) => handleChange('mobile', e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Date of Birth <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleChange('dob', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Date of Joining <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.joining_date}
                  onChange={(e) => handleChange('joining_date', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Residential Address
              </label>
              <textarea
                rows={2}
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="House/Flat No, Street, City, State, PIN"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Section 2: Employment Details */}
        {activeSection === 'employment' && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Designation / Role <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.designation}
                  onChange={(e) => handleChange('designation', e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Department <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Employment Type
                </label>
                <select
                  value={formData.employment_type}
                  onChange={(e) => handleChange('employment_type', e.target.value as EmploymentType)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Employee Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value as EmployeeStatus)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Payroll Defaults */}
        {activeSection === 'payroll' && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs text-emerald-800">
              These default values will automatically populate whenever you generate monthly payslips for this employee.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Base Monthly Salary (₹) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  required
                  value={formData.base_salary}
                  onChange={(e) => handleChange('base_salary', Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Default HRA (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={formData.default_hra}
                  onChange={(e) => handleChange('default_hra', Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Default Other Allowance (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={formData.default_other_allowance}
                  onChange={(e) => handleChange('default_other_allowance', Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Default Bus Pass Allowance (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={formData.default_bus_pass}
                  onChange={(e) => handleChange('default_bus_pass', Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Statutory Applicability Toggles */}
            <div className="pt-3 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Statutory Deductions Applicable
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={formData.pf_applicable}
                    onChange={(e) => handleChange('pf_applicable', e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Provident Fund (PF)</p>
                    <p className="text-[10px] text-slate-500">Enable PF deduction</p>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={formData.esi_applicable}
                    onChange={(e) => handleChange('esi_applicable', e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-800">ESI Scheme</p>
                    <p className="text-[10px] text-slate-500">For gross ≤ ₹21k</p>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={formData.professional_tax_applicable}
                    onChange={(e) => handleChange('professional_tax_applicable', e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Professional Tax (PT)</p>
                    <p className="text-[10px] text-slate-500">State PT deduction</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div>
            {activeSection !== 'personal' && (
              <button
                type="button"
                onClick={() =>
                  setActiveSection(activeSection === 'payroll' ? 'employment' : 'personal')
                }
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
              >
                Back
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>

            {activeSection !== 'payroll' ? (
              <button
                type="button"
                onClick={() =>
                  setActiveSection(activeSection === 'personal' ? 'employment' : 'payroll')
                }
                className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition"
              >
                Continue Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs shadow-emerald-600/20 transition flex items-center gap-1.5 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                {isSubmitting
                  ? 'Saving...'
                  : employeeToEdit
                  ? 'Update Employee'
                  : 'Save & Register Employee'}
              </button>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
};
