import numpy as np
from sklearn.ensemble import RandomForestRegressor
from app.models import Project, Risk, RiskMetric
from app.utils.time_series import TimeSeriesAnalyzer

class RiskPredictionService:
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=100)
        self.time_series = TimeSeriesAnalyzer()

    async def predict_project_risks(
        self,
        project_id: str,
        horizon_days: int = 30
    ) -> Dict:
        """Predict future project risks"""
        # Get historical data
        history = await self._get_risk_history(project_id)
        
        # Prepare features
        features = self._prepare_prediction_features(history)
        
        # Train model
        self._train_model(features, history['risk_levels'])
        
        # Generate predictions
        predictions = self._generate_predictions(features, horizon_days)
        
        # Identify potential alerts
        alerts = self._identify_risk_alerts(predictions)
        
        return {
            "predictions": predictions,
            "alerts": alerts,
            "confidence": self._calculate_prediction_confidence(predictions)
        }

    async def _get_risk_history(self, project_id: str) -> Dict:
        """Get historical risk data"""
        metrics = await RiskMetric.find_by_project(project_id)
        
        return {
            "timestamps": [m.timestamp for m in metrics],
            "risk_levels": [m.risk_level for m in metrics],
            "factors": [m.contributing_factors for m in metrics]
        }

    def _prepare_prediction_features(self, history: Dict) -> np.ndarray:
        """Prepare features for prediction"""
        features = []
        
        # Time-based features
        features.append(self.time_series.extract_temporal_features(
            history['timestamps']
        ))
        
        # Risk factor features
        features.append(self._extract_risk_factors(
            history['factors']
        ))
        
        # Trend features
        features.append(self.time_series.extract_trend_features(
            history['risk_levels']
        ))
        
        return np.hstack(features)

    def _identify_risk_alerts(
        self,
        predictions: Dict
    ) -> List[Dict]:
        """Identify potential risk alerts from predictions"""
        alerts = []
        
        for date, prediction in predictions.items():
            if self._is_alert_condition(prediction):
                alerts.append({
                    "date": date,
                    "risk_level": prediction['risk_level'],
                    "contributing_factors": prediction['factors'],
                    "recommended_actions": self._generate_recommendations(
                        prediction
                    ),
                    "confidence": prediction['confidence']
                })
                
        return alerts

    def _calculate_prediction_confidence(
        self,
        predictions: Dict
    ) -> float:
        """Calculate confidence level of predictions"""
        uncertainties = [p['uncertainty'] for p in predictions.values()]
        return 1 - np.mean(uncertainties)