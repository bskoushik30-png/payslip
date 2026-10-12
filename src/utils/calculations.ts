export interface SalaryInputParams {
  working_days: number;
  present_days: number;
  paid_leave: number;
  unpaid_leave: number;
  holidays?: number;

  base_salary: number;
  hra?: number;
  bus_pass_enabled?: boolean;
  bus_pass?: number;
  other_allowance?: number;
  travel_allowance?: number;
  bonus?: number;
  overtime?: number;
  other_earnings?: number;

  pf_enabled?: boolean;
  pf?: number;
  esi_enabled?: boolean;
  esi?: number;
  professional_tax_enabled?: boolean;
  professional_tax?: number;
  tds_enabled?: boolean;
  tds?: number;
  salary_advance_enabled?: boolean;
  salary_advance?: number;
  loan_deduction_enabled?: boolean;
  loan_deduction?: number;
  other_deduction_enabled?: boolean;
  other_deduction?: number;
}

export interface SalaryCalculationResult {
  payable_days: number;
  daily_salary: number;
  loss_of_pay: number;
  adjusted_base_salary: number;
  gross_salary: number;
  total_deductions: number;
  net_salary: number;
  validationErrors: string[];
}

export const roundToTwo = (num: number): number => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

export const calculatePayroll = (params: SalaryInputParams): SalaryCalculationResult => {
  const errors: string[] = [];

  const working_days = Math.max(0, Number(params.working_days) || 0);
  const present_days = Math.max(0, Number(params.present_days) || 0);
  const paid_leave = Math.max(0, Number(params.paid_leave) || 0);
  const unpaid_leave = Math.max(0, Number(params.unpaid_leave) || 0);
  const holidays = Math.max(0, Number(params.holidays) || 0);

  const base_salary = Math.max(0, Number(params.base_salary) || 0);

  // Validation rules
  if (present_days > working_days) {
    errors.push('Present days cannot exceed total working days.');
  }

  const totalAccountedDays = present_days + paid_leave + unpaid_leave;
  if (working_days > 0 && totalAccountedDays > working_days) {
    errors.push(`Total days (Present: ${present_days} + Paid Leave: ${paid_leave} + Unpaid Leave: ${unpaid_leave} = ${totalAccountedDays}) exceed Total Working Days (${working_days}).`);
  }

  // Attendance: Payable Days = Present Days + Paid Leave
  const payable_days = roundToTwo(present_days + paid_leave);

  // Daily Salary = Base Salary / Total Working Days
  const daily_salary = working_days > 0 ? roundToTwo(base_salary / working_days) : 0;

  // Loss of Pay = Daily Salary * Unpaid Leave Days
  const loss_of_pay = roundToTwo(daily_salary * unpaid_leave);

  // Adjusted Base Salary = Base Salary - Loss of Pay
  const adjusted_base_salary = roundToTwo(Math.max(0, base_salary - loss_of_pay));

  // Allowances & Earnings
  const hra = Number(params.hra) || 0;
  const bus_pass = params.bus_pass_enabled ? (Number(params.bus_pass) || 0) : 0;
  const other_allowance = Number(params.other_allowance) || 0;
  const travel_allowance = Number(params.travel_allowance) || 0;
  const bonus = Number(params.bonus) || 0;
  const overtime = Number(params.overtime) || 0;
  const other_earnings = Number(params.other_earnings) || 0;

  // Gross Salary = Adjusted Base + Allowances + Bonuses
  const gross_salary = roundToTwo(
    adjusted_base_salary +
    hra +
    bus_pass +
    other_allowance +
    travel_allowance +
    bonus +
    overtime +
    other_earnings
  );

  // Deductions
  const pf = params.pf_enabled ? (Number(params.pf) || 0) : 0;
  const esi = params.esi_enabled ? (Number(params.esi) || 0) : 0;
  const pt = params.professional_tax_enabled ? (Number(params.professional_tax) || 0) : 0;
  const tds = params.tds_enabled ? (Number(params.tds) || 0) : 0;
  const advance = params.salary_advance_enabled ? (Number(params.salary_advance) || 0) : 0;
  const loan = params.loan_deduction_enabled ? (Number(params.loan_deduction) || 0) : 0;
  const other_ded = params.other_deduction_enabled ? (Number(params.other_deduction) || 0) : 0;

  const total_deductions = roundToTwo(pf + esi + pt + tds + advance + loan + other_ded);

  // Net Salary = Gross Salary - Total Deductions
  const net_salary = roundToTwo(Math.max(0, gross_salary - total_deductions));

  return {
    payable_days,
    daily_salary,
    loss_of_pay,
    adjusted_base_salary,
    gross_salary,
    total_deductions,
    net_salary,
    validationErrors: errors,
  };
};
