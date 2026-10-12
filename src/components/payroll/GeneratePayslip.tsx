import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { Employee } from '../../types/employee';
import { PayrollRecord, CreatePayrollInput } from '../../types/payroll';
import { calculatePayroll, SalaryCalculationResult } from '../../utils/calculations';
import { numberToWordsINR } from '../../utils/numberToWords';
import { getCurrentMonthYear } from '../../utils/formatters';
import { StepEmployeeMonth } from './StepEmployeeMonth';
import { StepAttendance } from './StepAttendance';
import { StepEarnings } from './StepEarnings';
import { StepDeductions } from './StepDeductions';
import { LiveSalarySummary } from './LiveSalarySummary';
import { Sparkles, ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react';

interface GeneratePayslipProps {
  onOpenPreview: (record: PayrollRecord) => void;
}

export const GeneratePayslip: React.FC<GeneratePayslipProps> = ({ onOpenPreview }) => {
  const {
    employees,
    payrolls,
    selectedEmployeeForPayroll,
    setSelectedEmployeeForPayroll,
    editingPayroll,
    setEditingPayroll,
    createPayroll,
    updatePayroll,
    setActiveTab,
  } = useData();

  const { month: defaultMonth, year: defaultYear } = getCurrentMonthYear();

  // Form State
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [month, setMonth] = useState<string>(defaultMonth);
  const [year, setYear] = useState<number>(defaultYear);

  // Attendance
  const [workingDays, setWorkingDays] = useState<number>(26);
  const [presentDays, setPresentDays] = useState<number>(26);
  const [paidLeave, setPaidLeave] = useState<number>(0);
  const [unpaidLeave, setUnpaidLeave] = useState<number>(0);
  const [holidays, setHolidays] = useState<number>(0);

  // Earnings
  const [baseSalary, setBaseSalary] = useState<number>(0);
  const [hra, setHra] = useState<number>(0);
  const [busPassEnabled, setBusPassEnabled] = useState<boolean>(false);
  const [busPass, setBusPass] = useState<number>(0);
  const [travelAllowance, setTravelAllowance] = useState<number>(0);
  const [otherAllowance, setOtherAllowance] = useState<number>(0);
  const [bonus, setBonus] = useState<number>(0);
  const [overtime, setOvertime] = useState<number>(0);
  const [otherEarnings, setOtherEarnings] = useState<number>(0);

  // Deductions
  const [pfEnabled, setPfEnabled] = useState<boolean>(false);
  const [pf, setPf] = useState<number>(0);
  const [esiEnabled, setEsiEnabled] = useState<boolean>(false);
  const [esi, setEsi] = useState<number>(0);
  const [ptEnabled, setPtEnabled] = useState<boolean>(false);
  const [pt, setPt] = useState<number>(0);
  const [tdsEnabled, setTdsEnabled] = useState<boolean>(false);
  const [tds, setTds] = useState<number>(0);
  const [advanceEnabled, setAdvanceEnabled] = useState<boolean>(false);
  const [advance, setAdvance] = useState<number>(0);
  const [loanEnabled, setLoanEnabled] = useState<boolean>(false);
  const [loan, setLoan] = useState<number>(0);
  const [otherDeductionEnabled, setOtherDeductionEnabled] = useState<boolean>(false);
  const [otherDeduction, setOtherDeduction] = useState<number>(0);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Load employee defaults into state
  const loadEmployeeDefaults = (emp: Employee) => {
    setSelectedEmployeeId(emp.employee_id);
    setBaseSalary(emp.base_salary || 0);
    setHra(emp.default_hra || 0);
    setOtherAllowance(emp.default_other_allowance || 0);
    
    setBusPassEnabled(Boolean(emp.default_bus_pass && emp.default_bus_pass > 0));
    setBusPass(emp.default_bus_pass || 0);

    setPfEnabled(Boolean(emp.pf_applicable));
    setPf(0);

    setEsiEnabled(Boolean(emp.esi_applicable));
    setEsi(0);

    setPtEnabled(Boolean(emp.professional_tax_applicable));
    setPt(0);

    // Default attendance
    setWorkingDays(26);
    setPresentDays(26);
    setPaidLeave(0);
    setUnpaidLeave(0);
    setHolidays(0);
    setTravelAllowance(0);
    setBonus(0);
    setOvertime(0);
    setOtherEarnings(0);
    setTdsEnabled(false);
    setTds(0);
    setAdvanceEnabled(false);
    setAdvance(0);
    setLoanEnabled(false);
    setLoan(0);
    setOtherDeductionEnabled(false);
    setOtherDeduction(0);
  };

  // Load existing payroll record into state
  const loadPayrollRecord = (pr: PayrollRecord) => {
    setSelectedEmployeeId(pr.employee_id);
    setMonth(pr.month);
    setYear(pr.year);

    setWorkingDays(pr.working_days);
    setPresentDays(pr.present_days);
    setPaidLeave(pr.paid_leave);
    setUnpaidLeave(pr.unpaid_leave);
    setHolidays(pr.holidays || 0);

    setBaseSalary(pr.base_salary);
    setHra(pr.hra);
    setBusPassEnabled(pr.bus_pass_enabled);
    setBusPass(pr.bus_pass);
    setTravelAllowance(pr.travel_allowance || 0);
    setOtherAllowance(pr.other_allowance || 0);
    setBonus(pr.bonus || 0);
    setOvertime(pr.overtime || 0);
    setOtherEarnings(pr.other_earnings || 0);

    setPfEnabled(pr.pf_enabled);
    setPf(pr.pf);
    setEsiEnabled(pr.esi_enabled);
    setEsi(pr.esi);
    setPtEnabled(pr.professional_tax_enabled);
    setPt(pr.professional_tax);
    setTdsEnabled(pr.tds_enabled);
    setTds(pr.tds);
    setAdvanceEnabled(pr.salary_advance_enabled);
    setAdvance(pr.salary_advance);
    setLoanEnabled(pr.loan_deduction_enabled);
    setLoan(pr.loan_deduction);
    setOtherDeductionEnabled(pr.other_deduction_enabled);
    setOtherDeduction(pr.other_deduction);
  };

  // Check if there is an existing payroll for selected employee, month, year
  const existingPayroll = useMemo(() => {
    if (!selectedEmployeeId) return null;
    return payrolls.find(
      (p) =>
        (p.employee_id === selectedEmployeeId || p.employee?.employee_id === selectedEmployeeId) &&
        p.month.toLowerCase() === month.toLowerCase() &&
        Number(p.year) === Number(year)
    ) || null;
  }, [selectedEmployeeId, month, year, payrolls]);

  // Handle selectedEmployeeForPayroll or editingPayroll from context
  useEffect(() => {
    if (editingPayroll) {
      loadPayrollRecord(editingPayroll);
      setEditingPayroll(null);
    } else if (selectedEmployeeForPayroll) {
      loadEmployeeDefaults(selectedEmployeeForPayroll);
      setSelectedEmployeeForPayroll(null);
    } else if (!selectedEmployeeId && employees.length > 0) {
      const activeEmp = employees.find((e) => e.status === 'Active') || employees[0];
      if (activeEmp) loadEmployeeDefaults(activeEmp);
    }
  }, [editingPayroll, selectedEmployeeForPayroll, employees]);

  // Live calculation result
  const calculation: SalaryCalculationResult = useMemo(() => {
    return calculatePayroll({
      working_days: workingDays,
      present_days: presentDays,
      paid_leave: paidLeave,
      unpaid_leave: unpaidLeave,
      holidays: holidays,
      base_salary: baseSalary,
      hra: hra,
      bus_pass_enabled: busPassEnabled,
      bus_pass: busPass,
      travel_allowance: travelAllowance,
      other_allowance: otherAllowance,
      bonus: bonus,
      overtime: overtime,
      other_earnings: otherEarnings,
      pf_enabled: pfEnabled,
      pf: pf,
      esi_enabled: esiEnabled,
      esi: esi,
      professional_tax_enabled: ptEnabled,
      professional_tax: pt,
      tds_enabled: tdsEnabled,
      tds: tds,
      salary_advance_enabled: advanceEnabled,
      salary_advance: advance,
      loan_deduction_enabled: loanEnabled,
      loan_deduction: loan,
      other_deduction_enabled: otherDeductionEnabled,
      other_deduction: otherDeduction,
    });
  }, [
    workingDays,
    presentDays,
    paidLeave,
    unpaidLeave,
    holidays,
    baseSalary,
    hra,
    busPassEnabled,
    busPass,
    travelAllowance,
    otherAllowance,
    bonus,
    overtime,
    otherEarnings,
    pfEnabled,
    pf,
    esiEnabled,
    esi,
    ptEnabled,
    pt,
    tdsEnabled,
    tds,
    advanceEnabled,
    advance,
    loanEnabled,
    loan,
    otherDeductionEnabled,
    otherDeduction,
  ]);

  // Assemble full record object
  const buildCurrentPayrollRecord = (): CreatePayrollInput => {
    const matchedEmployee = employees.find(
      (e) => e.employee_id === selectedEmployeeId || e.id === selectedEmployeeId
    );

    return {
      employee_id: matchedEmployee?.employee_id || selectedEmployeeId,
      employee: matchedEmployee,
      month,
      year,
      working_days: workingDays,
      present_days: presentDays,
      paid_leave: paidLeave,
      unpaid_leave: unpaidLeave,
      holidays: holidays,
      payable_days: calculation.payable_days,
      base_salary: baseSalary,
      loss_of_pay: calculation.loss_of_pay,
      adjusted_base_salary: calculation.adjusted_base_salary,
      hra: hra,
      bus_pass_enabled: busPassEnabled,
      bus_pass: busPassEnabled ? busPass : 0,
      other_allowance: otherAllowance,
      travel_allowance: travelAllowance,
      bonus: bonus,
      overtime: overtime,
      other_earnings: otherEarnings,
      gross_salary: calculation.gross_salary,
      pf_enabled: pfEnabled,
      pf: pfEnabled ? pf : 0,
      esi_enabled: esiEnabled,
      esi: esiEnabled ? esi : 0,
      professional_tax_enabled: ptEnabled,
      professional_tax: ptEnabled ? pt : 0,
      tds_enabled: tdsEnabled,
      tds: tdsEnabled ? tds : 0,
      salary_advance_enabled: advanceEnabled,
      salary_advance: advanceEnabled ? advance : 0,
      loan_deduction_enabled: loanEnabled,
      loan_deduction: loanEnabled ? loan : 0,
      other_deduction_enabled: otherDeductionEnabled,
      other_deduction: otherDeductionEnabled ? otherDeduction : 0,
      total_deductions: calculation.total_deductions,
      net_salary: calculation.net_salary,
      amount_in_words: numberToWordsINR(calculation.net_salary),
      status: 'Generated',
    };
  };

  const handlePreview = () => {
    const record = buildCurrentPayrollRecord() as PayrollRecord;
    record.id = existingPayroll ? existingPayroll.id : 'preview-temp-id';
    onOpenPreview(record);
  };

  const handleSavePayroll = async () => {
    if (!selectedEmployeeId) {
      alert('Please select an employee.');
      return;
    }
    if (calculation.validationErrors.length > 0) {
      alert(calculation.validationErrors.join('\n'));
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = buildCurrentPayrollRecord();
      let savedRecord: PayrollRecord;

      if (existingPayroll) {
        savedRecord = await updatePayroll(existingPayroll.id, payload);
      } else {
        savedRecord = await createPayroll(payload);
      }

      onOpenPreview(savedRecord);
    } catch (err) {
      console.error('Failed to save payroll:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
            Generate Monthly Payslip
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Compute attendance, loss of pay, allowances, and deductions to produce A4 salary slips
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedEmployeeId && (
            <button
              type="button"
              onClick={() => {
                const emp = employees.find(
                  (e) => e.employee_id === selectedEmployeeId || e.id === selectedEmployeeId
                );
                if (emp) loadEmployeeDefaults(emp);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition"
              title="Reset inputs to employee saved defaults"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              Reset Defaults
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Form Sections (Left) & Sticky Calculation Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form: Steps 1, 2, 3, 4 */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step 1: Employee & Month */}
          <StepEmployeeMonth
            employees={employees}
            selectedEmployeeId={selectedEmployeeId}
            onSelectEmployee={loadEmployeeDefaults}
            month={month}
            onChangeMonth={setMonth}
            year={year}
            onChangeYear={setYear}
            existingPayrollId={existingPayroll ? existingPayroll.id : null}
            onLoadExistingPayroll={() => {
              if (existingPayroll) loadPayrollRecord(existingPayroll);
            }}
          />

          {/* Step 2: Attendance */}
          <StepAttendance
            workingDays={workingDays}
            onChangeWorkingDays={setWorkingDays}
            presentDays={presentDays}
            onChangePresentDays={setPresentDays}
            paidLeave={paidLeave}
            onChangePaidLeave={setPaidLeave}
            unpaidLeave={unpaidLeave}
            onChangeUnpaidLeave={setUnpaidLeave}
            holidays={holidays}
            onChangeHolidays={setHolidays}
            payableDays={calculation.payable_days}
            validationErrors={calculation.validationErrors}
          />

          {/* Step 3: Earnings */}
          <StepEarnings
            baseSalary={baseSalary}
            onChangeBaseSalary={setBaseSalary}
            lossOfPay={calculation.loss_of_pay}
            adjustedBaseSalary={calculation.adjusted_base_salary}
            hra={hra}
            onChangeHra={setHra}
            busPassEnabled={busPassEnabled}
            onToggleBusPass={setBusPassEnabled}
            busPass={busPass}
            onChangeBusPass={setBusPass}
            travelAllowance={travelAllowance}
            onChangeTravelAllowance={setTravelAllowance}
            otherAllowance={otherAllowance}
            onChangeOtherAllowance={setOtherAllowance}
            bonus={bonus}
            onChangeBonus={setBonus}
            overtime={overtime}
            onChangeOvertime={setOvertime}
            otherEarnings={otherEarnings}
            onChangeOtherEarnings={setOtherEarnings}
            grossSalary={calculation.gross_salary}
          />

          {/* Step 4: Deductions */}
          <StepDeductions
            pfEnabled={pfEnabled}
            onTogglePf={setPfEnabled}
            pf={pf}
            onChangePf={setPf}
            esiEnabled={esiEnabled}
            onToggleEsi={setEsiEnabled}
            esi={esi}
            onChangeEsi={setEsi}
            ptEnabled={ptEnabled}
            onTogglePt={setPtEnabled}
            pt={pt}
            onChangePt={setPt}
            tdsEnabled={tdsEnabled}
            onToggleTds={setTdsEnabled}
            tds={tds}
            onChangeTds={setTds}
            advanceEnabled={advanceEnabled}
            onToggleAdvance={setAdvanceEnabled}
            advance={advance}
            onChangeAdvance={setAdvance}
            loanEnabled={loanEnabled}
            onToggleLoan={setLoanEnabled}
            loan={loan}
            onChangeLoan={setLoan}
            otherDeductionEnabled={otherDeductionEnabled}
            onToggleOtherDeduction={setOtherDeductionEnabled}
            otherDeduction={otherDeduction}
            onChangeOtherDeduction={setOtherDeduction}
            totalDeductions={calculation.total_deductions}
          />
        </div>

        {/* Right Sticky Column: Live Calculation Summary */}
        <div className="lg:col-span-4">
          <LiveSalarySummary
            calculation={calculation}
            onPreview={handlePreview}
            onSubmit={handleSavePayroll}
            isSubmitting={isSubmitting}
            isEditingExisting={Boolean(existingPayroll)}
          />
        </div>
      </div>
    </div>
  );
};
