
// backend/app/services/risk_management.py
from typing import Dict, List
from datetime import datetime
from app.models import Project, Risk, Mitigation
from app.utils.risk_analysis import RiskAnalyzer

class RiskManagementService:
    def __init__(self):
        self.analyzer = RiskAnalyzer()

    async def analyze_project_risks(
        self,
        project_id: str
    ) -> Dict:
        """Analyze project risks comprehensively"""
        project = await Project.get(project_id)
        
        # Identify risks
        identified_risks = await self._identify_risks(project)
        
        # Assess risks
        assessed_risks = await self._assess_risks(identified_risks)
        
        # Generate mitigation strategies
        mitigations = await self._generate_mitigations(assessed_risks)
        
        # Calculate risk metrics
        metrics = self._calculate_risk_metrics(assessed_risks)
        
        return {
            "risks": assessed_risks,
            "mitigations": mitigations,
            "metrics": metrics
        }

    async def _identify_risks(
        self,
        project: Project
    ) -> List[Dict]:
        """Identify potential project risks"""
        risks = []
        
        # Technical risks
        risks.extend(await self._identify_technical_risks(project))
        
        # Supply chain risks
        risks.extend(await self._identify_supply_risks(project))
        
        # Financial risks
        risks.extend(await self._identify_financial_risks(project))
        
        # Timeline risks
        risks.extend(await self._identify_timeline_risks(project))
        
        return risks

    async def _assess_risks(
        self,
        risks: List[Dict]
    ) -> List[Dict]:
        """Assess identified risks"""
        assessed = []
        
        for risk in risks:
            assessment = {
                **risk,
                "probability": await self._calculate_probability(risk),
                "impact": await self._calculate_impact(risk),
                "severity": await self._calculate_severity(risk),
                "urgency": await self._calculate_urgency(risk)
            }
            
            assessed.append(assessment)
            
        return assessed

    async def _generate_mitigations(
        self,
        risks: List[Dict]
    ) -> List[Dict]:
        """Generate mitigation strategies for risks"""
        mitigations = []
        
        for risk in risks:
            strategies = await self._generate_risk_strategies(risk)
            
            mitigations.append({
                "risk_id": risk["id"],
                "strategies": strategies,
                "recommended": self._select_best_strategy(strategies)
            })
            
        return mitigations