import React from 'react';
import {
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  History,
  Settings,
  Building2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useData, NavigationTab } from '../../context/DataContext';

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onMobileClose }) => {
  const { activeTab, setActiveTab, companySettings } = useData();

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'employees',
      label: 'Employees',
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: 'generate-payslip',
      label: 'Generate Payslip',
      icon: <FileSpreadsheet className="w-5 h-5" />,
      badge: 'Core',
    },
    {
      id: 'history',
      label: 'Payroll History',
      icon: <History className="w-5 h-5" />,
    },
    {
      id: 'settings',
      label: 'Company Settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const handleNavClick = (tabId: NavigationTab) => {
    setActiveTab(tabId);
    if (onMobileClose) onMobileClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 border-b border-slate-100 flex items-center gap-3">
          {companySettings.logo_url ? (
            <img
              src={companySettings.logo_url}
              alt={companySettings.company_name}
              className="h-9 w-auto max-w-[40px] object-contain rounded-lg"
            />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold text-slate-900 truncate tracking-tight">
              {companySettings.company_name || 'Seasons Landscapers'}
            </h1>
            <p className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Payroll System
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Main Menu
          </div>

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-50/80 text-emerald-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`${isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-700 rounded-md">
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-4 h-4 text-emerald-600" />}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Quick Help / System Info Footer */}
        <div className="p-3 border-t border-slate-100 m-2 rounded-xl bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate">Zenith Payroll v1.0</p>
              <p className="text-[10px] text-slate-500 truncate">Indian Compliance Ready</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
