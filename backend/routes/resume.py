from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import os
import pdfplumber
import docx
from groq import Groq

resume_bp = Blueprint('resume', __name__)

def extract_text_from_pdf(file):
    text = ''
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ''
    return text

def extract_text_from_docx(file):
    doc = docx.Document(file)
    return '\n'.join([para.text for para in doc.paragraphs])


@resume_bp.route('/analyze', methods=['POST'])
@jwt_required()
def analyze_resume():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400

        file = request.files['file']
        filename = file.filename.lower()

        # Extract text based on file type
        if filename.endswith('.pdf'):
            text = extract_text_from_pdf(file)
        elif filename.endswith('.docx'):
            text = extract_text_from_docx(file)
        elif filename.endswith('.txt'):
            text = file.read().decode('utf-8')
        else:
            return jsonify({'error': 'Unsupported file type. Use PDF, DOCX, or TXT'}), 400

        if not text.strip():
            return jsonify({'error': 'Could not extract text from file'}), 400

        # Use Groq AI to analyze
        client = Groq(api_key=os.getenv('GROQ_API_KEY'))

        prompt = f"""Analyze this resume and provide a detailed assessment. Return ONLY a JSON object with these exact keys:
{{
    "overall_score": <number 0-100>,
    "summary": "<2-3 sentence summary of the candidate>",
    "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
    "weaknesses": ["<weakness 1>", "<weakness 2>"],
    "skills_found": ["<skill 1>", "<skill 2>", ...],
    "missing_skills": ["<skill 1>", "<skill 2>", ...],
    "experience_level": "<Junior/Mid/Senior>",
    "recommended_roles": ["<role 1>", "<role 2>", "<role 3>"],
    "improvement_tips": ["<tip 1>", "<tip 2>", "<tip 3>"]
}}

Resume:
{text[:3000]}"""

        response = client.chat.completions.create(
            model='llama-3.3-70b-versatile',
            messages=[{'role': 'user', 'content': prompt}],
            temperature=0.3,
            max_tokens=1000
        )

        import json
        result_text = response.choices[0].message.content
        # Clean up response
        result_text = result_text.strip()
        if result_text.startswith('```'):
            result_text = result_text.split('```')[1]
            if result_text.startswith('json'):
                result_text = result_text[4:]

        analysis = json.loads(result_text)

        return jsonify({'analysis': analysis}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@resume_bp.route('/tailor', methods=['POST'])
@jwt_required()
def tailor_resume():
    try:
        data = request.get_json()
        resume_text = data.get('resume_text')
        job_description = data.get('job_description')

        if not all([resume_text, job_description]):
            return jsonify({'error': 'Resume text and job description are required'}), 400

        client = Groq(api_key=os.getenv('GROQ_API_KEY'))

        prompt = f"""Given this resume and job description, provide tailoring suggestions. Return ONLY a JSON object:
{{
    "match_score": <number 0-100>,
    "matching_skills": ["<skill 1>", "<skill 2>"],
    "missing_skills": ["<skill 1>", "<skill 2>"],
    "suggestions": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>"],
    "keywords_to_add": ["<keyword 1>", "<keyword 2>"],
    "tailored_summary": "<rewritten professional summary targeting this job>"
}}

Resume:
{resume_text[:2000]}

Job Description:
{job_description[:1000]}"""

        response = client.chat.completions.create(
            model='llama-3.3-70b-versatile',
            messages=[{'role': 'user', 'content': prompt}],
            temperature=0.3,
            max_tokens=800
        )

        import json
        result_text = response.choices[0].message.content.strip()
        if result_text.startswith('```'):
            result_text = result_text.split('```')[1]
            if result_text.startswith('json'):
                result_text = result_text[4:]

        result = json.loads(result_text)
        return jsonify({'result': result}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500