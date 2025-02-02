
// frontend/src/services/media.service.ts
import { api } from './api.service';

export const mediaService = {
  upload: (file: File, path: string = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);
    
    return api.post('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  getAll: (params?: any) => 
    api.get('/media', { params }),
  
  delete: (id: string) => 
    api.delete(`/media/${id}`),
  
  createFolder: (name: string, parent?: string) => 
    api.post('/media/folders', { name, parent }),
  
  optimize: (id: string, options: any) => 
    api.post(`/media/${id}/optimize`, options)
};