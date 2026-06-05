import { useState, useCallback } from 'react'
import { resumeAPI } from '../utils/api'
import toast from 'react-hot-toast'
import {
  Upload, FileText, CheckCircle, XCircle,
  AlertCircle, Star, TrendingUp, Target,
  Briefcase, ChevronDown, ChevronUp, Zap,
  RotateCcw, Download
} from 'lucide-react'

function ScoreRing({ score, size = 120 }) {
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const progress = (score / 100) * circumference
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none"
          stroke="var(--bg-secondary)" strokeWidth="8" />
        <circle cx="50" cy="50" r={radius} fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={`${progress} ${circumference}`}
          strokeDashoffset={circumference * 0.25}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s ease' }}
        />
        <text x="50" y="46" textAnchor="middle"
          fontSize="18" fontWeight="700"
          fill="var(--text-primary)" fontFamily="Space Grotesk">
          {score}
        </text>
        <text x="50" y="60" textAnchor="middle"
          fontSize="9" fill="var(--text-secondary)">
          / 100
        </text>
      </svg>
    </div>
  )
}

function SkillTag({ skill, type }) {
  const styles = {
    good: { bg: 'rgba(16,185,129,0.1)', color: '#10b981', border: 'rgba(16,185,129,0.2)', icon: <CheckCircle size={11} /> },
    missing: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'rgba(239,68,68,0.2)', icon: <XCircle size={11} /> },
    warning: { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: 'rgba(245,158,11,0.2)', icon: <AlertCircle size={11} /> },
  }
  const s = styles[type]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: 12, padding: '4px 10px', borderRadius: 20,
      background: s.bg, color: s.color,
      border: `1px solid ${s.border}`, margin: '3px'
    }}>
      {s.icon} {skill}
    </span>
  )
}

function Section({ title, icon: Icon, color, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 12, marginBottom: 12, overflow: 'hidden'
    }}>
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '14px 18px',
        background: 'none', border: 'none', cursor: 'pointer',
        borderBottom: open ? '1px solid var(--border)' : 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: `${color}20`, display: 'flex',
            alignItems: 'center', justifyContent: 'center'
          }}>
            <Icon size={15} color={color} />
          </div>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</span>
        </div>
        {open ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
      </button>
      {open && <div style={{ padding: '14px 18px' }}>{children}</div>}
    </div>
  )
}

export default function ResumeAI() {
  const [file, setFile] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [tab, setTab] = useState('analyze')
  const [jobDesc, setJobDesc] = useState('')
  const [resumeText, setResumeText] = useState('')
  const [tailoring, setTailoring] = useState(null)
  const [tailorLoading, setTailorLoading] = useState(false)

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) handleFileSelect(dropped)
  }, [])

  const handleFileSelect = (selectedFile) => {
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
    if (!allowed.includes(selectedFile.type) && !selectedFile.name.match(/\.(pdf|docx|txt)$/i)) {
      toast.error('Please upload a PDF, DOCX, or TXT file')
      return
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }
    setFile(selectedFile)
    setAnalysis(null)
    toast.success(`${selectedFile.name} ready to analyze!`)
  }

  const handleAnalyze = async () => {
    if (!file) { toast.error('Please upload a resume first'); return }
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await resumeAPI.analyze(formData)
      setAnalysis(res.data.analysis)
      toast.success('Resume analyzed successfully!')
    } catch (err) {
      toast.error('Analysis failed. Using demo result.')
      // Demo analysis result
      setAnalysis({
        overall_score: 74,
        summary: 'A motivated full-stack developer with 2 years of experience in React and Node.js. Strong frontend skills but needs improvement in cloud and DevOps areas.',
        experience_level: 'Mid',
        strengths: ['Strong React & frontend skills', 'Good problem-solving ability', 'Experience with REST APIs'],
        weaknesses: ['Limited cloud experience', 'No DevOps/CI-CD knowledge'],
        skills_found: ['React', 'Node.js', 'JavaScript', 'SQL', 'Git', 'HTML', 'CSS'],
        missing_skills: ['Docker', 'AWS', 'Kubernetes', 'TypeScript', 'Testing'],
        recommended_roles: ['Frontend Developer', 'Full Stack Developer', 'React Developer'],
        improvement_tips: [
          'Add TypeScript to your skill set — it\'s required in 78% of React jobs',
          'Learn Docker basics and add a containerized project to your portfolio',
          'Get AWS Cloud Practitioner certification to stand out',
        ]
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTailor = async () => {
    if (!resumeText || !jobDesc) {
      toast.error('Please provide both resume text and job description')
      return
    }
    setTailorLoading(true)
    try {
      const res = await resumeAPI.tailor(resumeText, jobDesc)
      setTailoring(res.data.result)
      toast.success('Tailoring suggestions ready!')
    } catch {
      toast.error('Tailoring failed. Using demo result.')
      setTailoring({
        match_score: 68,
        matching_skills: ['React', 'Node.js', 'JavaScript', 'SQL'],
        missing_skills: ['Docker', 'AWS', 'TypeScript'],
        suggestions: [
          'Add TypeScript experience — it\'s explicitly required in this job',
          'Mention any AWS or cloud projects even if minor',
          'Highlight your REST API experience more prominently'
        ],
        keywords_to_add: ['TypeScript', 'Docker', 'CI/CD', 'Agile', 'Microservices'],
        tailored_summary: 'Results-driven Full Stack Developer with 2+ years building scalable web applications using React and Node.js. Experienced in RESTful API design and SQL databases, with a passion for clean code and user-centric design.'
      })
    } finally {
      setTailorLoading(false)
    }
  }

  const scoreColor = analysis
    ? analysis.overall_score >= 80 ? '#10b981'
      : analysis.overall_score >= 60 ? '#f59e0b' : '#ef4444'
    : '#10b981'

  const scoreLabel = analysis
    ? analysis.overall_score >= 80 ? 'Excellent'
      : analysis.overall_score >= 60 ? 'Good'
      : 'Needs Work'
    : ''

  return (
    <div className="page-container">

      {/* HEADER */}
      <div style={{ marginBottom: 24 }}>
        <h1 className="page-title">Resume AI</h1>
        <p className="page-subtitle">
          Upload your resume for AI-powered analysis, scoring and improvement tips
        </p>
      </div>

      {/* TABS */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 24,
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 10, padding: 4, width: 'fit-content'
      }}>
        {[
          { id: 'analyze', label: 'Analyze Resume', icon: FileText },
          { id: 'tailor', label: 'Tailor for Job', icon: Target },
        ].map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)} style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '8px 18px', borderRadius: 7, fontSize: 13,
            fontWeight: tab === id ? 600 : 400, cursor: 'pointer',
            background: tab === id ? 'var(--accent-primary)' : 'transparent',
            color: tab === id ? 'white' : 'var(--text-secondary)',
            border: 'none', transition: 'all 0.2s'
          }}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* ANALYZE TAB */}
      {tab === 'analyze' && (
        <div style={{ display: 'grid', gridTemplateColumns: analysis ? '1fr 1.5fr' : '1fr', gap: 20 }}>

          {/* UPLOAD SECTION */}
          <div>
            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => document.getElementById('resumeInput').click()}
              style={{
                border: `2px dashed ${dragOver ? 'var(--accent-primary)' : file ? 'var(--accent-primary)' : 'var(--border-light)'}`,
                borderRadius: 14, padding: '40px 24px', textAlign: 'center',
                cursor: 'pointer', transition: 'all 0.2s', marginBottom: 16,
                background: dragOver ? 'var(--accent-glow)' : file ? 'var(--accent-glow)' : 'var(--bg-card)',
              }}
            >
              <input
                id="resumeInput" type="file"
                accept=".pdf,.docx,.txt"
                style={{ display: 'none' }}
                onChange={e => e.target.files[0] && handleFileSelect(e.target.files[0])}
              />
              {file ? (
                <>
                  <div style={{
                    width: 52, height: 52, borderRadius: 12,
                    background: 'var(--accent-glow)',
                    border: '1px solid rgba(16,185,129,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 12px'
                  }}>
                    <FileText size={24} color="var(--accent-primary)" />
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{file.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    {(file.size / 1024).toFixed(1)} KB · Click to change
                  </p>
                </>
              ) : (
                <>
                  <div style={{
                    width: 52, height: 52, borderRadius: 12,
                    background: 'var(--bg-secondary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 12px',
                    border: '1px solid var(--border-light)'
                  }}>
                    <Upload size={24} color="var(--text-muted)" />
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                    Drop your resume here
                  </p>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
                    or click to browse files
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    PDF, DOCX, TXT · Max 5MB
                  </p>
                </>
              )}
            </div>

            {/* Analyze button */}
            <button
              onClick={handleAnalyze}
              className="btn-primary"
              disabled={!file || loading}
              style={{
                width: '100%', justifyContent: 'center',
                padding: '13px', fontSize: 15,
                opacity: !file || loading ? 0.6 : 1
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: 16, height: 16,
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid white', borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                  Analyzing with AI...
                </>
              ) : (
                <><Zap size={16} /> Analyze Resume</>
              )}
            </button>

            {/* Tips */}
            {!analysis && (
              <div style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 12, padding: 16, marginTop: 16
              }}>
                <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>
                  What you'll get:
                </p>
                {[
                  { icon: Star, color: '#f59e0b', text: 'Overall resume score out of 100' },
                  { icon: CheckCircle, color: '#10b981', text: 'Skills found in your resume' },
                  { icon: XCircle, color: '#ef4444', text: 'Missing skills for your target role' },
                  { icon: TrendingUp, color: '#6366f1', text: 'Improvement tips & recommendations' },
                  { icon: Briefcase, color: '#14b8a6', text: 'Best-fit job roles for your profile' },
                ].map(({ icon: Icon, color, text }) => (
                  <div key={text} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '7px 0',
                    borderBottom: '1px solid var(--border)'
                  }}>
                    <Icon size={14} color={color} />
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{text}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Reset button */}
            {analysis && (
              <button onClick={() => { setFile(null); setAnalysis(null) }} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                marginTop: 12, fontSize: 13, color: 'var(--text-secondary)',
                background: 'none', border: 'none', cursor: 'pointer'
              }}>
                <RotateCcw size={13} /> Analyze another resume
              </button>
            )}
          </div>

          {/* ANALYSIS RESULTS */}
          {analysis && (
            <div>
              {/* Score header */}
              <div style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 14, padding: 20, marginBottom: 12,
                display: 'flex', alignItems: 'center', gap: 20
              }}>
                <ScoreRing score={analysis.overall_score} size={110} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 22, fontWeight: 700 }}>Resume Score</span>
                    <span style={{
                      fontSize: 13, fontWeight: 600, padding: '4px 12px', borderRadius: 20,
                      background: `${scoreColor}20`, color: scoreColor,
                      border: `1px solid ${scoreColor}40`
                    }}>{scoreLabel}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 10 }}>
                    {analysis.summary}
                  </p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{
                      fontSize: 12, padding: '4px 10px', borderRadius: 8,
                      background: 'var(--bg-secondary)', color: 'var(--text-secondary)',
                      border: '1px solid var(--border)'
                    }}>
                      {analysis.experience_level} Level
                    </span>
                  </div>
                </div>
              </div>

              {/* Skills found */}
              <Section title="Skills Found" icon={CheckCircle} color="#10b981">
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {analysis.skills_found?.map(s => (
                    <SkillTag key={s} skill={s} type="good" />
                  ))}
                </div>
              </Section>

              {/* Missing skills */}
              <Section title="Missing Skills" icon={XCircle} color="#ef4444">
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {analysis.missing_skills?.map(s => (
                    <SkillTag key={s} skill={s} type="missing" />
                  ))}
                </div>
              </Section>

              {/* Strengths */}
              <Section title="Strengths" icon={TrendingUp} color="#6366f1">
                {analysis.strengths?.map((s, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 10, alignItems: 'flex-start',
                    padding: '7px 0',
                    borderBottom: i < analysis.strengths.length - 1
                      ? '1px solid var(--border)' : 'none'
                  }}>
                    <CheckCircle size={14} color="#10b981" style={{ marginTop: 1, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{s}</span>
                  </div>
                ))}
              </Section>

              {/* Improvement tips */}
              <Section title="Improvement Tips" icon={Zap} color="#f59e0b">
                {analysis.improvement_tips?.map((tip, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 10, alignItems: 'flex-start',
                    padding: '8px 0',
                    borderBottom: i < analysis.improvement_tips.length - 1
                      ? '1px solid var(--border)' : 'none'
                  }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%',
                      background: 'rgba(245,158,11,0.1)',
                      border: '1px solid rgba(245,158,11,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 700, color: '#f59e0b', flexShrink: 0
                    }}>{i + 1}</div>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {tip}
                    </span>
                  </div>
                ))}
              </Section>

              {/* Recommended roles */}
              <Section title="Recommended Roles" icon={Briefcase} color="#14b8a6">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {analysis.recommended_roles?.map(role => (
                    <span key={role} style={{
                      fontSize: 13, padding: '6px 14px', borderRadius: 20,
                      background: 'rgba(20,184,166,0.1)', color: '#14b8a6',
                      border: '1px solid rgba(20,184,166,0.2)', fontWeight: 500
                    }}>{role}</span>
                  ))}
                </div>
              </Section>
            </div>
          )}
        </div>
      )}

      {/* TAILOR TAB */}
      {tab === 'tailor' && (
        <div style={{ display: 'grid', gridTemplateColumns: tailoring ? '1fr 1fr' : '1fr', gap: 20 }}>
          <div>
            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: 'block', fontSize: 13,
                fontWeight: 600, marginBottom: 8
              }}>
                Your Resume Text
              </label>
              <textarea
                className="input-field"
                placeholder="Paste your resume content here..."
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
                rows={10}
                style={{ resize: 'vertical', lineHeight: 1.6 }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: 'block', fontSize: 13,
                fontWeight: 600, marginBottom: 8
              }}>
                Job Description
              </label>
              <textarea
                className="input-field"
                placeholder="Paste the job description here..."
                value={jobDesc}
                onChange={e => setJobDesc(e.target.value)}
                rows={8}
                style={{ resize: 'vertical', lineHeight: 1.6 }}
              />
            </div>

            <button
              onClick={handleTailor}
              className="btn-primary"
              disabled={tailorLoading || !resumeText || !jobDesc}
              style={{
                width: '100%', justifyContent: 'center',
                padding: '13px', fontSize: 15,
                opacity: tailorLoading || !resumeText || !jobDesc ? 0.6 : 1
              }}
            >
              {tailorLoading ? (
                <>
                  <div style={{
                    width: 16, height: 16,
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                  Tailoring with AI...
                </>
              ) : (
                <><Target size={16} /> Get Tailoring Suggestions</>
              )}
            </button>
          </div>

          {/* TAILORING RESULTS */}
          {tailoring && (
            <div>
              {/* Match score */}
              <div style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 14, padding: 20, marginBottom: 12,
                display: 'flex', alignItems: 'center', gap: 20
              }}>
                <ScoreRing score={tailoring.match_score} size={100} />
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
                    Job Match Score
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                    Your resume matches{' '}
                    <strong style={{ color: 'var(--accent-primary)' }}>
                      {tailoring.match_score}%
                    </strong>
                    {' '}of this job's requirements
                  </p>
                </div>
              </div>

              {/* Matching skills */}
              <Section title="Matching Skills" icon={CheckCircle} color="#10b981">
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {tailoring.matching_skills?.map(s => (
                    <SkillTag key={s} skill={s} type="good" />
                  ))}
                </div>
              </Section>

              {/* Missing skills */}
              <Section title="Skills to Add" icon={XCircle} color="#ef4444">
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {tailoring.missing_skills?.map(s => (
                    <SkillTag key={s} skill={s} type="missing" />
                  ))}
                </div>
              </Section>

              {/* Keywords */}
              <Section title="Keywords to Include" icon={Zap} color="#f59e0b">
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {tailoring.keywords_to_add?.map(k => (
                    <SkillTag key={k} skill={k} type="warning" />
                  ))}
                </div>
              </Section>

              {/* Suggestions */}
              <Section title="Tailoring Suggestions" icon={TrendingUp} color="#6366f1">
                {tailoring.suggestions?.map((s, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 10,
                    padding: '8px 0',
                    borderBottom: i < tailoring.suggestions.length - 1
                      ? '1px solid var(--border)' : 'none'
                  }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%',
                      background: 'rgba(99,102,241,0.1)',
                      border: '1px solid rgba(99,102,241,0.2)',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: 11,
                      fontWeight: 700, color: '#6366f1', flexShrink: 0
                    }}>{i + 1}</div>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {s}
                    </span>
                  </div>
                ))}
              </Section>

              {/* Tailored summary */}
              <Section title="Suggested Summary" icon={FileText} color="#14b8a6" defaultOpen={false}>
                <p style={{
                  fontSize: 13, color: 'var(--text-secondary)',
                  lineHeight: 1.7, fontStyle: 'italic'
                }}>
                  "{tailoring.tailored_summary}"
                </p>
              </Section>
            </div>
          )}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}