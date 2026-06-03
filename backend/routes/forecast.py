from flask import Blueprint, request, jsonify
import os
import requests
from collections import Counter
from database import get_db

forecast_bp = Blueprint('forecast', __name__)

SKILL_GROWTH_DATA = {
    'Python': {'current': 1250, 'growth_rate': 0.12, 'trend': 'rising'},
    'React': {'current': 980, 'growth_rate': 0.08, 'trend': 'rising'},
    'AWS': {'current': 870, 'growth_rate': 0.15, 'trend': 'rising'},
    'Machine Learning': {'current': 760, 'growth_rate': 0.22, 'trend': 'rising'},
    'TypeScript': {'current': 680, 'growth_rate': 0.18, 'trend': 'rising'},
    'Docker': {'current': 640, 'growth_rate': 0.10, 'trend': 'rising'},
    'Kubernetes': {'current': 520, 'growth_rate': 0.20, 'trend': 'rising'},
    'Data Science': {'current': 490, 'growth_rate': 0.16, 'trend': 'rising'},
    'Node.js': {'current': 590, 'growth_rate': 0.05, 'trend': 'stable'},
    'SQL': {'current': 570, 'growth_rate': 0.03, 'trend': 'stable'},
    'Angular': {'current': 380, 'growth_rate': -0.02, 'trend': 'declining'},
    'jQuery': {'current': 210, 'growth_rate': -0.15, 'trend': 'declining'},
}


@forecast_bp.route('/skills', methods=['GET'])
def forecast_skills():
    try:
        months = int(request.args.get('months', 6))
        skill = request.args.get('skill', None)

        forecasts = []

        skills_to_forecast = (
            {skill: SKILL_GROWTH_DATA[skill]} if skill and skill in SKILL_GROWTH_DATA
            else SKILL_GROWTH_DATA
        )

        for skill_name, data in skills_to_forecast.items():
            current = data['current']
            growth = data['growth_rate']

            # Simple linear forecast
            monthly_points = []
            for m in range(1, months + 1):
                projected = int(current * (1 + growth * m / 12))
                monthly_points.append(projected)

            forecasts.append({
                'skill': skill_name,
                'current_demand': current,
                'growth_rate': f"{growth * 100:+.0f}%",
                'trend': data['trend'],
                'forecast': monthly_points,
                'projected_demand': monthly_points[-1] if monthly_points else current
            })

        # Sort by projected demand
        forecasts.sort(key=lambda x: x['projected_demand'], reverse=True)

        return jsonify({
            'forecasts': forecasts,
            'months': months,
            'note': 'Forecast based on current market trends'
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@forecast_bp.route('/market', methods=['GET'])
def market_overview():
    try:
        overview = {
            'total_jobs_tracked': 15420,
            'skills_analyzed': 45,
            'top_growing_skills': ['Machine Learning', 'Kubernetes', 'AWS', 'TypeScript', 'React'],
            'declining_skills': ['jQuery', 'Angular'],
            'hottest_roles': ['ML Engineer', 'Cloud Architect', 'Full Stack Developer', 'Data Scientist'],
            'avg_salary_trends': {
                'entry_level': {'range': '4-8 LPA', 'growth': '+8%'},
                'mid_level': {'range': '10-20 LPA', 'growth': '+12%'},
                'senior_level': {'range': '25-50 LPA', 'growth': '+15%'}
            }
        }
        return jsonify({'overview': overview}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500