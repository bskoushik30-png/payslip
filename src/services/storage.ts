import { Employee, CreateEmployeeInput, UpdateEmployeeInput } from '../types/employee';
import { PayrollRecord, CreatePayrollInput, UpdatePayrollInput } from '../types/payroll';
import { CompanySettings } from '../types/company';
import { INITIAL_COMPANY_SETTINGS, INITIAL_EMPLOYEES, INITIAL_PAYROLL_RECORDS } from './mockData';
import { getSupabase } from './supabase';

export { INITIAL_COMPANY_SETTINGS, INITIAL_EMPLOYEES, INITIAL_PAYROLL_RECORDS };

const KEYS = {
  EMPLOYEES: 'zenith_employees_v3',
  PAYROLLS: 'zenith_payrolls_v3',
  COMPANY: 'zenith_company_settings_v3',
  SEEDED: 'zenith_seeded_v3',
};

// Initialize clean data store if not present
export const initializeDataStore = (): void => {
  // Clean legacy keys if present
  try {
    localStorage.removeItem('zenith_employees_v1');
    localStorage.removeItem('zenith_payrolls_v1');
    localStorage.removeItem('zenith_company_settings_v1');
    localStorage.removeItem('zenith_seeded_v1');
    localStorage.removeItem('zenith_employees_v2');
    localStorage.removeItem('zenith_payrolls_v2');
    localStorage.removeItem('zenith_company_settings_v2');
    localStorage.removeItem('zenith_seeded_v2');
  } catch (e) {}

  const isSeeded = localStorage.getItem(KEYS.SEEDED);
  if (!isSeeded) {
    localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(INITIAL_EMPLOYEES));
    localStorage.setItem(KEYS.PAYROLLS, JSON.stringify(INITIAL_PAYROLL_RECORDS));
    localStorage.setItem(KEYS.COMPANY, JSON.stringify(INITIAL_COMPANY_SETTINGS));
    localStorage.setItem(KEYS.SEEDED, 'true');
  }
};

export const resetDataStoreToDefaults = (): void => {
  localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(INITIAL_EMPLOYEES));
  localStorage.setItem(KEYS.PAYROLLS, JSON.stringify(INITIAL_PAYROLL_RECORDS));
  localStorage.setItem(KEYS.COMPANY, JSON.stringify(INITIAL_COMPANY_SETTINGS));
  localStorage.setItem(KEYS.SEEDED, 'true');
};

/* ==========================================================================
   Company Settings Service
   ========================================================================== */

export const getCompanySettings = async (): Promise<CompanySettings> => {
  initializeDataStore();
  const supabase = getSupabase();

  if (supabase) {
    try {
      const { data, error } = await supabase.from('company_settings').select('*').single();
      if (!error && data) {
        localStorage.setItem(KEYS.COMPANY, JSON.stringify(data));
        return data as CompanySettings;
      }
    } catch (err) {
      console.warn('Supabase fetch company settings error, falling back to local storage', err);
    }
  }

  const stored = localStorage.getItem(KEYS.COMPANY);
  if (stored) {
    const parsed = JSON.parse(stored);
    if (!parsed.logo_url || parsed.logo_url === '/seasons-logo.svg') {
      parsed.logo_url = INITIAL_COMPANY_SETTINGS.logo_url;
      localStorage.setItem(KEYS.COMPANY, JSON.stringify(parsed));
    }
    return parsed;
  }
  return INITIAL_COMPANY_SETTINGS;
};

export const saveCompanySettings = async (settings: CompanySettings): Promise<CompanySettings> => {
  const updatedSettings = {
    ...settings,
    updated_at: new Date().toISOString(),
  };

  localStorage.setItem(KEYS.COMPANY, JSON.stringify(updatedSettings));

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('company_settings').upsert(updatedSettings);
    } catch (err) {
      console.warn('Supabase upsert company error:', err);
    }
  }

  return updatedSettings;
};

/* ==========================================================================
   Employee Service
   ========================================================================== */

export const getEmployees = async (): Promise<Employee[]> => {
  initializeDataStore();
  const supabase = getSupabase();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(data));
        return data as Employee[];
      }
    } catch (err) {
      console.warn('Supabase fetch employees error, using local storage fallback', err);
    }
  }

  const stored = localStorage.getItem(KEYS.EMPLOYEES);
  return stored ? JSON.parse(stored) : INITIAL_EMPLOYEES;
};

export const getEmployeeById = async (id: string): Promise<Employee | null> => {
  const list = await getEmployees();
  return list.find((e) => e.id === id || e.employee_id === id) || null;
};

export const createEmployee = async (input: CreateEmployeeInput): Promise<Employee> => {
  const employees = await getEmployees();

  // Check unique employee_id
  const exists = employees.some(
    (e) => e.employee_id.trim().toLowerCase() === input.employee_id.trim().toLowerCase()
  );
  if (exists) {
    throw new Error(`Employee ID "${input.employee_id}" already exists.`);
  }

  const newEmployee: Employee = {
    ...input,
    id: 'emp-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const updatedList = [newEmployee, ...employees];
  localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(updatedList));

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('employees').insert(newEmployee);
    } catch (err) {
      console.warn('Supabase insert employee error:', err);
    }
  }

  return newEmployee;
};

export const updateEmployee = async (id: string, input: UpdateEmployeeInput): Promise<Employee> => {
  const employees = await getEmployees();
  const index = employees.findIndex((e) => e.id === id || e.employee_id === id);

  if (index === -1) {
    throw new Error(`Employee not found.`);
  }

  // Check unique employee_id if changing
  if (input.employee_id && input.employee_id !== employees[index].employee_id) {
    const exists = employees.some(
      (e, idx) => idx !== index && e.employee_id.trim().toLowerCase() === input.employee_id!.trim().toLowerCase()
    );
    if (exists) {
      throw new Error(`Employee ID "${input.employee_id}" is already used by another employee.`);
    }
  }

  const updated: Employee = {
    ...employees[index],
    ...input,
    updated_at: new Date().toISOString(),
  };

  employees[index] = updated;
  localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(employees));

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('employees').update(updated).eq('id', updated.id);
    } catch (err) {
      console.warn('Supabase update employee error:', err);
    }
  }

  return updated;
};

export const deleteEmployee = async (id: string): Promise<boolean> => {
  const employees = await getEmployees();
  const filtered = employees.filter((e) => e.id !== id && e.employee_id !== id);
  localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(filtered));

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('employees').delete().or(`id.eq.${id},employee_id.eq.${id}`);
    } catch (err) {
      console.warn('Supabase delete employee error:', err);
    }
  }

  return true;
};

/* ==========================================================================
   Payroll Service
   ========================================================================== */

export const getPayrolls = async (): Promise<PayrollRecord[]> => {
  initializeDataStore();
  const employees = await getEmployees();
  const supabase = getSupabase();

  let rawPayrolls: PayrollRecord[] = [];

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('payroll')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        rawPayrolls = data as PayrollRecord[];
        localStorage.setItem(KEYS.PAYROLLS, JSON.stringify(rawPayrolls));
      }
    } catch (err) {
      console.warn('Supabase fetch payrolls error, falling back to local storage', err);
    }
  }

  if (rawPayrolls.length === 0) {
    const stored = localStorage.getItem(KEYS.PAYROLLS);
    rawPayrolls = stored ? JSON.parse(stored) : INITIAL_PAYROLL_RECORDS;
  }

  // Attach populated employee object to payroll record
  return rawPayrolls.map((p) => {
    const matchedEmployee = employees.find(
      (e) => e.employee_id === p.employee_id || e.id === p.employee_id
    );
    return {
      ...p,
      employee: matchedEmployee || p.employee,
    };
  });
};

export const createPayroll = async (input: CreatePayrollInput): Promise<PayrollRecord> => {
  const payrolls = await getPayrolls();

  // Check for duplicate payroll for same employee + month + year
  const exists = payrolls.some(
    (p) =>
      p.employee_id === input.employee_id &&
      p.month.toLowerCase() === input.month.toLowerCase() &&
      Number(p.year) === Number(input.year)
  );

  if (exists) {
    throw new Error(
      `Payroll for employee ${input.employee_id} for ${input.month} ${input.year} already exists. Please edit or delete the existing record.`
    );
  }

  const newPayroll: PayrollRecord = {
    ...input,
    id: 'pr-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const updatedList = [newPayroll, ...payrolls];
  localStorage.setItem(KEYS.PAYROLLS, JSON.stringify(updatedList));

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { employee, ...insertPayload } = newPayroll;
      await supabase.from('payroll').insert(insertPayload);
    } catch (err) {
      console.warn('Supabase insert payroll error:', err);
    }
  }

  const employees = await getEmployees();
  newPayroll.employee = employees.find(
    (e) => e.employee_id === newPayroll.employee_id || e.id === newPayroll.employee_id
  );

  return newPayroll;
};

export const updatePayroll = async (id: string, input: UpdatePayrollInput): Promise<PayrollRecord> => {
  const payrolls = await getPayrolls();
  const index = payrolls.findIndex((p) => p.id === id);

  if (index === -1) {
    throw new Error(`Payroll record not found.`);
  }

  const updated: PayrollRecord = {
    ...payrolls[index],
    ...input,
    updated_at: new Date().toISOString(),
  };

  payrolls[index] = updated;
  localStorage.setItem(KEYS.PAYROLLS, JSON.stringify(payrolls));

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { employee, ...updatePayload } = updated;
      await supabase.from('payroll').update(updatePayload).eq('id', updated.id);
    } catch (err) {
      console.warn('Supabase update payroll error:', err);
    }
  }

  return updated;
};

export const deletePayroll = async (id: string): Promise<boolean> => {
  const payrolls = await getPayrolls();
  const filtered = payrolls.filter((p) => p.id !== id);
  localStorage.setItem(KEYS.PAYROLLS, JSON.stringify(filtered));

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('payroll').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase delete payroll error:', err);
    }
  }

  return true;
};
