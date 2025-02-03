// backend/app/services/comparison_service.py
from typing import Dict, List
import pandas as pd
import numpy as np
from app.models import Project, Metric
from app.utils.statistics import StatisticalAnalysis

class ComparisonService:
    def __init__(self):
        self.stats = StatisticalAnalysis()

    async def compare_projects(
        self,
        project_ids: List[str]
    ) -> Dict:
        """Generate comprehensive project comparison"""
        projects = await self._get_projects_data(project_ids)
        benchmarks = await self._get_industry_benchmarks(projects)
        
        comparison = {
            "metrics": self._compare_metrics(projects, benchmarks),
            "timeline": await self._compare_timelines(projects),
            "costs": await self._compare_costs(projects),
            "risks": await self._compare_risks(projects),
            "performance": await self._compare_performance(projects),
            "variance": self._analyze_variance(projects)
        }
        
        return comparison

    async def _compare_metrics(
        self,
        projects: List[Dict],
        benchmarks: Dict
    ) -> Dict:
        """Compare key metrics across projects"""
        metrics = {}
        
        for metric in ['progress', 'costEfficiency', 'riskIndex']:
            metrics[metric] = {
                "values": [p[metric] for p in projects],
                "benchmark": benchmarks[metric],
                "analysis": self.stats.analyze_metric(
                    [p[metric] for p in projects],
                    benchmarks[metric]
                )
            }
            
        return metrics

    def _analyze_variance(
        self,
        projects: List[Dict]
    ) -> Dict:
        """Analyze variances between projects"""
        variances = {
            "schedule": self._analyze_schedule_variance(projects),
            "cost": self._analyze_cost_variance(projects),
            "quality": self._analyze_quality_variance(projects)
        }
        
        # Calculate significance
        for key in variances:
            variances[key]["significance"] = self.stats.calculate_significance(
                variances[key]["data"]
            )
            
        return variances

# backend/app/services/alert_service.py
class SmartAlertService:
    def __init__(self):
        self.threshold_engine = ThresholdEngine()
        self.pattern_detector = PatternDetector()

    async def process_metrics(
        self,
        metrics: Dict
    ) -> List[Dict]:
        """Process metrics and generate smart alerts"""
        alerts = []
        
        # Check thresholds
        threshold_alerts = await self.threshold_engine.check_thresholds(metrics)
        alerts.extend(threshold_alerts)
        
        # Detect patterns
        pattern_alerts = await self.pattern_detector.detect_patterns(metrics)
        alerts.extend(pattern_alerts)
        
        # Analyze trends
        trend_alerts = await self._analyze_trends(metrics)
        alerts.extend(trend_alerts)
        
        return self._prioritize_alerts(alerts)

    def _prioritize_alerts(
        self,
        alerts: List[Dict]
    ) -> List[Dict]:
        """Prioritize alerts based on severity and impact"""
        for alert in alerts:
            alert["priority"] = self._calculate_priority(alert)
            
        return sorted(
            alerts,
            key=lambda x: x["priority"],
            reverse=True
        )