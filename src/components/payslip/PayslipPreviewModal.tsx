import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { PayslipDocument } from './PayslipDocument';
import { PayrollRecord } from '../../types/payroll';
import { useData } from '../../context/DataContext';
import { generatePayslipPDF, printElement } from '../../utils/pdfGenerator';
import { Download, Printer, CheckCircle, FileText, Share2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface PayslipPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  payroll: PayrollRecord | null;
}

export const PayslipPreviewModal: React.FC<PayslipPreviewModalProps> = ({
  isOpen,
  onClose,
  payroll,
}) => {
  const { companySettings } = useData();
  const { showToast } = useToast();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  if (!payroll) return null;

  const empId = payroll.employee?.employee_id || payroll.employee_id;
  const containerId = 'payslip-print-modal-container';

  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);
    try {
      const success = await generatePayslipPDF(containerId, {
        employeeId: empId,
        month: payroll.month,
        year: payroll.year,
        filename: `Payslip_${empId}_${payroll.month}_${payroll.year}.pdf`,
      });

      if (success) {
        showToast(`Downloaded Payslip_${empId}_${payroll.month}_${payroll.year}.pdf`, 'success');
      } else {
        showToast('Failed to generate PDF. You can try Print to PDF.', 'error');
      }
    } catch (err) {
      console.error('PDF error:', err);
      showToast('Error generating PDF', 'error');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    printElement(containerId);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Salary Slip — ${payroll.month} ${payroll.year}`}
      subtitle={`Employee: ${payroll.employee ? `${payroll.employee.first_name} ${payroll.employee.last_name}` : empId} (${empId})`}
      maxWidth="4xl"
    >
      <div className="space-y-4">
        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/80 gap-2">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>Format: Standard Corporate A4</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>

            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition shadow-xs shadow-emerald-600/20 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              {isGeneratingPdf ? 'Generating PDF...' : 'Download PDF'}
            </button>
          </div>
        </div>

        {/* Payslip Document Render Box */}
        <div className="bg-slate-100/70 p-2 sm:p-4 rounded-2xl overflow-x-auto">
          <PayslipDocument
            elementId={containerId}
            payroll={payroll}
            company={companySettings}
          />
        </div>
      </div>
    </Modal>
  );
};
