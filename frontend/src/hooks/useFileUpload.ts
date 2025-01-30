import { useState, useCallback } from 'react';

interface UploadOptions {
  url: string;
  maxSize?: number;
  allowedTypes?: string[];
  onProgress?: (progress: number) => void;
  onSuccess?: (response: any) => void;
  onError?: (error: Error) => void;
}

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const upload = useCallback(async (
    file: File,
    options: UploadOptions
  ) => {
    const {
      url,
      maxSize = 10 * 1024 * 1024,
      allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'],
      onProgress,
      onSuccess,
      onError
    } = options;

    // Validate file size
    if (file.size > maxSize) {
      const error = new Error(`File size exceeds ${maxSize / 1024 / 1024}MB limit`);
      onError?.(error);
      return;
    }

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      const error = new Error(`File type ${file.type} not allowed`);
      onError?.(error);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    setProgress(0);

    try {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentCompleted = Math.round((event.loaded * 100) / event.total);
          setProgress(percentCompleted);
          onProgress?.(percentCompleted);
        }
      });

      const response = await new Promise((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error(xhr.responseText));
          }
        };

        xhr.onerror = () => reject(new Error('Network error'));
        xhr.open('POST', url);
        xhr.send(formData);
      });

      onSuccess?.(response);
      return response;
    } catch (error) {
      onError?.(error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, []);

  return {
    upload,
    isUploading,
    progress
  };
};