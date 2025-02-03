from typing import Dict, List
from datetime import datetime, timedelta
from app.models import Project, Risk, Supplier, Transaction
from app.utils.analytics import AnalyticsEngine

class DashboardService:
    def __init__(self):
        self.analytics = AnalyticsEngine()

    async def get_dashboard_metrics(
        self,
        filters: Dict
    ) -> Dict:
        """Get comprehensive dashboard metrics"""
        period = filters.get('period', 'month')
        start_date = self._get_period_start(period)
        
        metrics = {
            "overview": await self._get_overview_metrics(start_date),
            "trends": await self._get_trend_metrics(start_date),
            "risks": await self._get_risk_metrics(start_date),
            "financial": await self._get_financial_metrics(start_date),
            "actions": await self._get_critical_actions()
        }
        
        return metrics

    async def _get_overview_metrics(
        self,
        start_date: datetime
    ) -> Dict:
        """Get overview metrics"""
        return {
            "activeProjects": await Project.count_active(),
            "criticalRisks": await Risk.count_critical(),
            "activeSuppliers": await Supplier.count_active(),
            "revenue": await Transaction.sum_revenue(start_date)
        }

    async def _get_trend_metrics(
        self,
        start_date: datetime
    ) -> Dict:
        """Calculate trend metrics"""
        return {
            "projectTrend": await self._calculate_trend(
                'projects',
                start_date
            ),
            "riskTrend": await self._calculate_trend(
                'risks',
                start_date
            ),
            "supplierTrend": await self._calculate_trend(
                'suppliers',
                start_date
            ),
            "revenueTrend": await self._calculate_trend(
                'revenue',
                start_date
            )
        }

    async def _calculate_trend(
        self,
        metric_type: str,
        start_date: datetime
    ) -> float:
        """Calculate trend percentage for a metric"""
        current = await self._get_current_value(metric_type)
        previous = await self._get_previous_value(metric_type, start_date)
        
        if not previous:
            return 0
            
        return ((current - previous) / previous) * 100