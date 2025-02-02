// frontend/src/components/search/ResultDetails.tsx
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { ExportOptions } from './ExportOptions';
import { searchService } from '@/services/search.service';

interface ResultDetailsProps {
  content: any;
  open: boolean;
  onClose: () => void;
}

export const ResultDetails = ({
  content,
  open,
  onClose
}: ResultDetailsProps) => {
  const [activeTab, setActiveTab] = useState('details');
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const tabs = [
    { id: 'details', label: 'جزئیات' },
    { id: 'analytics', label: 'آمار بازدید' },
    { id: 'revisions', label: 'تاریخچه تغییرات' }
  ];

  const handleExport = async (format: string) => {
    try {
      const response = await searchService.export({
        ids: [content._id],
        format
      });
      
      // دانلود فایل
      const blob = new Blob([response.data], {
        type: response.headers['content-type']
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `export-${content._id}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting content:', error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={content?.title}
      size="xl"
    >
      <div className="space-y-6">
        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <Button
            variant="secondary"
            onClick={() => setExportModalOpen(true)}
          >
            خروجی گرفتن
          </Button>
          <Button
            variant="primary"
            onClick={() => window.open(`/${content.type}/${content.slug}`, '_blank')}
          >
            مشاهده
          </Button>
        </div>

        {/* Content Tabs */}
        <Tabs
          tabs={tabs}
          active={activeTab}
          onChange={setActiveTab}
        />

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">نوع محتوا</h4>
                  <p>{content.type}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">وضعیت</h4>
                  <p>{content.status}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">نویسنده</h4>
                  <p>{content.author?.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">تاریخ انتشار</h4>
                  <p>{new Date(content.created_at).toLocaleDateString('fa-IR')}</p>
                </div>
              </div>

              {/* Categories & Tags */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">دسته‌بندی‌ها</h4>
                <div className="flex flex-wrap gap-2">
                  {content.categories?.map((category: any) => (
                    <span
                      key={category._id}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">برچسب‌ها</h4>
                <div className="flex flex-wrap gap-2">
                  {content.tags?.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* SEO Info */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">اطلاعات SEO</h4>
                <div className="space-y-2">
                  <p><strong>عنوان متا:</strong> {content.meta?.title}</p>
                  <p><strong>توضیحات متا:</strong> {content.meta?.description}</p>
                  <p><strong>کلمات کلیدی:</strong> {content.meta?.keywords}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Analytics Charts */}
              <div className="grid grid-cols-2 gap-4">
                <VisitorsChart data={content.analytics?.visitors} />
                <PageviewsChart data={content.analytics?.pageviews} />
              </div>

              {/* Traffic Sources */}
              <div>
                <h4 className="text-lg font-medium mb-4">منابع ترافیک</h4>
                <TrafficSourcesTable data={content.analytics?.sources} />
              </div>
            </div>
          )}

          {activeTab === 'revisions' && (
            <div className="space-y-4">
              {content.revisions?.map((revision: any) => (
                <div
                  key={revision._id}
                  className="p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="font-medium">
                        {revision.author.name}
                      </span>
                      <span className="text-gray-500 mx-2">•</span>
                      <span className="text-gray-500">
                        {new Date(revision.created_at).toLocaleString('fa-IR')}
                      </span>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {/* Handle revision preview */}}
                    >
                      مشاهده تغییرات
                    </Button>
                  </div>
                  <p className="text-gray-600">{revision.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Export Modal */}
      <ExportOptions
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        onExport={handleExport}
      />
    </Modal>
  );
};

