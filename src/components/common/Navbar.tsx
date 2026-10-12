import React, { useState } from 'react';
import {
  Menu,
  Calendar,
  LogOut,
  User,
  ShieldCheck,
  PlusCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { getCurrentMonthYear } from '../../utils/formatters';

interface NavbarProps {
  onOpenMobileMenu: () => void;
  onOpenAddEmployee?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMobileMenu,
  onOpenAddEmployee,
}) => {
  const { user, logout } = useAuth();
  const { setActiveTab } = useData();
  const { month, year } = getCurrentMonthYear();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left section: Mobile Toggle & Current Period */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Current Month Badge */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl">
          <Calendar className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-semibold text-slate-700">
            Payroll Period:{' '}
            <span className="text-slate-900 font-bold">
              {month} {year}
            </span>
          </span>
        </div>
      </div>

      {/* Right section: Quick Actions & Profile Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Shortcut Buttons */}
        {onOpenAddEmployee && (
          <button
            onClick={onOpenAddEmployee}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition"
          >
            <PlusCircle className="w-3.5 h-3.5 text-slate-600" />
            Add Employee
          </button>
        )}

        <button
          onClick={() => setActiveTab('generate-payslip')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-xs shadow-emerald-600/20"
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Payslip</span>
          <span className="sm:hidden">Payslip</span>
        </button>

        {/* Profile / User dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-2.5 p-1 pl-2 pr-2.5 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition"
          >
            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-slate-800 truncate leading-tight">
                {user?.name || 'Administrator'}
              </p>
              <p className="text-[10px] text-slate-400 font-medium">HR Admin</p>
            </div>
          </button>

          {/* Dropdown Menu */}
          {showProfileDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowProfileDropdown(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-in">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{user?.name || 'Admin User'}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                  <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Admin Session
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      setActiveTab('settings');
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    Company Profile & Settings
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
