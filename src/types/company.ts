export interface CompanySettings {
  id: string;
  company_name: string;
  logo_url?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  website: string;
  gst_number?: string;
  pan_number?: string;
  authorized_person: string;
  authorized_designation: string;
  created_at?: string;
  updated_at?: string;
}
