
// backend/app/services/project_recommendation.py
from typing import Dict, List
import numpy as np
from app.models import Product, ProjectTemplate, MaterialRequirement

class ProjectRecommendationService:
    async def get_project_materials(
        self,
        project_type: str,
        project_size: Optional[float] = None,
        specifications: Optional[Dict] = None
    ) -> List[Dict]:
        """Calculate and recommend materials for a project"""
        
        # Get project template
        template = await ProjectTemplate.get_by_type(project_type)
        
        # Calculate base requirements
        base_materials = await self._calculate_base_materials(
            template,
            project_size
        )
        
        # Adjust for specifications
        if specifications:
            materials = await self._adjust_for_specifications(
                base_materials,
                specifications
            )
        else:
            materials = base_materials
            
        # Get product recommendations
        return await self._get_product_recommendations(materials)
        
    async def _calculate_base_materials(
        self,
        template: ProjectTemplate,
        project_size: Optional[float]
    ) -> List[Dict]:
        """Calculate base material requirements"""
        materials = []
        
        for requirement in template.requirements:
            quantity = requirement.base_quantity
            
            if project_size:
                quantity *= self._calculate_size_factor(
                    requirement,
                    project_size
                )
                
            materials.append({
                "category": requirement.category,
                "type": requirement.material_type,
                "quantity": quantity,
                "unit": requirement.unit,
                "priority": requirement.priority
            })
            
        return materials
        
    async def _adjust_for_specifications(
        self,
        materials: List[Dict],
        specifications: Dict
    ) -> List[Dict]:
        """Adjust material requirements based on specifications"""
        adjusted = []
        
        for material in materials:
            # Apply quality adjustments
            if specifications.get("quality_level"):
                material = self._adjust_for_quality(
                    material,
                    specifications["quality_level"]
                )
                
            # Apply style adjustments
            if specifications.get("style"):
                material = self._adjust_for_style(
                    material,
                    specifications["style"]
                )
                
            # Apply climate adjustments
            if specifications.get("climate"):
                material = self._adjust_for_climate(
                    material,
                    specifications["climate"]
                )
                
            adjusted.append(material)
            
        return adjusted
        
    async def _get_product_recommendations(
        self,
        materials: List[Dict]
    ) -> List[Dict]:
        """Get specific product recommendations for materials"""
        recommendations = []
        
        for material in materials:
            products = await Product.find_by_specifications(
                category=material["category"],
                material_type=material["type"],
                quantity_needed=material["quantity"]
            )
            
            # Sort and filter products
            suitable_products = self._rank_products(products, material)
            
            recommendations.append({
                **material,
                "products": suitable_products[:3]  # Top 3 recommendations
            })
            
        return recommendations