from flask import Flask
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from config import Config
import os

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)
app.config['JWT_SECRET_KEY'] = Config.SECRET_KEY

# Initialize extensions
CORS(app, origins=[
    'http://localhost:5173',
    'http://localhost:3000',
    'https://skillintel.vercel.app',
    'https://*.vercel.app'
])
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Create cache directory if it doesn't exist
os.makedirs(Config.CACHE_DIR, exist_ok=True)

# Import and register all route blueprints
from routes.auth import auth_bp
from routes.jobs import jobs_bp
from routes.skills import skills_bp
from routes.resume import resume_bp
from routes.forecast import forecast_bp
from routes.roles import roles_bp

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(jobs_bp, url_prefix='/api/jobs')
app.register_blueprint(skills_bp, url_prefix='/api/skills')
app.register_blueprint(resume_bp, url_prefix='/api/resume')
app.register_blueprint(forecast_bp, url_prefix='/api/forecast')
app.register_blueprint(roles_bp, url_prefix='/api/roles')

# Health check route
@app.route('/api/health')
def health():
    return {'status': 'ok', 'message': 'SkilLintel API is running!'}

if __name__ == '__main__':
    app.run(
        debug=Config.FLASK_ENV == 'development',
        port=Config.FLASK_PORT
    )