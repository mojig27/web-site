
// frontend/src/utils/printInvoice.ts
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const printInvoice = async (elementId: string) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) return;

    // برای چاپ مستقیم
    if (window.print) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = element.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;
      return;
    }

    // تبدیل به PDF
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true
    });

    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const ratio = canvas.width / canvas.height;
    const imgWidth = pageWidth;
    const imgHeight = pageWidth / ratio;

    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
    pdf.save('invoice.pdf');
  } catch (error) {
    console.error('Error generating invoice:', error);
  }
};