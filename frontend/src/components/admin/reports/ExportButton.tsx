
// frontend/src/components/admin/reports/ExportButton.tsx
interface ExportButtonProps {
    type: string;
    dateRange: {
      from: Date;
      to: Date;
    };
  }
  
  export const ExportButton: React.FC<ExportButtonProps> = ({ type, dateRange }) => {
    const [exporting, setExporting] = useState(false);
  
    const handleExport = async () => {
      try {
        setExporting(true);
        const response = await reportService.exportToExcel(type, dateRange);
        
        // دانلود فایل
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${type}-report.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        console.error('Error exporting report:', error);
      } finally {
        setExporting(false);
      }
    };
  
    return (
      <button
        onClick={handleExport}
        disabled={exporting}
        className={`
          px-4 py-2 bg-green-600 text-white rounded-md
          ${exporting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}
        `}
      >
        {exporting ? 'در حال آماده‌سازی...' : 'دانلود اکسل'}
      </button>
    );
  };