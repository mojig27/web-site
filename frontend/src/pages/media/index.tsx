
// frontend/src/pages/media/index.tsx
import { useState, useEffect } from 'react';
import { Layout } from '@/components/common/Layout';
import { MediaGrid } from '@/components/media/MediaGrid';
import { MediaUploader } from '@/components/media/MediaUploader';
import { mediaService } from '@/services/media.service';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FolderForm } from '@/components/media/FolderForm';

export default function MediaLibrary() {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<any[]>([]);
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchFiles();
  }, [currentFolder]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await mediaService.getAll({
        folder: currentFolder,
        sort: 'created_at:desc'
      });
      setFiles(response.data);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadComplete = () => {
    fetchFiles();
  };

  const handleFileSelect = (id: string) => {
    setSelectedFiles(prev => {
      if (prev.includes(id)) {
        return prev.filter(fileId => fileId !== id);
      }
      return [...prev, id];
    });
  };

  const handleDelete = async () => {
    if (!selectedFiles.length) return;
    
    if (window.confirm(`آیا از حذف ${selectedFiles.length} فایل انتخاب شده اطمینان دارید؟`)) {
      try {
        await Promise.all(
          selectedFiles.map(id => mediaService.delete(id))
        );
        setSelectedFiles([]);
        fetchFiles();
      } catch (error) {
        console.error('Error deleting files:', error);
      }
    }
  };

  const handleCreateFolder = async (name: string) => {
    try {
      await mediaService.createFolder(name, currentFolder);
      setFolderModalOpen(false);
      fetchFiles();
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  const navigateToFolder = (folderId: string | null) => {
    setCurrentFolder(folderId);
    if (folderId === null) {
      setBreadcrumbs([]);
    } else {
      // Update breadcrumbs
      const folderData = files.find(f => f.id === folderId);
      if (folderData) {
        setBreadcrumbs(prev => [...prev, folderData]);
      }
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">کتابخانه رسانه</h1>
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              onClick={() => setView(prev => prev === 'grid' ? 'list' : 'grid')}
            >
              {view === 'grid' ? 'نمایش لیستی' : 'نمایش شبکه‌ای'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setFolderModalOpen(true)}
            >
              پوشه جدید
            </Button>
            {selectedFiles.length > 0 && (
              <Button
                variant="danger"
                onClick={handleDelete}
              >
                حذف ({selectedFiles.length})
              </Button>
            )}
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-sm">
          <button
            onClick={() => navigateToFolder(null)}
            className="text-blue-600 hover:underline"
          >
            خانه
          </button>
          {breadcrumbs.map((folder, index) => (
            <div key={folder.id} className="flex items-center">
              <span className="mx-2 text-gray-500">/</span>
              <button
                onClick={() => navigateToFolder(folder.id)}
                className="text-blue-600 hover:underline"
              >
                {folder.name}
              </button>
            </div>
          ))}
        </div>

        <MediaUploader
          onUploadComplete={handleUploadComplete}
          currentFolder={currentFolder}
        />

        <MediaGrid
          files={files}
          loading={loading}
          view={view}
          selectedFiles={selectedFiles}
          onFileSelect={handleFileSelect}
          onFolderClick={navigateToFolder}
        />

        <Modal
          open={folderModalOpen}
          onClose={() => setFolderModalOpen(false)}
          title="ایجاد پوشه جدید"
        >
          <FolderForm
            onSubmit={handleCreateFolder}
            onCancel={() => setFolderModalOpen(false)}
          />
        </Modal>
      </div>
    </Layout>
  );
}
