
# backend/app/services/optimization_recommendation.py
class OptimizationRecommendationService:
    def __init__(self):
        self.optimization_engine = OptimizationEngine()

    async def generate_recommendations(
        self,
        project_id: str
    ) -> List[Dict]:
        """Generate optimization recommendations"""
        project_data = await self._get_project_data(project_id)
        
        recommendations = []
        
        # Cost optimizations
        cost_recs = await self._generate_cost_recommendations(project_data)
        recommendations.extend(cost_recs)
        
        # Timeline optimizations
        timeline_recs = await self._generate_timeline_recommendations(project_data)
        recommendations.extend(timeline_recs)
        
        # Resource optimizations
        resource_recs = await self._generate_resource_recommendations(project_data)
        recommendations.extend(resource_recs)
        
        return self._prioritize_recommendations(recommendations)

    def _prioritize_recommendations(
        self,
        recommendations: List[Dict]
    ) -> List[Dict]:
        """Prioritize recommendations based on impact and effort"""
        for rec in recommendations:
            rec["priority_score"] = self._calculate_priority_score(
                rec["impact"],
                rec["effort"],
                rec["urgency"]
            )
            
        return sorted(
            recommendations,
            key=lambda x: x["priority_score"],
            reverse=True
        )