// frontend/src/components/admin/ReportItem.tsx
interface ReportItemProps {
    report: any;
    onAction: (reportId: string, action: string) => void;
  }
  
  const ReportItem = ({ report, onAction }: ReportItemProps) => {
    return (
      <div className="border rounded-lg p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2">
              <Badge variant={getReportTypeBadge(report.reason)}>
                {getReportTypeLabel(report.reason)}
              </Badge>
              <span className="text-sm text-gray-500">
                {new Date(report.created_at).toLocaleString('fa-IR')}
              </span>
            </div>
            <p className="mt-2">{report.description}</p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="success"
              size="sm"
              onClick={() => onAction(report._id, 'approve')}
            >
              تایید
            </Button>
            <Button
              variant="error"
              size="sm"
              onClick={() => onAction(report._id, 'reject')}
            >
              رد
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onAction(report._id, 'details')}
            >
              جزئیات
            </Button>
          </div>
        </div>
  
        <div className="mt-4 bg-gray-50 rounded p-3">
          <div className="text-sm text-gray-600">
            <strong>محتوای گزارش شده:</strong>
            <p className="mt-1">{report.content.text}</p>
          </div>
          <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500">
            <img
              src={report.content.author.avatar}
              alt=""
              className="w-5 h-5 rounded-full"
            />
            <span>{report.content.author.name}</span>
          </div>
        </div>
      </div>
    );
  };