// frontend/src/components/admin/ReportArchive.tsx
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { DataTable } from '@/components/ui/DataTable';
import { reportService } from '@/services/report.service';
import { Button } from '@/components/ui/Button';
import { formatBytes, formatDate } from '@/utils/format';

export const ReportArchive = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    period: 'all',
    type: 'all',
    startDate: null,
    endDate: null
  });

  const columns = [
    {
      title: 'تاریخ',
      key: 'created_at',
      render: (date: string) => formatDate(date)
    },
    {
      title: 'نوع گزارش',
      key: 'type',
      render: (type: string) => getReportTypeLabel(type)
    },
    {
      title: 'دوره',
      key: 'period',
      render: (period: any) => `${formatDate(period.start)} تا ${formatDate(period.end)}`
    },
    {
      title: 'حجم',
      key: 'size',
      render: (size: number) => formatBytes(size)
    },
    {
      title: 'عملیات',
      key: 'actions',
      render: (_, report: any) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleDownload(report)}
          >
            دانلود
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePreview(report)}
          >
            پیش‌نمایش
          </Button>
        </div>
      )
    }
  ];

  const handleDownload = async (report: any) => {
    try {
      const data = await reportService.downloadReport(report.id);
      // تبدیل به فایل و دانلود
      const blob = new Blob([data], { type: report.mimeType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${report.id}.${report.format}`;
      a.click();
    } catch (error) {
      toast.error('خطا در دانلود گزارش');
    }
  };

  const handleExport = async (format: string) => {
    try {
      await reportService.exportReport(selectedReports, format);
      toast.success('گزارش با موفقیت اکسپورت شد');
    } catch (error) {
      toast.error('خطا در اکسپورت گزارش');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">آرشیو گزارش‌ها</h3>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => handleExport('pdf')}
                disabled={!selectedReports.length}
              >
                اکسپورت PDF
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExport('excel')}
                disabled={!selectedReports.length}
              >
                اکسپورت Excel
              </Button>
            </div>
          </div>
          
          <DataTable
            columns={columns}
            data={reports}
            selectable
            onSelectionChange={setSelectedReports}
          />
        </div>
      </Card>
    </div>
  );
};
