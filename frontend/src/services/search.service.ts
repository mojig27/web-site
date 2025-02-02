// frontend/src/services/search.service.ts
import { api } from './api.service';

export const searchService = {
  // ... سایر متدها

  export: (options: { ids: string[]; format: string }) =>
    api.post('/search/export', options, {
      responseType: 'blob'
    }),
  
  getAnalytics: (contentId: string, period: string = '30d') =>
    api.get(`/content/${contentId}/analytics`, {
      params: { period }
    })
};