-- ==========================================================================
-- SUPABASE POSTGRESQL DATABASE SCHEMA
-- Payroll & Payslip Management System (ZenithPay / Seasons Landscapers)
-- ==========================================================================

-- 1. Enable pgcrypto for UUID generation functions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================================================
-- 2. Create EMPLOYEES Table
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.employees (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    mobile VARCHAR(50) NOT NULL,
    dob DATE,
    joining_date DATE NOT NULL,
    address TEXT NOT NULL,
    designation VARCHAR(150) NOT NULL,
    department VARCHAR(100) NOT NULL,
    employment_type VARCHAR(50) NOT NULL DEFAULT 'Full Time',
    status VARCHAR(50) NOT NULL DEFAULT 'Active',
    
    -- Default payroll salary configuration
    base_salary NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    default_hra NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    default_other_allowance NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    default_bus_pass NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    pf_applicable BOOLEAN NOT NULL DEFAULT true,
    esi_applicable BOOLEAN NOT NULL DEFAULT false,
    professional_tax_applicable BOOLEAN NOT NULL DEFAULT true,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for lightning fast queries on employees
CREATE INDEX IF NOT EXISTS idx_employees_employee_id ON public.employees(employee_id);
CREATE INDEX IF NOT EXISTS idx_employees_status ON public.employees(status);
CREATE INDEX IF NOT EXISTS idx_employees_department ON public.employees(department);

-- ==========================================================================
-- 3. Create PAYROLL Table
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.payroll (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    employee_id VARCHAR(50) NOT NULL,
    month VARCHAR(20) NOT NULL,
    year INTEGER NOT NULL,

    -- Attendance Metrics
    working_days NUMERIC(5, 2) NOT NULL DEFAULT 0,
    present_days NUMERIC(5, 2) NOT NULL DEFAULT 0,
    paid_leave NUMERIC(5, 2) NOT NULL DEFAULT 0,
    unpaid_leave NUMERIC(5, 2) NOT NULL DEFAULT 0,
    holidays NUMERIC(5, 2) NOT NULL DEFAULT 0,
    payable_days NUMERIC(5, 2) NOT NULL DEFAULT 0,

    -- Base Salary & Loss of Pay
    base_salary NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    loss_of_pay NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    adjusted_base_salary NUMERIC(12, 2) NOT NULL DEFAULT 0.00,

    -- Allowances & Earnings
    hra NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    bus_pass_enabled BOOLEAN NOT NULL DEFAULT false,
    bus_pass NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    other_allowance NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    travel_allowance NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    bonus NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    overtime NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    other_earnings NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    gross_salary NUMERIC(12, 2) NOT NULL DEFAULT 0.00,

    -- Deductions
    pf_enabled BOOLEAN NOT NULL DEFAULT false,
    pf NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    esi_enabled BOOLEAN NOT NULL DEFAULT false,
    esi NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    professional_tax_enabled BOOLEAN NOT NULL DEFAULT false,
    professional_tax NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    tds_enabled BOOLEAN NOT NULL DEFAULT false,
    tds NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    salary_advance_enabled BOOLEAN NOT NULL DEFAULT false,
    salary_advance NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    loan_deduction_enabled BOOLEAN NOT NULL DEFAULT false,
    loan_deduction NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    other_deduction_enabled BOOLEAN NOT NULL DEFAULT false,
    other_deduction NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total_deductions NUMERIC(12, 2) NOT NULL DEFAULT 0.00,

    -- Net Salary & Words
    net_salary NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    amount_in_words TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Generated',

    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

    -- Ensure unique payroll entry per employee per month & year
    CONSTRAINT unique_employee_month_year UNIQUE (employee_id, month, year)
);

-- Indexes for fast query and filtering on payroll records
CREATE INDEX IF NOT EXISTS idx_payroll_employee_id ON public.payroll(employee_id);
CREATE INDEX IF NOT EXISTS idx_payroll_month_year ON public.payroll(month, year);
CREATE INDEX IF NOT EXISTS idx_payroll_status ON public.payroll(status);

-- ==========================================================================
-- 4. Create COMPANY_SETTINGS Table
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.company_settings (
    id TEXT PRIMARY KEY DEFAULT 'comp-seasons-001',
    company_name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(20) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    website VARCHAR(255) NOT NULL,
    gst_number VARCHAR(50),
    pan_number VARCHAR(50),
    authorized_person VARCHAR(150) NOT NULL,
    authorized_designation VARCHAR(150) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================================================
-- 5. Seed Default Company Settings
-- ==========================================================================
INSERT INTO public.company_settings (
    id,
    company_name,
    address,
    city,
    state,
    pincode,
    phone,
    email,
    website,
    gst_number,
    pan_number,
    authorized_person,
    authorized_designation
) VALUES (
    'comp-seasons-001',
    'Seasons Landscapers',
    '1384, Manchegowdana koppalu, Vijay Nagar 2nd Stage, Vijayanagar',
    'Mysuru',
    'Karnataka',
    '570017',
    '+91 8217777927',
    'info@seasonslandscapers.com',
    'www.seasonslandscapers.com',
    '',
    '',
    'Authorized Signatory',
    'Managing Partner / HR'
)
ON CONFLICT (id) DO UPDATE SET
    company_name = EXCLUDED.company_name,
    address = EXCLUDED.address,
    city = EXCLUDED.city,
    state = EXCLUDED.state,
    pincode = EXCLUDED.pincode,
    phone = EXCLUDED.phone,
    email = EXCLUDED.email,
    website = EXCLUDED.website,
    authorized_person = EXCLUDED.authorized_person,
    authorized_designation = EXCLUDED.authorized_designation;

-- ==========================================================================
-- 6. Row Level Security (RLS) Configuration
-- ==========================================================================
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;

-- Allow full access for anon key & authenticated users
DROP POLICY IF EXISTS "Public and anon access to employees" ON public.employees;
CREATE POLICY "Public and anon access to employees" 
ON public.employees FOR ALL 
USING (true) 
WITH CHECK (true);

DROP POLICY IF EXISTS "Public and anon access to payroll" ON public.payroll;
CREATE POLICY "Public and anon access to payroll" 
ON public.payroll FOR ALL 
USING (true) 
WITH CHECK (true);

DROP POLICY IF EXISTS "Public and anon access to company_settings" ON public.company_settings;
CREATE POLICY "Public and anon access to company_settings" 
ON public.company_settings FOR ALL 
USING (true) 
WITH CHECK (true);

-- ==========================================================================
-- 7. Automatic updated_at Trigger
-- ==========================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_employees_updated_at ON public.employees;
CREATE TRIGGER trigger_employees_updated_at
BEFORE UPDATE ON public.employees
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_payroll_updated_at ON public.payroll;
CREATE TRIGGER trigger_payroll_updated_at
BEFORE UPDATE ON public.payroll
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_company_settings_updated_at ON public.company_settings;
CREATE TRIGGER trigger_company_settings_updated_at
BEFORE UPDATE ON public.company_settings
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
