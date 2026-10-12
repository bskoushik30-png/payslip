import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Employee, CreateEmployeeInput, UpdateEmployeeInput } from '../types/employee';
import { PayrollRecord, CreatePayrollInput, UpdatePayrollInput } from '../types/payroll';
import { CompanySettings } from '../types/company';
import * as storage from '../services/storage';
import { useToast } from './ToastContext';

export type NavigationTab = 'dashboard' | 'employees' | 'generate-payslip' | 'history' | 'settings';

interface DataContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  
  // Data lists
  employees: Employee[];
  payrolls: PayrollRecord[];
  companySettings: CompanySettings;
  isLoading: boolean;

  // Selected states for cross-component workflows
  selectedEmployeeForPayroll: Employee | null;
  setSelectedEmployeeForPayroll: (emp: Employee | null) => void;
  previewingPayroll: PayrollRecord | null;
  setPreviewingPayroll: (pr: PayrollRecord | null) => void;
  editingPayroll: PayrollRecord | null;
  setEditingPayroll: (pr: PayrollRecord | null) => void;

  // Employee actions
  createEmployee: (data: CreateEmployeeInput) => Promise<Employee>;
  updateEmployee: (id: string, data: UpdateEmployeeInput) => Promise<Employee>;
  deleteEmployee: (id: string) => Promise<boolean>;

  // Payroll actions
  createPayroll: (data: CreatePayrollInput) => Promise<PayrollRecord>;
  updatePayroll: (id: string, data: UpdatePayrollInput) => Promise<PayrollRecord>;
  deletePayroll: (id: string) => Promise<boolean>;

  // Settings action
  updateCompanySettings: (data: CompanySettings) => Promise<CompanySettings>;
  resetToDefaults: () => Promise<void>;
  reloadData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>([]);
  const [companySettings, setCompanySettings] = useState<CompanySettings>(storage.INITIAL_COMPANY_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Workflow states
  const [selectedEmployeeForPayroll, setSelectedEmployeeForPayroll] = useState<Employee | null>(null);
  const [previewingPayroll, setPreviewingPayroll] = useState<PayrollRecord | null>(null);
  const [editingPayroll, setEditingPayroll] = useState<PayrollRecord | null>(null);

  const loadAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const [empList, prList, comp] = await Promise.all([
        storage.getEmployees(),
        storage.getPayrolls(),
        storage.getCompanySettings(),
      ]);
      setEmployees(empList);
      setPayrolls(prList);
      setCompanySettings(comp);
    } catch (err) {
      console.error('Failed to load initial application data:', err);
      showToast('Failed to load data', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Employee CRUD operations
  const handleCreateEmployee = async (data: CreateEmployeeInput): Promise<Employee> => {
    try {
      const created = await storage.createEmployee(data);
      setEmployees((prev) => [created, ...prev]);
      showToast(`Employee "${created.first_name} ${created.last_name}" added successfully!`, 'success');
      return created;
    } catch (err: any) {
      showToast(err.message || 'Error creating employee', 'error');
      throw err;
    }
  };

  const handleUpdateEmployee = async (id: string, data: UpdateEmployeeInput): Promise<Employee> => {
    try {
      const updated = await storage.updateEmployee(id, data);
      setEmployees((prev) => prev.map((e) => (e.id === id || e.employee_id === id ? updated : e)));
      // Also update matching payroll record caches
      setPayrolls((prev) =>
        prev.map((p) =>
          p.employee_id === updated.employee_id || p.employee_id === updated.id
            ? { ...p, employee: updated }
            : p
        )
      );
      showToast(`Employee "${updated.first_name} ${updated.last_name}" updated!`, 'success');
      return updated;
    } catch (err: any) {
      showToast(err.message || 'Error updating employee', 'error');
      throw err;
    }
  };

  const handleDeleteEmployee = async (id: string): Promise<boolean> => {
    try {
      await storage.deleteEmployee(id);
      setEmployees((prev) => prev.filter((e) => e.id !== id && e.employee_id !== id));
      showToast('Employee deleted successfully', 'info');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Error deleting employee', 'error');
      return false;
    }
  };

  // Payroll CRUD operations
  const handleCreatePayroll = async (data: CreatePayrollInput): Promise<PayrollRecord> => {
    try {
      const created = await storage.createPayroll(data);
      setPayrolls((prev) => [created, ...prev]);
      showToast(`Payslip generated for ${data.month} ${data.year}!`, 'success');
      return created;
    } catch (err: any) {
      showToast(err.message || 'Error generating payslip', 'error');
      throw err;
    }
  };

  const handleUpdatePayroll = async (id: string, data: UpdatePayrollInput): Promise<PayrollRecord> => {
    try {
      const updated = await storage.updatePayroll(id, data);
      setPayrolls((prev) => prev.map((p) => (p.id === id ? updated : p)));
      showToast(`Payslip updated successfully!`, 'success');
      return updated;
    } catch (err: any) {
      showToast(err.message || 'Error updating payslip', 'error');
      throw err;
    }
  };

  const handleDeletePayroll = async (id: string): Promise<boolean> => {
    try {
      await storage.deletePayroll(id);
      setPayrolls((prev) => prev.filter((p) => p.id !== id));
      showToast('Payroll record deleted', 'info');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Error deleting payroll record', 'error');
      return false;
    }
  };

  // Settings operations
  const handleUpdateCompanySettings = async (data: CompanySettings): Promise<CompanySettings> => {
    try {
      const updated = await storage.saveCompanySettings(data);
      setCompanySettings(updated);
      showToast('Company settings saved successfully!', 'success');
      return updated;
    } catch (err: any) {
      showToast(err.message || 'Error saving company settings', 'error');
      throw err;
    }
  };

  const handleResetToDefaults = async () => {
    storage.resetDataStoreToDefaults();
    await loadAll();
    showToast('Demo data successfully restored to factory defaults!', 'info');
  };

  return (
    <DataContext.Provider
      value={{
        activeTab,
        setActiveTab,
        employees,
        payrolls,
        companySettings,
        isLoading,
        selectedEmployeeForPayroll,
        setSelectedEmployeeForPayroll,
        previewingPayroll,
        setPreviewingPayroll,
        editingPayroll,
        setEditingPayroll,
        createEmployee: handleCreateEmployee,
        updateEmployee: handleUpdateEmployee,
        deleteEmployee: handleDeleteEmployee,
        createPayroll: handleCreatePayroll,
        updatePayroll: handleUpdatePayroll,
        deletePayroll: handleDeletePayroll,
        updateCompanySettings: handleUpdateCompanySettings,
        resetToDefaults: handleResetToDefaults,
        reloadData: loadAll,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
