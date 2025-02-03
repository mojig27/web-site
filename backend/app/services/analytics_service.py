
// backend/app/services/analytics_service.py
from typing import Dict, List
from datetime import datetime, timedelta
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from app.models import Project, Transaction, Risk, Progress
from app.utils.ml import MLEngine

class AnalyticsService:
    def __init__(self):
        self.ml_engine = MLEngine()
        self.scaler = StandardScaler()
        self.pca = PCA(n_components=3)

    async def generate_advanced_report(
        self,
        config: Dict
    ) -> Dict:
        """Generate comprehensive analytical report"""
        # Fetch raw data
        raw_data = await self._fetch_data(config)
        
        # Process and transform data
        processed_data = self._process_data(raw_data, config)
        
        # Generate analytics
        analytics = {
            "summary": self._generate_summary(processed_data),
            "trends": await self._analyze_trends(processed_data),
            "correlations": self._analyze_correlations(processed_data),
            "anomalies": await self._detect_anomalies(processed_data),
            "predictions": await self._generate_predictions(processed_data)
        }
        
        # Add ML insights
        analytics["insights"] = await self._generate_ml_insights(processed_data)
        
        return analytics

    async def _generate_ml_insights(
        self,
        data: pd.DataFrame
    ) -> Dict:
        """Generate machine learning based insights"""
        insights = {
            "clusters": await self._perform_clustering(data),
            "patterns": await self._detect_patterns(data),
            "recommendations": await self._generate_recommendations(data)
        }
        
        # Add feature importance
        if data.shape[1] > 1:
            insights["importance"] = await self._analyze_feature_importance(data)
            
        return insights

    async def _perform_clustering(
        self,
        data: pd.DataFrame
    ) -> Dict:
        """Perform advanced clustering analysis"""
        # Prepare data
        scaled_data = self.scaler.fit_transform(data)
        
        # Reduce dimensions for visualization
        reduced_data = self.pca.fit_transform(scaled_data)
        
        # Perform clustering
        clusters = await self.ml_engine.perform_clustering(reduced_data)
        
        # Analyze clusters
        cluster_analysis = {
            "centers": clusters.cluster_centers_,
            "labels": clusters.labels_,
            "metrics": self._calculate_cluster_metrics(clusters, reduced_data)
        }
        
        return cluster_analysis

    async def _detect_patterns(
        self,
        data: pd.DataFrame
    ) -> List[Dict]:
        """Detect significant patterns in data"""
        patterns = []
        
        # Time series patterns
        if 'date' in data.columns:
            time_patterns = await self._analyze_time_patterns(data)
            patterns.extend(time_patterns)
            
        # Value patterns
        value_patterns = await self._analyze_value_patterns(data)
        patterns.extend(value_patterns)
        
        # Relationship patterns
        relationship_patterns = self._analyze_relationships(data)
        patterns.extend(relationship_patterns)
        
        return patterns

    async def _generate_recommendations(
        self,
        data: pd.DataFrame
    ) -> List[Dict]:
        """Generate actionable recommendations"""
        recommendations = []
        
        # Performance recommendations
        perf_recs = await self._analyze_performance(data)
        recommendations.extend(perf_recs)
        
        # Risk recommendations
        risk_recs = await self._analyze_risks(data)
        recommendations.extend(risk_recs)
        
        # Optimization recommendations
        opt_recs = await self._generate_optimization_recommendations(data)
        recommendations.extend(opt_recs)
        
        return recommendations

    def _calculate_cluster_metrics(
        self,
        clusters: any,
        data: np.ndarray
    ) -> Dict:
        """Calculate detailed cluster metrics"""
        return {
            "silhouette": silhouette_score(data, clusters.labels_),
            "calinski": calinski_harabasz_score(data, clusters.labels_),
            "davies": davies_bouldin_score(data, clusters.labels_),
            "inertia": clusters.inertia_
        }