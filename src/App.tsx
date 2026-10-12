import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useData } from './context/DataContext';
import { LoginPage } from './components/auth/LoginPage';
import { Sidebar } from './components/common/Sidebar';
import { Navbar } from './components/common/Navbar';
import { Dashboard } from './components/dashboard/Dashboard';
import { EmployeeList } from './components/employees/EmployeeList';
import { GeneratePayslip } from './components/payroll/GeneratePayslip';
import { PayrollHistory } from './components/history/PayrollHistory';
import { CompanySettings } from './components/settings/CompanySettings';
import { PayslipPreviewModal } from './components/payslip/PayslipPreviewModal';
import { EmployeeFormModal } from './components/employees/EmployeeFormModal';
import { PayrollRecord } from './types/payroll';

export const App: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { activeTab, previewingPayroll, setPreviewingPayroll } = useData();

  // Mobile sidebar drawer state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Quick Add Employee modal from top bar or dashboard
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);

  // If checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-300">Loading Zenith Payroll...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, render Login Page
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans antialiased text-slate-900">
      {/* 1. Left Sidebar */}
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <Navbar
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenAddEmployee={() => setIsAddEmployeeOpen(true)}
        />

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <Dashboard
                onOpenAddEmployee={() => setIsAddEmployeeOpen(true)}
                onViewPayslip={(record) => setPreviewingPayroll(record)}
              />
            )}

            {activeTab === 'employees' && (
              <EmployeeList
                isAddModalOpenFromParent={isAddEmployeeOpen}
                onCloseAddModalFromParent={() => setIsAddEmployeeOpen(false)}
              />
            )}

            {activeTab === 'generate-payslip' && (
              <GeneratePayslip
                onOpenPreview={(record) => setPreviewingPayroll(record)}
              />
            )}

            {activeTab === 'history' && (
              <PayrollHistory
                onViewPayslip={(record) => setPreviewingPayroll(record)}
              />
            )}

            {activeTab === 'settings' && <CompanySettings />}
          </div>
        </main>
      </div>

      {/* Global Payslip Preview & PDF Download Modal */}
      <PayslipPreviewModal
        isOpen={Boolean(previewingPayroll)}
        onClose={() => setPreviewingPayroll(null)}
        payroll={previewingPayroll}
      />

      {/* Quick Add Employee Modal from Navbar when not on employees page */}
      {activeTab !== 'employees' && (
        <EmployeeFormModal
          isOpen={isAddEmployeeOpen}
          onClose={() => setIsAddEmployeeOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
