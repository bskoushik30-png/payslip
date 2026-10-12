export type EmploymentType = 'Full Time' | 'Part Time' | 'Contract';
export type EmployeeStatus = 'Active' | 'Inactive';

export interface Employee {
  id: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  dob?: string;
  joining_date: string;
  address: string;
  designation: string;
  department: string;
  employment_type: EmploymentType;
  status: EmployeeStatus;
  
  // Payroll defaults
  base_salary: number;
  default_hra: number;
  default_other_allowance: number;
  default_bus_pass: number;
  pf_applicable: boolean;
  esi_applicable: boolean;
  professional_tax_applicable: boolean;

  created_at?: string;
  updated_at?: string;
}

export type CreateEmployeeInput = Omit<Employee, 'id' | 'created_at' | 'updated_at'>;
export type UpdateEmployeeInput = Partial<CreateEmployeeInput>;
