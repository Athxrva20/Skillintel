from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import requests
import os
import json
import time
from database import get_db

jobs_bp = Blueprint('jobs', __name__)

def fetch_adzuna_jobs(query, location='india', page=1):
    try:
        app_id = os.getenv('ADZUNA_APP_ID')
        app_key = os.getenv('ADZUNA_APP_KEY')
        url = f'https://api.adzuna.com/v1/api/jobs/in/search/{page}'
        params = {
            'app_id': app_id,
            'app_key': app_key,
            'what': query,
            'where': location,
            'results_per_page': 10,
            'content-type': 'application/json'
        }
        response = requests.get(url, params=params, timeout=10)
        if response.status_code == 200:
            data = response.json()
            jobs = []
            for job in data.get('results', []):
                jobs.append({
                    'id': job.get('id'),
                    'title': job.get('title'),
                    'company': job.get('company', {}).get('display_name', 'Unknown'),
                    'location': job.get('location', {}).get('display_name', 'Unknown'),
                    'description': job.get('description', ''),
                    'url': job.get('redirect_url', ''),
                    'salary_min': job.get('salary_min'),
                    'salary_max': job.get('salary_max'),
                    'posted_at': job.get('created'),
                    'source': 'adzuna'
                })
            return jobs
    except Exception as e:
        print(f'Adzuna error: {e}')
    return []

def fetch_jsearch_jobs(query, location='india'):
    try:
        url = 'https://jsearch.p.rapidapi.com/search'
        headers = {
            'X-RapidAPI-Key': os.getenv('RAPIDAPI_KEY'),
            'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
        }
        params = {
            'query': f'{query} in {location}',
            'page': '1',
            'num_pages': '1',
            'date_posted': 'month'
        }
        response = requests.get(url, headers=headers, params=params, timeout=10)
        if response.status_code == 200:
            data = response.json()
            jobs = []
            for job in data.get('data', []):
                jobs.append({
                    'id': job.get('job_id'),
                    'title': job.get('job_title'),
                    'company': job.get('employer_name', 'Unknown'),
                    'location': f"{job.get('job_city', '')}, {job.get('job_country', '')}",
                    'description': job.get('job_description', ''),
                    'url': job.get('job_apply_link', ''),
                    'salary_min': job.get('job_min_salary'),
                    'salary_max': job.get('job_max_salary'),
                    'posted_at': job.get('job_posted_at_datetime_utc'),
                    'source': 'jsearch'
                })
            return jobs
    except Exception as e:
        print(f'JSearch error: {e}')
    return []

def fetch_jooble_jobs(query, location='india'):
    try:
        api_key = os.getenv('JOOBLE_API_KEY')
        url = f'https://jooble.org/api/{api_key}'
        payload = {
            'keywords': query,
            'location': location,
            'page': '1'
        }
        response = requests.post(url, json=payload, timeout=10)
        if response.status_code == 200:
            data = response.json()
            jobs = []
            for job in data.get('jobs', []):
                jobs.append({
                    'id': job.get('id'),
                    'title': job.get('title'),
                    'company': job.get('company', 'Unknown'),
                    'location': job.get('location', 'Unknown'),
                    'description': job.get('snippet', ''),
                    'url': job.get('link', ''),
                    'salary_min': None,
                    'salary_max': None,
                    'posted_at': job.get('updated'),
                    'source': 'jooble'
                })
            return jobs
    except Exception as e:
        print(f'Jooble error: {e}')
    return []


@jobs_bp.route('/search', methods=['GET'])
def search_jobs():
    try:
        query = request.args.get('q', 'software developer')
        location = request.args.get('location', 'india')
        page = int(request.args.get('page', 1))

        # Fetch from all sources
        adzuna_jobs = fetch_adzuna_jobs(query, location, page)
        jsearch_jobs = fetch_jsearch_jobs(query, location)
        jooble_jobs = fetch_jooble_jobs(query, location)

        # Combine all jobs
        all_jobs = adzuna_jobs + jsearch_jobs + jooble_jobs

        return jsonify({
            'jobs': all_jobs,
            'total': len(all_jobs),
            'query': query,
            'location': location
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@jobs_bp.route('/save', methods=['POST'])
@jwt_required()
def save_job():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        job = data.get('job')

        if not job:
            return jsonify({'error': 'Job data is required'}), 400

        db = get_db()

        # Save job to jobs table
        job_result = db.table('jobs').upsert({
            'title': job.get('title'),
            'company': job.get('company'),
            'location': job.get('location'),
            'description': job.get('description'),
            'url': job.get('url'),
            'source': job.get('source'),
            'salary_min': job.get('salary_min'),
            'salary_max': job.get('salary_max'),
        }).execute()

        job_id = job_result.data[0]['id']

        # Save to saved_jobs
        db.table('saved_jobs').upsert({
            'user_id': user_id,
            'job_id': job_id
        }).execute()

        return jsonify({'message': 'Job saved successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@jobs_bp.route('/saved', methods=['GET'])
@jwt_required()
def get_saved_jobs():
    try:
        user_id = get_jwt_identity()
        db = get_db()

        result = db.table('saved_jobs').select('*, jobs(*)').eq('user_id', user_id).execute()

        jobs = [item['jobs'] for item in result.data if item.get('jobs')]

        return jsonify({'jobs': jobs, 'total': len(jobs)}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500