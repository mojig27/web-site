// backend/app/services/recommendation_engine.py
from typing import List, Dict, Optional
import numpy as np
from scipy.sparse import csr_matrix
from implicit.als import AlternatingLeastSquares
from app.models import User, Product, Interaction
from app.utils.redis_cache import RedisCache

class RecommendationEngine:
    def __init__(self):
        self.model = AlternatingLeastSquares(
            factors=64,
            regularization=0.1,
            iterations=50
        )
        self.redis_cache = RedisCache()
        self.rebuild_interval = 3600  # 1 hour

    async def get_personalized_recommendations(
        self,
        user_id: str,
        n_items: int = 8
    ) -> List[Dict]:
        """Get personalized recommendations for a user"""
        # Check cache first
        cached = await self.redis_cache.get(f"recommendations:user:{user_id}")
        if cached:
            return cached

        # Get user interactions
        interactions = await self._get_user_interactions(user_id)
        
        # Build user profile
        user_profile = self._build_user_profile(interactions)
        
        # Get recommendations
        scores = self.model.recommend(
            userid=user_profile,
            user_items=interactions,
            N=n_items,
            filter_already_liked_items=True
        )

        # Convert to products
        products = await self._scores_to_products(scores)
        
        # Cache results
        await self.redis_cache.set(
            f"recommendations:user:{user_id}",
            products,
            expire=3600
        )

        return products

    async def get_contextual_recommendations(
        self,
        context: Dict,
        n_items: int = 8
    ) -> List[Dict]:
        """Get recommendations based on current context"""
        if context.get('currentProduct'):
            return await self._get_similar_products(
                context['currentProduct'],
                n_items
            )
        elif context.get('category'):
            return await self._get_category_recommendations(
                context['category'],
                n_items
            )
        elif context.get('projectType'):
            return await self._get_project_based_recommendations(
                context['projectType'],
                n_items
            )
        
        return await self._get_trending_products(n_items)

    async def track_interaction(self, interaction_data: Dict) -> None:
        """Track user interaction for improving recommendations"""
        await Interaction.create(**interaction_data)
        
        # Invalidate user's cached recommendations
        await self.redis_cache.delete(
            f"recommendations:user:{interaction_data['userId']}"
        )

        # Queue model update if needed
        await self._check_rebuild_model()

    async def _check_rebuild_model(self):
        """Check if model needs rebuilding"""
        last_build = await self.redis_cache.get("recommendations:last_build")
        if not last_build or (time.time() - float(last_build)) > self.rebuild_interval:
            await self._rebuild_model()

    async def _rebuild_model(self):
        """Rebuild the recommendation model"""
        # Get all interactions
        interactions = await self._get_all_interactions()
        
        # Convert to sparse matrix
        user_items = self._interactions_to_matrix(interactions)
        
        # Train model
        self.model.fit(user_items)
        
        # Update last build time
        await self.redis_cache.set(
            "recommendations:last_build",
            time.time(),
            expire=self.rebuild_interval
        )

    def _build_user_profile(self, interactions: List[Dict]) -> np.ndarray:
        """Build user profile from interactions"""
        return np.sum([
            interaction['weight'] * self._get_item_factors(interaction['itemId'])
            for interaction in interactions
        ], axis=0)