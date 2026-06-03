from flask import Blueprint, request, jsonify
import os
import requests

roles_bp = Blueprint('roles', __name__)

ROLES_DATA = {
    'Software Engineer': {
        'description': 'Design, develop and maintain software applications',
        'avg_salary': '8-25 LPA',
        'experience_levels': ['Junior', 'Mid', 'Senior', 'Lead'],
        'top_skills': ['Python', 'JavaScript', 'SQL', 'Git', 'REST API'],
        'growth': '+15%',
        'demand': 'Very High',
        'related_roles': ['Backend Developer', 'Full Stack Developer', 'DevOps Engineer']
    },
    'Data Scientist': {
        'description': 'Analyze complex data to help organizations make better decisions',
        'avg_salary': '10-30 LPA',
        'experience_levels': ['Junior', 'Mid', 'Senior'],
        'top_skills': ['Python', 'Machine Learning', 'SQL', 'Pandas', 'TensorFlow'],
        'growth': '+22%',
        'demand': 'Very High',
        'related_roles': ['ML Engineer', 'Data Analyst', 'AI Engineer']
    },
    'Frontend Developer': {
        'description': 'Build user interfaces and web experiences',
        'avg_salary': '6-20 LPA',
        'experience_levels': ['Junior', 'Mid', 'Senior'],
        'top_skills': ['React', 'TypeScript', 'HTML', 'CSS', 'Next.js'],
        'growth': '+10%',
        'demand': 'High',
        'related_roles': ['UI Developer', 'Full Stack Developer', 'React Developer']
    },
    'Backend Developer': {
        'description': 'Build server-side logic, databases and APIs',
        'avg_salary': '8-22 LPA',
        'experience_levels': ['Junior', 'Mid', 'Senior'],
        'top_skills': ['Node.js', 'Python', 'SQL', 'Docker', 'REST API'],
        'growth': '+12%',
        'demand': 'High',
        'related_roles': ['Software Engineer', 'Full Stack Developer', 'DevOps Engineer']
    },
    'DevOps Engineer': {
        'description': 'Bridge development and operations through automation and CI/CD',
        'avg_salary': '10-28 LPA',
        'experience_levels': ['Mid', 'Senior', 'Lead'],
        'top_skills': ['Docker', 'Kubernetes', 'AWS', 'Linux', 'Git'],
        'growth': '+20%',
        'demand': 'Very High',
        'related_roles': ['Cloud Engineer', 'SRE', 'Platform Engineer']
    },
    'ML Engineer': {
        'description': 'Build and deploy machine learning models at scale',
        'avg_salary': '12-35 LPA',
        'experience_levels': ['Mid', 'Senior'],
        'top_skills': ['Python', 'TensorFlow', 'PyTorch', 'AWS', 'Docker'],
        'growth': '+25%',
        'demand': 'Very High',
        'related_roles': ['Data Scientist', 'AI Engineer', 'Research Engineer']
    },
    'Cloud Architect': {
        'description': 'Design and oversee cloud computing strategies',
        'avg_salary': '20-50 LPA',
        'experience_levels': ['Senior', 'Lead', 'Principal'],
        'top_skills': ['AWS', 'Azure', 'GCP', 'Kubernetes', 'Terraform'],
        'growth': '+18%',
        'demand': 'High',
        'related_roles': ['Solutions Architect', 'DevOps Engineer', 'Cloud Engineer']
    },
    'Full Stack Developer': {
        'description': 'Work on both frontend and backend of web applications',
        'avg_salary': '8-24 LPA',
        'experience_levels': ['Junior', 'Mid', 'Senior'],
        'top_skills': ['React', 'Node.js', 'SQL', 'TypeScript', 'Docker'],
        'growth': '+14%',
        'demand': 'Very High',
        'related_roles': ['Frontend Developer', 'Backend Developer', 'Software Engineer']
    }
}


@roles_bp.route('/', methods=['GET'])
def get_all_roles():
    try:
        roles = []
        for role_name, data in ROLES_DATA.items():
            roles.append({
                'name': role_name,
                'description': data['description'],
                'avg_salary': data['avg_salary'],
                'growth': data['growth'],
                'demand': data['demand'],
                'top_skills': data['top_skills'][:3]
            })
        return jsonify({'roles': roles, 'total': len(roles)}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@roles_bp.route('/<role_name>', methods=['GET'])
def get_role_detail(role_name):
    try:
        # Find role (case insensitive)
        matched_role = None
        for name, data in ROLES_DATA.items():
            if name.lower().replace(' ', '-') == role_name.lower():
                matched_role = (name, data)
                break

        if not matched_role:
            return jsonify({'error': 'Role not found'}), 404

        name, data = matched_role
        return jsonify({
            'name': name,
            **data
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@roles_bp.route('/search', methods=['GET'])
def search_roles():
    try:
        query = request.args.get('q', '').lower()
        skill = request.args.get('skill', '').lower()

        results = []
        for role_name, data in ROLES_DATA.items():
            # Search by role name
            if query and query not in role_name.lower():
                continue
            # Filter by skill
            if skill and not any(skill in s.lower() for s in data['top_skills']):
                continue
            results.append({
                'name': role_name,
                'description': data['description'],
                'avg_salary': data['avg_salary'],
                'growth': data['growth'],
                'demand': data['demand'],
                'top_skills': data['top_skills']
            })

        return jsonify({'roles': results, 'total': len(results)}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500