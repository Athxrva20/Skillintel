from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from database import get_db

auth_bp = Blueprint('auth', __name__)
bcrypt = Bcrypt()

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        name = data.get('name', '').strip()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')

        if not all([name, email, password]):
            return jsonify({'error': 'All fields are required'}), 400

        if len(password) < 6:
            return jsonify({'error': 'Password must be at least 6 characters'}), 400

        db = get_db()

        # Check if user already exists
        try:
            existing = db.table('users').select('id').eq('email', email).execute()
            if existing.data and len(existing.data) > 0:
                return jsonify({'error': 'Email already registered'}), 409
        except Exception as check_err:
            print(f'Check error: {check_err}')

        # Hash password
        password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

        # Insert new user
        result = db.table('users').insert({
            'name': name,
            'email': email,
            'password_hash': password_hash
        }).execute()

        if not result.data or len(result.data) == 0:
            return jsonify({'error': 'Failed to create account'}), 500

        user = result.data[0]
        access_token = create_access_token(identity=str(user['id']))

        return jsonify({
            'message': 'Account created successfully',
            'token': access_token,
            'user': {
                'id': user['id'],
                'name': user['name'],
                'email': user['email']
            }
        }), 201

    except Exception as e:
        print(f'Register error: {e}')
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')

        if not all([email, password]):
            return jsonify({'error': 'Email and password are required'}), 400

        db = get_db()

        # Find user
        result = db.table('users').select('*').eq('email', email).execute()
        if not result.data or len(result.data) == 0:
            return jsonify({'error': 'Invalid email or password'}), 401

        user = result.data[0]

        # Check password
        if not bcrypt.check_password_hash(user['password_hash'], password):
            return jsonify({'error': 'Invalid email or password'}), 401

        access_token = create_access_token(identity=str(user['id']))

        return jsonify({
            'message': 'Login successful',
            'token': access_token,
            'user': {
                'id': user['id'],
                'name': user['name'],
                'email': user['email']
            }
        }), 200

    except Exception as e:
        print(f'Login error: {e}')
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    try:
        user_id = get_jwt_identity()
        db = get_db()

        result = db.table('users').select(
            'id, name, email, created_at'
        ).eq('id', user_id).execute()

        if not result.data or len(result.data) == 0:
            return jsonify({'error': 'User not found'}), 404

        return jsonify({'user': result.data[0]}), 200

    except Exception as e:
        print(f'Get user error: {e}')
        return jsonify({'error': str(e)}), 500