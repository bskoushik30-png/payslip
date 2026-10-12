import { Employee } from '../types/employee';
import { PayrollRecord } from '../types/payroll';
import { CompanySettings } from '../types/company';
import { SEASONS_LOGO_DATA_URL } from '../assets/logo';

export const INITIAL_COMPANY_SETTINGS: CompanySettings = {
  id: 'comp-seasons-001',
  company_name: 'Seasons Landscapers',
  logo_url: SEASONS_LOGO_DATA_URL,
  address: '1384, Manchegowdana koppalu, Vijay Nagar 2nd Stage, Vijayanagar',
  city: 'Mysuru',
  state: 'Karnataka',
  pincode: '570017',
  phone: '+91 8217777927',
  email: 'info@seasonslandscapers.com',
  website: 'www.seasonslandscapers.com',
  gst_number: '',
  pan_number: '',
  authorized_person: 'Authorized Signatory',
  authorized_designation: 'Managing Partner / HR',
};

export const INITIAL_EMPLOYEES: Employee[] = [];

export const INITIAL_PAYROLL_RECORDS: PayrollRecord[] = [];
