import { Employee } from './employee';

export type PayrollStatus = 'Generated' | 'Paid' | 'Pending';

export interface PayrollRecord {
  id: string;
  employee_id: string; // Foreign key / UUID matching Employee.id or Employee.employee_id
  employee?: Employee;
  month: string;       // e.g., 'September'
  year: number;        // e.g., 2026

  // Step 2: Attendance
  working_days: number;
  present_days: number;
  paid_leave: number;
  unpaid_leave: number;
  holidays: number;
  payable_days: number; // Present Days + Paid Leave

  // Step 3: Base & Loss of Pay
  base_salary: number;
  loss_of_pay: number;          // (Base / Working Days) * Unpaid Leave
  adjusted_base_salary: number; // Base - Loss of Pay

  // Allowances & Earnings
  hra: number;
  bus_pass_enabled: boolean;
  bus_pass: number;
  other_allowance: number;
  travel_allowance: number;
  bonus: number;
  overtime: number;
  other_earnings: number;
  gross_salary: number;

  // Step 4: Deductions
  pf_enabled: boolean;
  pf: number;
  esi_enabled: boolean;
  esi: number;
  professional_tax_enabled: boolean;
  professional_tax: number;
  tds_enabled: boolean;
  tds: number;
  salary_advance_enabled: boolean;
  salary_advance: number;
  loan_deduction_enabled: boolean;
  loan_deduction: number;
  other_deduction_enabled: boolean;
  other_deduction: number;
  total_deductions: number;

  // Step 5: Net & Words
  net_salary: number;
  amount_in_words: string;

  status: PayrollStatus;
  created_at?: string;
  updated_at?: string;
}

export type CreatePayrollInput = Omit<PayrollRecord, 'id' | 'created_at' | 'updated_at'>;
export type UpdatePayrollInput = Partial<CreatePayrollInput>;
