// frontend/src/services/content.service.ts
import { api } from './api.service';

export const contentService = {
  getAll: (type: string, params?: any) => 
    api.get(`/content/${type}`, { params }),
  
  getById: (id: string) => 
    api.get(`/content/${id}`),
  
  create: (data: any) => 
    api.post('/content', data),
  
  update: (id: string, data: any) => 
    api.put(`/content/${id}`, data),
  
  delete: (id: string) => 
    api.delete(`/content/${id}`),
  
  publish: (id: string) => 
    api.post(`/content/${id}/publish`),
  
  unpublish: (id: string) => 
    api.post(`/content/${id}/unpublish`)
};