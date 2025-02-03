
// backend/app/services/optimization_service.py
from typing import Dict, List
from datetime import datetime, timedelta
from app.models import Project, Estimation, Optimization
from app.utils.optimization import OptimizationAlgorithm

class OptimizationService:
    def __init__(self):
        self.algorithm = OptimizationAlgorithm()

    async def generate_optimizations(
        self,
        project_id: str,
        current_estimation: Dict
    ) -> List[Dict]:
        """Generate possible optimization scenarios"""
        project = await Project.get(project_id)
        
        optimizations = []
        
        # Cost optimization
        cost_opt = await self._optimize_costs(project, current_estimation)
        optimizations.append(cost_opt)
        
        # Timeline optimization
        time_opt = await self._optimize_timeline(project, current_estimation)
        optimizations.append(time_opt)
        
        # Balanced optimization
        balanced_opt = await self._optimize_balanced(project, current_estimation)
        optimizations.append(balanced_opt)
        
        return optimizations

    async def compare_estimations(
        self,
        project_id: str,
        current_id: str,
        optimization_id: str
    ) -> Dict:
        """Compare current estimation with optimized version"""
        current = await Estimation.get(current_id)
        optimized = await Optimization.get(optimization_id)
        
        comparison = {
            "costs": {
                "current": self._prepare_cost_data(current),
                "optimized": self._prepare_cost_data(optimized)
            },
            "timeline": {
                "current": self._prepare_timeline_data(current),
                "optimized": self._prepare_timeline_data(optimized)
            },
            "resources": {
                "current": self._prepare_resource_data(current),
                "optimized": self._prepare_resource_data(optimized)
            },
            "savings": self._calculate_savings(current, optimized)
        }
        
        return comparison

    async def _optimize_costs(
        self,
        project: Project,
        estimation: Dict
    ) -> Dict:
        """Generate cost-focused optimization"""
        optimization = {
            "type": "cost",
            "changes": []
        }
        
        # Analyze material costs
        material_changes = await self._optimize_material_costs(
            estimation["materials"]
        )
        optimization["changes"].extend(material_changes)
        
        # Analyze labor costs
        labor_changes = await self._optimize_labor_costs(
            estimation["labor"]
        )
        optimization["changes"].extend(labor_changes)
        
        # Calculate potential savings
        optimization["savings"] = self._calculate_potential_savings(
            optimization["changes"]
        )
        
        return optimization

    async def _optimize_timeline(
        self,
        project: Project,
        estimation: Dict
    ) -> Dict:
        """Generate timeline-focused optimization"""
        optimization = {
            "type": "timeline",
            "changes": []
        }
        
        # Analyze task dependencies
        dependency_changes = await self._optimize_dependencies(
            estimation["timeline"]
        )
        optimization["changes"].extend(dependency_changes)
        
        # Analyze resource allocation
        resource_changes = await self._optimize_resource_allocation(
            estimation["resources"]
        )
        optimization["changes"].extend(resource_changes)
        
        # Calculate time savings
        optimization["timeSaved"] = self._calculate_time_savings(
            optimization["changes"]
        )
        
        return optimization

    async def _optimize_balanced(
        self,
        project: Project,
        estimation: Dict
    ) -> Dict:
        """Generate balanced optimization (cost vs. time)"""
        optimization = {
            "type": "balanced",
            "changes": []
        }
        
        # Run multi-objective optimization
        balanced_changes = await self.algorithm.optimize_multi_objective(
            estimation,
            weights={
                "cost": 0.5,
                "time": 0.5
            }
        )
        
        optimization["changes"] = balanced_changes
        optimization["balance_score"] = self._calculate_balance_score(
            balanced_changes
        )
        
        return optimization