import * as XLSX from 'xlsx';
import { PayrollRecord } from '../types/payroll';

export const exportPayrollToExcel = (
  records: PayrollRecord[],
  month: string,
  year: number
): void => {
  if (!records || records.length === 0) {
    alert('No payroll records to export for this period.');
    return;
  }

  const exportData = records.map((record) => {
    const emp = record.employee;
    return {
      'Employee ID': emp?.employee_id || record.employee_id,
      'Employee Name': emp ? `${emp.first_name} ${emp.last_name}` : 'Unknown',
      'Department': emp?.department || '-',
      'Designation': emp?.designation || '-',
      'Month': `${record.month} ${record.year}`,
      'Working Days': record.working_days,
      'Present Days': record.present_days,
      'Paid Leave': record.paid_leave,
      'Unpaid Leave': record.unpaid_leave,
      'Payable Days': record.payable_days,
      'Base Salary (₹)': record.base_salary,
      'Loss of Pay (₹)': record.loss_of_pay,
      'Adjusted Base (₹)': record.adjusted_base_salary,
      'HRA (₹)': record.hra,
      'Bus Pass (₹)': record.bus_pass,
      'Other Allowances (₹)': record.other_allowance,
      'Travel Allowance (₹)': record.travel_allowance,
      'Bonus (₹)': record.bonus,
      'Overtime (₹)': record.overtime,
      'Other Earnings (₹)': record.other_earnings,
      'Gross Salary (₹)': record.gross_salary,
      'PF (₹)': record.pf,
      'ESI (₹)': record.esi,
      'Professional Tax (₹)': record.professional_tax,
      'TDS (₹)': record.tds,
      'Salary Advance (₹)': record.salary_advance,
      'Loan Deduction (₹)': record.loan_deduction,
      'Other Deductions (₹)': record.other_deduction,
      'Total Deductions (₹)': record.total_deductions,
      'Net Salary (₹)': record.net_salary,
      'Status': record.status,
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();

  // Set column widths for clean readability
  const colWidths = Object.keys(exportData[0] || {}).map((key) => ({
    wch: Math.max(key.length + 4, 14),
  }));
  worksheet['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(workbook, worksheet, `Payroll_${month}_${year}`);

  const fileName = `Payroll_Report_${month}_${year}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};
