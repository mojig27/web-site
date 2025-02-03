// backend/app/services/prediction_service.py
from typing import Dict, List
import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor
from prophet import Prophet
from app.utils.time_series import TimeSeriesAnalysis

class PredictionService:
    def __init__(self):
        self.ts_analysis = TimeSeriesAnalysis()
        self.ml_model = GradientBoostingRegressor()
        self.prophet_model = Prophet()

    async def generate_predictions(
        self,
        project_id: str,
        config: Dict
    ) -> Dict:
        """Generate comprehensive project predictions"""
        # Get historical data
        history = await self._get_project_history(project_id)
        
        # Generate predictions for different aspects
        predictions = {
            "progress": await self._predict_progress(history, config),
            "costs": await self._predict_costs(history, config),
            "risks": await self._predict_risks(history, config),
            "scenarios": await self._generate_scenarios(history, config)
        }
        
        # Add confidence intervals
        predictions = self._add_confidence_intervals(
            predictions,
            config["confidenceInterval"]
        )
        
        return predictions

    async def _predict_progress(
        self,
        history: pd.DataFrame,
        config: Dict
    ) -> Dict:
        """Predict project progress"""
        model = self._prepare_prophet_model(history, 'progress')
        future = model.make_future_dataframe(periods=config['horizon'])
        forecast = model.predict(future)
        
        return {
            "forecast": forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']],
            "changepoints": model.changepoints,
            "trend": forecast['trend'].values
        }

    async def _generate_scenarios(
        self,
        history: pd.DataFrame,
        config: Dict
    ) -> Dict:
        """Generate different scenarios"""
        scenarios = {}
        
        for scenario in config['scenarios']:
            if scenario == 'optimistic':
                scenarios[scenario] = self._generate_optimistic_scenario(
                    history,
                    config
                )
            elif scenario == 'pessimistic':
                scenarios[scenario] = self._generate_pessimistic_scenario(
                    history,
                    config
                )
            else:
                scenarios[scenario] = self._generate_realistic_scenario(
                    history,
                    config
                )
                
        return scenarios