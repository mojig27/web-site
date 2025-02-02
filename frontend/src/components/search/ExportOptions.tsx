
// frontend/src/components/search/ExportOptions.tsx
interface ExportOptionsProps {
    open: boolean;
    onClose: () => void;
    onExport: (format: string) => void;
  }
  
  export const ExportOptions = ({
    open,
    onClose,
    onExport
  }: ExportOptionsProps) => {
    const formats = [
      {
        id: 'pdf',
        label: 'PDF',
        description: 'مناسب برای چاپ و مطالعه'
      },
      {
        id: 'word',
        label: 'Word',
        description: 'مناسب برای ویرایش محتوا'
      },
      {
        id: 'excel',
        label: 'Excel',
        description: 'مناسب برای داده‌های جدولی'
      },
      {
        id: 'json',
        label: 'JSON',
        description: 'مناسب برای توسعه‌دهندگان'
      }
    ];
  
    return (
      <Modal
        open={open}
        onClose={onClose}
        title="خروجی گرفتن"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-500">
            فرمت مورد نظر خود را برای خروجی انتخاب کنید
          </p>
  
          <div className="grid grid-cols-1 gap-4">
            {formats.map((format) => (
              <button
                key={format.id}
                className="flex items-center p-4 border rounded-lg hover:bg-gray-50"
                onClick={() => {
                  onExport(format.id);
                  onClose();
                }}
              >
                <div className="mr-4">
                  <h4 className="font-medium">{format.label}</h4>
                  <p className="text-sm text-gray-500">{format.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </Modal>
    );
  };
  