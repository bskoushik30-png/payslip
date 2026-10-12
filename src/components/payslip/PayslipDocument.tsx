import React from 'react';
import { PayrollRecord } from '../../types/payroll';
import { CompanySettings } from '../../types/company';
import { formatINR, formatDate } from '../../utils/formatters';
import { Building2, ShieldCheck } from 'lucide-react';

interface PayslipDocumentProps {
  payroll: PayrollRecord;
  company: CompanySettings;
  elementId?: string;
}

export const PayslipDocument: React.FC<PayslipDocumentProps> = ({
  payroll,
  company,
  elementId = 'payslip-print-container',
}) => {
  const emp = payroll.employee;
  const empName = emp ? `${emp.first_name} ${emp.last_name}` : 'Employee Name';
  const empId = emp?.employee_id || payroll.employee_id;

  return (
    <div
      id={elementId}
      className="payslip-page bg-white text-slate-900 p-6 sm:p-8 max-w-4xl mx-auto border border-slate-200 rounded-xl shadow-lg print:shadow-none print:border-none print:m-0 print:p-2 print:max-w-none"
      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      {/* 1. Header: Company Branding & Details */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b-2 border-slate-900 gap-4">
        <div className="flex items-center gap-4">
          {company.logo_url ? (
            <img
              src={company.logo_url}
              alt={company.company_name}
              className="h-16 sm:h-20 w-auto max-w-[180px] object-contain shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl shrink-0">
              <Building2 className="w-8 h-8 text-emerald-400" />
            </div>
          )}

          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-950 uppercase tracking-tight font-display">
              {company.company_name || 'Apex Zenith Technologies Pvt. Ltd.'}
            </h1>
            <p className="text-xs text-slate-600 max-w-md leading-relaxed mt-0.5">
              {company.address}, {company.city}, {company.state} - {company.pincode}
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-500 mt-1">
              <span>Phone: {company.phone}</span>
              <span>•</span>
              <span>Email: {company.email}</span>
              {company.website && (
                <>
                  <span>•</span>
                  <span>{company.website}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* GST / PAN info */}
        {(company.gst_number || company.pan_number) && (
          <div className="text-left sm:text-right text-[11px] text-slate-600 space-y-0.5 shrink-0 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            {company.gst_number && (
              <div>
                <span className="font-semibold text-slate-700">GSTIN:</span>{' '}
                <span className="font-mono font-medium">{company.gst_number}</span>
              </div>
            )}
            {company.pan_number && (
              <div>
                <span className="font-semibold text-slate-700">PAN:</span>{' '}
                <span className="font-mono font-medium">{company.pan_number}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Document Title Banner */}
      <div className="my-5 bg-slate-900 text-white py-2.5 px-4 rounded-lg flex items-center justify-between">
        <div className="text-xs sm:text-sm font-bold tracking-wider uppercase">
          Payslip for the month of {payroll.month} {payroll.year}
        </div>
        <div className="text-xs font-semibold text-emerald-400">
          Status: {payroll.status}
        </div>
      </div>

      {/* 3. Employee Metadata Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs mb-5">
        <div>
          <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">
            Employee Name
          </span>
          <span className="font-bold text-slate-900 text-sm">{empName}</span>
        </div>

        <div>
          <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">
            Employee ID
          </span>
          <span className="font-mono font-bold text-slate-900 text-sm">{empId}</span>
        </div>

        <div>
          <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">
            Designation
          </span>
          <span className="font-medium text-slate-800">{emp?.designation || '-'}</span>
        </div>

        <div>
          <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">
            Department
          </span>
          <span className="font-medium text-slate-800">{emp?.department || '-'}</span>
        </div>

        <div>
          <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">
            Date of Joining
          </span>
          <span className="font-medium text-slate-800">{formatDate(emp?.joining_date)}</span>
        </div>

        <div>
          <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">
            Employment Type
          </span>
          <span className="font-medium text-slate-800">{emp?.employment_type || 'Full Time'}</span>
        </div>

        <div>
          <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">
            Mobile
          </span>
          <span className="font-medium text-slate-800">{emp?.mobile || '-'}</span>
        </div>

        <div>
          <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">
            Generated Date
          </span>
          <span className="font-medium text-slate-800">
            {formatDate(payroll.created_at || new Date().toISOString())}
          </span>
        </div>
      </div>

      {/* 4. Attendance Summary Bar */}
      <div className="mb-5 border border-slate-200 rounded-xl overflow-hidden">
        <div className="bg-slate-100 px-4 py-2 border-b border-slate-200">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
            Attendance Summary
          </h3>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 divide-x divide-y sm:divide-y-0 divide-slate-200 text-center text-xs bg-white">
          <div className="p-2.5">
            <span className="text-[10px] text-slate-500 block font-medium">Working Days</span>
            <span className="font-bold text-slate-900 text-sm">{payroll.working_days}</span>
          </div>
          <div className="p-2.5">
            <span className="text-[10px] text-slate-500 block font-medium">Present Days</span>
            <span className="font-bold text-slate-900 text-sm">{payroll.present_days}</span>
          </div>
          <div className="p-2.5">
            <span className="text-[10px] text-slate-500 block font-medium">Paid Leaves</span>
            <span className="font-bold text-slate-900 text-sm">{payroll.paid_leave}</span>
          </div>
          <div className="p-2.5">
            <span className="text-[10px] text-rose-600 block font-medium">Unpaid Leave (LOP)</span>
            <span className="font-bold text-rose-600 text-sm">{payroll.unpaid_leave}</span>
          </div>
          <div className="p-2.5">
            <span className="text-[10px] text-slate-500 block font-medium">Holidays</span>
            <span className="font-bold text-slate-900 text-sm">{payroll.holidays || 0}</span>
          </div>
          <div className="p-2.5 bg-emerald-50/50">
            <span className="text-[10px] text-emerald-800 block font-bold">Payable Days</span>
            <span className="font-black text-emerald-700 text-sm">{payroll.payable_days}</span>
          </div>
        </div>
      </div>

      {/* 5. Earnings & Deductions Tables Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {/* Earnings Column */}
        <div className="border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between">
          <div>
            <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-800">
                Earnings
              </h3>
              <span className="text-[11px] font-bold text-slate-500">Amount (₹)</span>
            </div>

            <table className="w-full text-xs">
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2 px-4 text-slate-700">Basic Salary</td>
                  <td className="py-2 px-4 text-right font-medium text-slate-900">
                    {formatINR(payroll.base_salary)}
                  </td>
                </tr>

                {payroll.loss_of_pay > 0 && (
                  <tr className="bg-rose-50/40 text-rose-700">
                    <td className="py-2 px-4">
                      Less: Loss of Pay ({payroll.unpaid_leave} days)
                    </td>
                    <td className="py-2 px-4 text-right font-medium">
                      -{formatINR(payroll.loss_of_pay)}
                    </td>
                  </tr>
                )}

                {payroll.loss_of_pay > 0 && (
                  <tr className="font-semibold text-slate-800 bg-slate-50/60">
                    <td className="py-2 px-4">Adjusted Basic Salary</td>
                    <td className="py-2 px-4 text-right">
                      {formatINR(payroll.adjusted_base_salary)}
                    </td>
                  </tr>
                )}

                {payroll.hra > 0 && (
                  <tr>
                    <td className="py-2 px-4 text-slate-700">House Rent Allowance (HRA)</td>
                    <td className="py-2 px-4 text-right font-medium text-slate-900">
                      {formatINR(payroll.hra)}
                    </td>
                  </tr>
                )}

                {payroll.bus_pass_enabled && payroll.bus_pass > 0 && (
                  <tr>
                    <td className="py-2 px-4 text-slate-700">Bus Pass Allowance</td>
                    <td className="py-2 px-4 text-right font-medium text-slate-900">
                      {formatINR(payroll.bus_pass)}
                    </td>
                  </tr>
                )}

                {payroll.other_allowance > 0 && (
                  <tr>
                    <td className="py-2 px-4 text-slate-700">Other Allowance</td>
                    <td className="py-2 px-4 text-right font-medium text-slate-900">
                      {formatINR(payroll.other_allowance)}
                    </td>
                  </tr>
                )}

                {payroll.travel_allowance > 0 && (
                  <tr>
                    <td className="py-2 px-4 text-slate-700">Travel / Conveyance Allowance</td>
                    <td className="py-2 px-4 text-right font-medium text-slate-900">
                      {formatINR(payroll.travel_allowance)}
                    </td>
                  </tr>
                )}

                {payroll.bonus > 0 && (
                  <tr>
                    <td className="py-2 px-4 text-slate-700">Bonus / Incentive</td>
                    <td className="py-2 px-4 text-right font-medium text-slate-900">
                      {formatINR(payroll.bonus)}
                    </td>
                  </tr>
                )}

                {payroll.overtime > 0 && (
                  <tr>
                    <td className="py-2 px-4 text-slate-700">Overtime Pay</td>
                    <td className="py-2 px-4 text-right font-medium text-slate-900">
                      {formatINR(payroll.overtime)}
                    </td>
                  </tr>
                )}

                {payroll.other_earnings > 0 && (
                  <tr>
                    <td className="py-2 px-4 text-slate-700">Other Earnings</td>
                    <td className="py-2 px-4 text-right font-medium text-slate-900">
                      {formatINR(payroll.other_earnings)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-100/90 px-4 py-2.5 border-t border-slate-200 flex justify-between items-center font-bold text-xs text-slate-900">
            <span>Total Gross Earnings</span>
            <span className="text-sm font-extrabold">{formatINR(payroll.gross_salary)}</span>
          </div>
        </div>

        {/* Deductions Column */}
        <div className="border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between">
          <div>
            <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-800">
                Deductions
              </h3>
              <span className="text-[11px] font-bold text-slate-500">Amount (₹)</span>
            </div>

            <table className="w-full text-xs">
              <tbody className="divide-y divide-slate-100">
                {payroll.pf_enabled && (
                  <tr>
                    <td className="py-2 px-4 text-slate-700">Provident Fund (PF)</td>
                    <td className="py-2 px-4 text-right font-medium text-slate-900">
                      {formatINR(payroll.pf)}
                    </td>
                  </tr>
                )}

                {payroll.esi_enabled && (
                  <tr>
                    <td className="py-2 px-4 text-slate-700">Employee State Insurance (ESI)</td>
                    <td className="py-2 px-4 text-right font-medium text-slate-900">
                      {formatINR(payroll.esi)}
                    </td>
                  </tr>
                )}

                {payroll.professional_tax_enabled && (
                  <tr>
                    <td className="py-2 px-4 text-slate-700">Professional Tax (PT)</td>
                    <td className="py-2 px-4 text-right font-medium text-slate-900">
                      {formatINR(payroll.professional_tax)}
                    </td>
                  </tr>
                )}

                {payroll.tds_enabled && (
                  <tr>
                    <td className="py-2 px-4 text-slate-700">Income Tax (TDS)</td>
                    <td className="py-2 px-4 text-right font-medium text-slate-900">
                      {formatINR(payroll.tds)}
                    </td>
                  </tr>
                )}

                {payroll.salary_advance_enabled && (
                  <tr>
                    <td className="py-2 px-4 text-slate-700">Salary Advance Recovery</td>
                    <td className="py-2 px-4 text-right font-medium text-slate-900">
                      {formatINR(payroll.salary_advance)}
                    </td>
                  </tr>
                )}

                {payroll.loan_deduction_enabled && (
                  <tr>
                    <td className="py-2 px-4 text-slate-700">Loan EMI Deduction</td>
                    <td className="py-2 px-4 text-right font-medium text-slate-900">
                      {formatINR(payroll.loan_deduction)}
                    </td>
                  </tr>
                )}

                {payroll.other_deduction_enabled && (
                  <tr>
                    <td className="py-2 px-4 text-slate-700">Other Deductions</td>
                    <td className="py-2 px-4 text-right font-medium text-slate-900">
                      {formatINR(payroll.other_deduction)}
                    </td>
                  </tr>
                )}

                {/* If no deductions were enabled */}
                {!payroll.pf_enabled &&
                  !payroll.esi_enabled &&
                  !payroll.professional_tax_enabled &&
                  !payroll.tds_enabled &&
                  !payroll.salary_advance_enabled &&
                  !payroll.loan_deduction_enabled &&
                  !payroll.other_deduction_enabled && (
                    <tr>
                      <td colSpan={2} className="py-4 text-center text-slate-400 italic">
                        No deductions applicable for this period.
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-100/90 px-4 py-2.5 border-t border-slate-200 flex justify-between items-center font-bold text-xs text-rose-700">
            <span>Total Deductions</span>
            <span className="text-sm font-extrabold">{formatINR(payroll.total_deductions)}</span>
          </div>
        </div>
      </div>

      {/* 6. Net Pay Highlight Box & Words */}
      <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-200 mb-8 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
              Net Payable Amount
            </span>
            <p className="text-xs text-slate-600">
              Gross Earnings minus Total Deductions
            </p>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-800 font-display">
            {formatINR(payroll.net_salary)}
          </div>
        </div>

        <div className="pt-2 border-t border-emerald-200/60 text-xs">
          <span className="font-bold text-slate-700">Amount in Words: </span>
          <span className="text-slate-900 font-semibold italic">
            {payroll.amount_in_words || 'Zero Rupees Only'}
          </span>
        </div>
      </div>

      {/* 7. Signatures & Footer Note */}
      <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 items-end text-xs">
        <div>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-8">
            Employee Signature
          </p>
          <div className="border-t border-slate-300 pt-1.5 text-slate-700 font-medium">
            {empName}
          </div>
        </div>

        <div className="text-right">
          <div className="mb-2 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            Digitally Authorized
          </div>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-4">
            For {company.company_name}
          </p>
          <div className="border-t border-slate-300 pt-1.5">
            <p className="font-bold text-slate-900">{company.authorized_person || 'Authorized Signatory'}</p>
            <p className="text-[11px] text-slate-500">{company.authorized_designation || 'Head of HR'}</p>
          </div>
        </div>
      </div>

      <p className="text-center text-[10px] text-slate-400 mt-4 print:mt-3">
        This is a computer-generated salary slip and does not require a physical seal if authorized digitally.
      </p>
    </div>
  );
};
