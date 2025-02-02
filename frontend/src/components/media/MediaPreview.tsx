// frontend/src/components/media/MediaPreview.tsx
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ImageEditor } from '@/components/media/ImageEditor';
import { mediaService } from '@/services/media.service';

interface MediaPreviewProps {
  file: any;
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const MediaPreview = ({
  file,
  open,
  onClose,
  onUpdate
}: MediaPreviewProps) => {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSaveEdit = async (editedImage: File) => {
    try {
      setLoading(true);
      await mediaService.update(file.id, editedImage);
      setEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating image:', error);
    } finally {
      setLoading(false);
    }
  };

  const isImage = file?.type?.startsWith('image/');

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? 'ویرایش تصویر' : 'پیش‌نمایش فایل'}
      size="lg"
    >
      <div className="space-y-4">
        {editing && isImage ? (
          <ImageEditor
            image={file.url}
            onSave={handleSaveEdit}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <div className="space-y-4">
            {/* Preview content */}
            <div className="bg-gray-50 rounded-lg p-4">
              {isImage ? (
                <img
                  src={file.url}
                  alt={file.name}
                  className="max-h-96 mx-auto"
                />
              ) : (
                <div className="text-center p-8">
                  <FileIcon className="w-16 h-16 mx-auto text-gray-400" />
                  <p className="mt-2">{file.name}</p>
                </div>
              )}
            </div>

            {/* File details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">نام فایل</p>
                <p className="text-gray-600">{file.name}</p>
              </div>
              <div>
                <p className="font-medium">نوع فایل</p>
                <p className="text-gray-600">{file.type}</p>
              </div>
              <div>
                <p className="font-medium">اندازه</p>
                <p className="text-gray-600">{formatFileSize(file.size)}</p>
              </div>
              <div>
                <p className="font-medium">تاریخ آپلود</p>
                <p className="text-gray-600">
                  {new Date(file.created_at).toLocaleDateString('fa-IR')}
                </p>
              </div>
              {file.dimensions && (
                <div>
                  <p className="font-medium">ابعاد</p>
                  <p className="text-gray-600">
                    {file.dimensions.width} × {file.dimensions.height}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2">
              {isImage && (
                <Button
                  variant="secondary"
                  onClick={() => setEditing(true)}
                >
                  ویرایش تصویر
                </Button>
              )}
              <Button
                variant="primary"
                onClick={() => window.open(file.url, '_blank')}
              >
                دانلود
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
