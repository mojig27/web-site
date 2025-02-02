// frontend/src/pages/content/index.tsx
import { useState, useEffect } from 'react';
import { Layout } from '@/components/common/Layout';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ContentForm } from '@/components/content/ContentForm';
import { contentService } from '@/services/content.service';
import { Tabs } from '@/components/ui/Tabs';

export default function ContentManagement() {
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('posts');

  const tabs = [
    { id: 'posts', label: 'مقالات' },
    { id: 'pages', label: 'صفحات' },
    { id: 'products', label: 'محصولات' },
    { id: 'categories', label: 'دسته‌بندی‌ها' }
  ];

  const columns = [
    {
      key: 'title',
      title: 'عنوان',
      render: (value: string, record: any) => (
        <div className="flex items-center">
          {record.thumbnail && (
            <img
              src={record.thumbnail}
              alt={value}
              className="w-10 h-10 object-cover rounded mr-2"
            />
          )}
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-sm text-gray-500">
              {record.excerpt?.substring(0, 60)}...
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'status',
      title: 'وضعیت',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value === 'published' ? 'bg-green-100 text-green-800' : 
          value === 'draft' ? 'bg-gray-100 text-gray-800' : 
          'bg-yellow-100 text-yellow-800'
        }`}>
          {
            value === 'published' ? 'منتشر شده' :
            value === 'draft' ? 'پیش‌نویس' :
            'در انتظار تایید'
          }
        </span>
      )
    },
    {
      key: 'author',
      title: 'نویسنده',
      render: (value: any) => value?.name || '-'
    },
    {
      key: 'created_at',
      title: 'تاریخ ایجاد',
      render: (value: string) => new Date(value).toLocaleDateString('fa-IR')
    },
    {
      key: 'actions',
      title: 'عملیات',
      render: (_: any, record: any) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleEdit(record)}
          >
            ویرایش
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handlePreview(record)}
          >
            پیش‌نمایش
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(record.id)}
          >
            حذف
          </Button>
        </div>
      )
    }
  ];

  useEffect(() => {
    fetchContent();
  }, [activeTab]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await contentService.getAll(activeTab);
      setContent(response.data);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (content: any) => {
    setSelectedContent(content);
    setModalOpen(true);
  };

  const handlePreview = (content: any) => {
    window.open(`/preview/${content.type}/${content.id}`, '_blank');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('آیا از حذف این محتوا اطمینان دارید؟')) {
      try {
        await contentService.delete(id);
        await fetchContent();
      } catch (error) {
        console.error('Error deleting content:', error);
      }
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (selectedContent) {
        await contentService.update(selectedContent.id, data);
      } else {
        await contentService.create({ ...data, type: activeTab });
      }
      setModalOpen(false);
      setSelectedContent(null);
      await fetchContent();
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">مدیریت محتوا</h1>
          <Button onClick={() => setModalOpen(true)}>
            افزودن محتوای جدید
          </Button>
        </div>

        <Tabs
          tabs={tabs}
          active={activeTab}
          onChange={setActiveTab}
        />

        <Table
          columns={columns}
          data={content}
          loading={loading}
        />

        <Modal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedContent(null);
          }}
          title={selectedContent ? 'ویرایش محتوا' : 'افزودن محتوای جدید'}
        >
          <ContentForm
            type={activeTab}
            initialData={selectedContent}
            onSubmit={handleSubmit}
            onCancel={() => {
              setModalOpen(false);
              setSelectedContent(null);
            }}
          />
        </Modal>
      </div>
    </Layout>
  );
}

