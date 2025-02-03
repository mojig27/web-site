
// backend/app/services/project_estimator.py
from datetime import datetime, timedelta
from typing import Dict, List, Tuple
from app.models import Project, Material, Labor
from app.utils.optimization import OptimizationEngine

class ProjectEstimator:
    def __init__(self):
        self.optimization_engine = OptimizationEngine()

    async def calculate_project_estimates(
        self,
        project_id: str,
        materials: List[Dict]
    ) -> Tuple[Dict, List[Dict]]:
        """Calculate cost and timeline estimates for a project"""
        project = await Project.get(project_id)
        
        # Calculate costs
        costs = await self._calculate_costs(materials, project)
        
        # Generate timeline
        timeline = await self._generate_timeline(materials, project)
        
        # Optimize resources
        optimized = await self._optimize_resources(costs, timeline)
        
        return optimized

    async def _calculate_costs(
        self,
        materials: List[Dict],
        project: Project
    ) -> Dict:
        """Calculate detailed cost breakdown"""
        costs = {
            "materials": await self._calculate_material_costs(materials),
            "labor": await self._calculate_labor_costs(materials, project),
            "equipment": await self._calculate_equipment_costs(materials, project),
            "overhead": await self._calculate_overhead_costs(project)
        }
        
        # Apply regional adjustments
        costs = await self._apply_regional_factors(costs, project.location)
        
        # Calculate margins and contingency
        costs["contingency"] = self._calculate_contingency(costs)
        costs["margin"] = self._calculate_margin(costs, project.type)
        
        return costs

    async def _generate_timeline(
        self,
        materials: List[Dict],
        project: Project
    ) -> List[Dict]:
        """Generate project timeline with dependencies"""
        tasks = []
        
        # Group materials by phase
        phases = self._group_by_phase(materials)
        
        current_date = project.start_date
        for phase in phases:
            phase_tasks = await self._generate_phase_tasks(
                phase,
                current_date,
                project
            )
            
            # Add dependencies
            phase_tasks = self._add_task_dependencies(phase_tasks)
            
            tasks.extend(phase_tasks)
            current_date = self._get_phase_end_date(phase_tasks)
            
        return tasks

    async def _optimize_resources(
        self,
        costs: Dict,
        timeline: List[Dict]
    ) -> Tuple[Dict, List[Dict]]:
        """Optimize resource allocation and scheduling"""
        # Create optimization model
        model = self.optimization_engine.create_model(costs, timeline)
        
        # Add constraints
        self._add_resource_constraints(model)
        self._add_timeline_constraints(model)
        
        # Optimize
        result = await self.optimization_engine.solve(model)
        
        # Apply optimizations
        optimized_costs = self._apply_cost_optimizations(costs, result)
        optimized_timeline = self._apply_timeline_optimizations(timeline, result)
        
        return optimized_costs, optimized_timeline

    def _calculate_contingency(self, costs: Dict) -> float:
        """Calculate contingency based on project complexity"""
        base_costs = sum(costs.values())
        risk_factor = self._assess_risk_factor(costs)
        
        return base_costs * risk_factor * 0.1

    def _assess_risk_factor(self, costs: Dict) -> float:
        """Assess project risk factor"""
        factors = {
            "complexity": self._assess_complexity(costs),
            "duration": self._assess_duration(costs),
            "market": self._assess_market_conditions(),
            "technical": self._assess_technical_risk(costs)
        }
        
        return sum(factors.values()) / len(factors)

    async def _apply_regional_factors(
        self,
        costs: Dict,
        location: str
    ) -> Dict:
        """Apply regional cost adjustment factors"""
        factors = await self._get_regional_factors(location)
        
        return {
            category: amount * factors.get(category, 1)
            for category, amount in costs.items()
        }