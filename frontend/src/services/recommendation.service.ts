// frontend/src/services/recommendation.service.ts
import { api } from '@/config/axios';

export class RecommendationService {
  async getPersonalizedRecommendations(userId: string) {
    return api.get(`/api/recommendations/personalized/${userId}`);
  }

  async getContextualRecommendations(context: {
    currentProduct?: string;
    category?: string;
    searchQuery?: string;
    projectType?: string;
  }) {
    return api.get('/api/recommendations/contextual', { params: context });
  }

  async trackUserInteraction(data: {
    userId: string;
    itemId: string;
    interactionType: 'view' | 'cart' | 'purchase' | 'favorite';
    timestamp: number;
    metadata?: Record<string, any>;
  }) {
    return api.post('/api/recommendations/track', data);
  }
}
