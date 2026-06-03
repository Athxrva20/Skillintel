import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    # Flask
    SECRET_KEY = os.getenv('SECRET_KEY', 'skillintel-default-secret')
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    FLASK_PORT = int(os.getenv('FLASK_PORT', 5000))

    # Supabase
    SUPABASE_URL = os.getenv('SUPABASE_URL')
    SUPABASE_ANON_KEY = os.getenv('SUPABASE_ANON_KEY')
    DATABASE_URL = os.getenv('DATABASE_URL')

    # Groq AI
    GROQ_API_KEY = os.getenv('GROQ_API_KEY')

    # Job APIs
    ADZUNA_APP_ID = os.getenv('ADZUNA_APP_ID')
    ADZUNA_APP_KEY = os.getenv('ADZUNA_APP_KEY')
    RAPIDAPI_KEY = os.getenv('RAPIDAPI_KEY')
    JOOBLE_API_KEY = os.getenv('JOOBLE_API_KEY')

    # Cache
    CACHE_DIR = os.getenv('CACHE_DIR', './cache')
    CACHE_TTL_HOURS = int(os.getenv('CACHE_TTL_HOURS', 6))