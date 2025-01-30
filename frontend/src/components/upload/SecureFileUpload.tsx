import React, { useState, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { FiUpload, FiFile, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

interface FileStatus {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export const SecureFileUpload: React.FC = () => {
  const [files, setFiles] = useState<FileStatus[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      progress: 0,
      status: 'pending' as const,
      file
    }));

    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ALLOWED_TYPES.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize: MAX_SIZE,
    multiple: true,
    maxFiles: 5,
    onDropRejected: (rejectedFiles) => {
      rejectedFiles.forEach(({ file, errors }) => {
        errors.forEach(error => {
          switch (error.code) {
            case 'file-too-large':
              toast.error(`File "${file.name}" is too large. Max size is 10MB`);
              break;
            case 'file-invalid-type':
              toast.error(`File "${file.name}" has invalid type`);
              break;
            default:
              toast.error(`Error uploading "${file.name}": ${error.message}`);
          }
        });
      });
    }
  });

  const uploadFile = async (fileStatus: FileStatus & { file: File }) => {
    const formData = new FormData();
    formData.append('file', fileStatus.file);

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        signal: abortControllerRef.current.signal,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setFiles(prev => prev.map(f => 
              f.id === fileStatus.id ? { ...f, progress } : f
            ));
          }
        }
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();

      setFiles(prev => prev.map(f => 
        f.id === fileStatus.id 
          ? { ...f, status: 'success' as const } 
          : f
      ));

      toast.success(`File "${fileStatus.name}" uploaded successfully`);
    } catch (error) {
      if (error.name === 'AbortError') {
        setFiles(prev => prev.filter(f => f.id !== fileStatus.id));
        return;
      }

      setFiles(prev => prev.map(f => 
        f.id === fileStatus.id 
          ? { ...f, status: 'error' as const, error: error.message } 
          : f
      ));

      toast.error(`Failed to upload "${fileStatus.name}": ${error.message}`);
    }
  };

  const uploadAllFiles = async () => {
    setIsUploading(true);
    try {
      await Promise.all(
        files
          .filter(f => f.status === 'pending')
          .map(uploadFile)
      );
    } finally {
      setIsUploading(false);
    }
  };

  const cancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  return (
    <div className="p-6">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
        `}
      >
        <input {...getInputProps()} />
        <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Drag 'n' drop files here, or click to select files
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Supported files: JPEG, PNG, GIF, PDF, TXT (Max 10MB)
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-6">
          <div className="space-y-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="bg-white rounded-lg shadow p-4 flex items-center"
              >
                <FiFile className="h-6 w-6 text-gray-400 mr-3" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  {file.status === 'uploading' && (
                    <div className="mt-2 relative pt-1">
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-200">
                        <div
                          className="transition-all duration-300 ease-out 
                            shadow-none flex flex-col text-center 
                            whitespace-nowrap text-white justify-center bg-blue-500"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                {file.status === 'success' && (
                  <FiCheckCircle className="h-5 w-5 text-green-500" />
                )}
                {file.status === 'error' && (
                  <FiAlertCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={cancelUpload}
              disabled={!isUploading}
              className="px-4 py-2 border rounded-md text-sm font-medium
                text-gray-700 bg-white hover:bg-gray-50
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={uploadAllFiles}
              disabled={isUploading || files.length === 0}
              className="px-4 py-2 border rounded-md text-sm font-medium
                text-white bg-blue-600 hover:bg-blue-700
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Upload All Files
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
// در SecureFileUpload.tsx
// اضافه کردن state جدید
const [editingFile, setEditingFile] = useState<File | null>(null);

// اضافه کردن handler برای ویرایش تصویر
const handleEditImage = (file: File) => {
  if (file.type.startsWith('image/')) {
    setEditingFile(file);
  }
};

// اضافه کردن handler برای ذخیره تصویر ویرایش شده
const handleSaveEdit = async (editedBlob: Blob) => {
  const editedFile = new File([editedBlob], editingFile!.name, {
    type: editingFile!.type
  });
  
  setFiles(prev => prev.map(f => 
    f.file === editingFile
      ? { ...f, file: editedFile }
      : f
  ));
  
  setEditingFile(null);
};

// در بخش render اضافه کردن
{editingFile && (
  <ImageEditor
    imageUrl={URL.createObjectURL(editingFile)}
    onSave={handleSaveEdit}
    onCancel={() => setEditingFile(null)}
  />
)}