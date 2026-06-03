from flask import Blueprint, request, jsonify
import requests
import os
from database import get_db
from collections import Counter
import re

skills_bp = Blueprint('skills', __name__)

# Common tech skills to track
COMMON_SKILLS = [
    'Python', 'JavaScript', 'React', 'Node.js', 'Java', 'SQL', 'AWS',
    'Docker', 'Kubernetes', 'Machine Learning', 'Data Science', 'TypeScript',
    'Vue.js', 'Angular', 'MongoDB', 'PostgreSQL', 'Redis', 'Git', 'Linux',
    'Flask', 'Django', 'FastAPI', 'Spring Boot', 'GraphQL', 'REST API',
    'Azure', 'GCP', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy',
    'Tableau', 'Power BI', 'Excel', 'R', 'Scala', 'Kotlin', 'Swift',
    'Flutter', 'React Native', 'HTML', 'CSS', 'Tailwind', 'Next.js'
]

def extract_skills_from_text(text):
    found_skills = []
    text_lower = text.lower()
    for skill in COMMON_SKILLS:
        if skill.lower() in text_lower:
            found_skills.append(skill)
    return found_skills


@skills_bp.route('/top', methods=['GET'])
def get_top_skills():
    try:
        query = request.args.get('q', 'software developer')
        location = request.args.get('location', 'india')
        limit = int(request.args.get('limit', 20))

        # Fetch jobs from Adzuna
        app_id = os.getenv('ADZUNA_APP_ID')
        app_key = os.getenv('ADZUNA_APP_KEY')
        url = f'https://api.adzuna.com/v1/api/jobs/in/search/1'
        params = {
            'app_id': app_id,
            'app_key': app_key,
            'what': query,
            'where': location,
            'results_per_page': 50,
        }
        response = requests.get(url, params=params, timeout=10)

        skill_counts = Counter()

        if response.status_code == 200:
            jobs = response.json().get('results', [])
            for job in jobs:
                text = f"{job.get('title', '')} {job.get('description', '')}"
                skills = extract_skills_from_text(text)
                skill_counts.update(skills)

        # Format results
        top_skills = [
            {'skill': skill, 'count': count, 'percentage': round(count / max(len(skill_counts), 1) * 100, 1)}
            for skill, count in skill_counts.most_common(limit)
        ]

        return jsonify({
            'skills': top_skills,
            'total_jobs_analyzed': len(skill_counts),
            'query': query
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@skills_bp.route('/trending', methods=['GET'])
def get_trending_skills():
    try:
        db = get_db()

        # Get skill demand data from last 30 days
        result = db.table('skill_demand').select('*, skills(name, category)').order('count', desc=True).limit(20).execute()

        if result.data:
            skills = []
            for row in result.data:
                skills.append({
                    'skill': row['skills']['name'] if row.get('skills') else 'Unknown',
                    'category': row['skills']['category'] if row.get('skills') else 'General',
                    'count': row['count'],
                    'date': row['date']
                })
            return jsonify({'skills': skills}), 200

        # Fallback — return static trending skills
        trending = [
            {'skill': 'Python', 'category': 'Programming', 'count': 1250, 'trend': '+12%'},
            {'skill': 'React', 'category': 'Frontend', 'count': 980, 'trend': '+8%'},
            {'skill': 'AWS', 'category': 'Cloud', 'count': 870, 'trend': '+15%'},
            {'skill': 'Machine Learning', 'category': 'AI/ML', 'count': 760, 'trend': '+22%'},
            {'skill': 'TypeScript', 'category': 'Programming', 'count': 680, 'trend': '+18%'},
            {'skill': 'Docker', 'category': 'DevOps', 'count': 640, 'trend': '+10%'},
            {'skill': 'Node.js', 'category': 'Backend', 'count': 590, 'trend': '+5%'},
            {'skill': 'SQL', 'category': 'Database', 'count': 570, 'trend': '+3%'},
            {'skill': 'Kubernetes', 'category': 'DevOps', 'count': 520, 'trend': '+20%'},
            {'skill': 'Data Science', 'category': 'AI/ML', 'count': 490, 'trend': '+16%'},
        ]
        return jsonify({'skills': trending}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@skills_bp.route('/categories', methods=['GET'])
def get_skill_categories():
    try:
        categories = {
            'Programming': ['Python', 'JavaScript', 'TypeScript', 'Java', 'R', 'Scala', 'Kotlin', 'Swift'],
            'Frontend': ['React', 'Vue.js', 'Angular', 'Next.js', 'HTML', 'CSS', 'Tailwind'],
            'Backend': ['Node.js', 'Flask', 'Django', 'FastAPI', 'Spring Boot', 'GraphQL', 'REST API'],
            'Database': ['SQL', 'PostgreSQL', 'MongoDB', 'Redis'],
            'Cloud': ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes'],
            'AI/ML': ['Machine Learning', 'Data Science', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy'],
            'Mobile': ['Flutter', 'React Native'],
            'Tools': ['Git', 'Linux', 'Tableau', 'Power BI', 'Excel']
        }
        return jsonify({'categories': categories}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500