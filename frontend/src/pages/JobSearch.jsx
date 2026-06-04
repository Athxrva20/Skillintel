import { useState } from 'react'
import { jobsAPI } from '../utils/api'
import toast from 'react-hot-toast'
import {
  Search, MapPin, Briefcase, ExternalLink,
  Bookmark, BookmarkCheck, Filter, X,
  Building, Clock, DollarSign, Loader
} from 'lucide-react'

const LOCATIONS = ['India', 'Bangalore', 'Mumbai', 'Pune', 'Hyderabad', 'Delhi', 'Remote']
const CATEGORIES = ['All', 'Frontend', 'Backend', 'Full Stack', 'Data Science', 'DevOps', 'ML/AI', 'Cloud']
const SOURCES = ['All Sources', 'Adzuna', 'JSearch', 'Jooble']
const ALL_SUGGESTIONS = [
  'Python Developer', 'React Developer', 'Full Stack Developer',
  'Data Scientist', 'ML Engineer', 'DevOps Engineer',
  'Backend Developer', 'Frontend Developer', 'Cloud Architect',
  'Java Developer', 'Node.js Developer', 'Angular Developer',
  'Vue.js Developer', 'Django Developer', 'Flask Developer',
  'AWS Engineer', 'Kubernetes Engineer', 'Docker Engineer',
  'Data Analyst', 'Business Analyst', 'Product Manager',
  'UI/UX Designer', 'Android Developer', 'iOS Developer',
  'Flutter Developer', 'React Native Developer', 'TypeScript Developer',
  'Golang Developer', 'Rust Developer', 'Scala Developer',
  'Database Administrator', 'SRE Engineer', 'Security Engineer',
  'Blockchain Developer', 'AI Engineer', 'NLP Engineer',
  'Computer Vision Engineer', 'Data Engineer', 'ETL Developer',
  'Tableau Developer', 'Power BI Developer', 'Spark Developer',
]

function JobCard({ job, onSave, saved }) {
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await onSave(job)
    setSaving(false)
  }

  const formatSalary = (min, max) => {
    if (!min && !max) return null
    if (min && max) return `₹${Math.round(min / 100000)}L - ₹${Math.round(max / 100000)}L`
    if (min) return `₹${Math.round(min / 100000)}L+`
    return null
  }

  const formatDate = (date) => {
    if (!date) return 'Recently'
    const d = new Date(date)
    const diff = Math.floor((new Date() - d) / (1000 * 60 * 60 * 24))
    if (diff === 0) return 'Today'
    if (diff === 1) return 'Yesterday'
    if (diff < 7) return `${diff}d ago`
    return `${Math.floor(diff / 7)}w ago`
  }

  const salary = formatSalary(job.salary_min, job.salary_max)

  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: 'var(--accent-glow)',
              border: '1px solid rgba(16,185,129,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700, color: 'var(--accent-primary)', flexShrink: 0
            }}>
              {job.company?.charAt(0) || '?'}
            </div>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 2 }}>{job.title}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--text-secondary)' }}>
                  <Building size={12} /> {job.company || 'Unknown'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--text-secondary)' }}>
                  <MapPin size={12} /> {job.location || 'India'}
                </span>
                {salary && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#10b981' }}>
                    <DollarSign size={12} /> {salary}
                  </span>
                )}
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
                  <Clock size={11} /> {formatDate(job.posted_at)}
                </span>
              </div>
            </div>
          </div>
          {job.description && (
            <p style={{
              fontSize: 13, color: 'var(--text-secondary)',
              lineHeight: 1.6, marginBottom: 12,
              display: '-webkit-box', WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical', overflow: 'hidden'
            }}>
              {job.description}
            </p>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontSize: 11, padding: '3px 8px', borderRadius: 10,
              background: 'var(--bg-secondary)', color: 'var(--text-secondary)',
              border: '1px solid var(--border)', textTransform: 'capitalize'
            }}>
              {job.source || 'job board'}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
          <a href={job.url} target="_blank" rel="noopener noreferrer"
            className="btn-primary"
            style={{ fontSize: 12, padding: '7px 14px', borderRadius: 7 }}>
            Apply <ExternalLink size={12} />
          </a>
          <button onClick={handleSave} disabled={saving} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            fontSize: 12, padding: '7px 14px', borderRadius: 7,
            background: saved ? 'var(--accent-glow)' : 'transparent',
            border: '1px solid var(--border-light)',
            color: saved ? 'var(--accent-primary)' : 'var(--text-secondary)',
            cursor: 'pointer', transition: 'all 0.2s'
          }}>
            {saved ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
            {saving ? 'Saving...' : saved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function JobSearch() {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('India')
  const [category, setCategory] = useState('All')
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [savedJobs, setSavedJobs] = useState(new Set())
  const [showFilters, setShowFilters] = useState(false)
  const [source, setSource] = useState('All Sources')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeSuggestion, setActiveSuggestion] = useState(-1)

  // Only show suggestions when user has typed something
  const filteredSuggestions = query.length > 0
    ? ALL_SUGGESTIONS.filter(s =>
        s.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 7)
    : []

  const handleSearch = async (e) => {
    e?.preventDefault()
    if (!query.trim()) {
      toast.error('Please enter a job title or skill')
      return
    }
    setLoading(true)
    setSearched(true)
    setShowSuggestions(false)
    try {
      const searchQuery = category !== 'All' ? `${query} ${category}` : query
      const res = await jobsAPI.search(searchQuery, location, 1)
      setJobs(res.data.jobs || [])
      if (res.data.jobs?.length === 0) {
        toast('No jobs found. Try a different search.', { icon: '🔍' })
      } else {
        toast.success(`Found ${res.data.jobs.length} jobs!`)
      }
    } catch (err) {
      toast.error('Search failed. Using demo data.')
      setJobs([
        {
          id: 1, title: 'Senior Python Developer', company: 'TechCorp India',
          location: 'Bangalore',
          description: 'We are looking for an experienced Python developer to join our team. Work on cutting-edge ML pipelines and data engineering solutions.',
          url: '#', source: 'adzuna', salary_min: 1500000, salary_max: 2500000, posted_at: new Date()
        },
        {
          id: 2, title: 'React Frontend Engineer', company: 'StartupXYZ',
          location: 'Remote',
          description: 'Join our fast-growing startup as a React developer. Build beautiful user interfaces and work closely with the product team.',
          url: '#', source: 'jsearch', salary_min: 800000, salary_max: 1500000, posted_at: new Date(Date.now() - 86400000)
        },
        {
          id: 3, title: 'DevOps Engineer', company: 'CloudSystems',
          location: 'Pune',
          description: 'Looking for a DevOps engineer with Kubernetes and AWS experience to manage cloud infrastructure and CI/CD pipelines.',
          url: '#', source: 'jooble', salary_min: 1200000, salary_max: 2000000, posted_at: new Date(Date.now() - 172800000)
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (job) => {
    try {
      await jobsAPI.save(job)
      setSavedJobs(prev => new Set([...prev, job.id]))
      toast.success('Job saved!')
    } catch {
      toast.error('Failed to save job')
    }
  }

  return (
    <div className="page-container">

      {/* HEADER */}
      <div style={{ marginBottom: 24 }}>
        <h1 className="page-title">Job Search</h1>
        <p className="page-subtitle">
          Search across Adzuna, LinkedIn, Indeed and Jooble — all in one place
        </p>
      </div>

      {/* SEARCH BOX */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 14, padding: 20, marginBottom: 20
      }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>

          {/* Query input with autocomplete */}
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={16} style={{
              position: 'absolute', left: 12, top: '50%',
              transform: 'translateY(-50%)', color: 'var(--text-muted)', zIndex: 1
            }} />
            <input
              className="input-field"
              placeholder="Job title, skill, or keyword..."
              value={query}
              onChange={e => {
                setQuery(e.target.value)
                setShowSuggestions(true)
                setActiveSuggestion(-1)
              }}
              onKeyDown={e => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault()
                  setActiveSuggestion(p => Math.min(p + 1, filteredSuggestions.length - 1))
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault()
                  setActiveSuggestion(p => Math.max(p - 1, 0))
                } else if (e.key === 'Enter') {
                  if (showSuggestions && activeSuggestion >= 0 && filteredSuggestions.length > 0) {
                    setQuery(filteredSuggestions[activeSuggestion])
                    setShowSuggestions(false)
                    setActiveSuggestion(-1)
                  } else {
                    handleSearch()
                  }
                } else if (e.key === 'Escape') {
                  setShowSuggestions(false)
                  setActiveSuggestion(-1)
                }
              }}
              onFocus={() => { if (query.length > 0) setShowSuggestions(true) }}
              onBlur={() => setTimeout(() => { setShowSuggestions(false); setActiveSuggestion(-1) }, 150)}
              style={{ paddingLeft: 38 }}
              autoComplete="off"
            />

            {/* Suggestions dropdown — only when typing */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-light)',
                borderRadius: 10, marginTop: 4, zIndex: 100,
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '6px 12px',
                  borderBottom: '1px solid var(--border)',
                  fontSize: 10, color: 'var(--text-muted)',
                  fontWeight: 600, letterSpacing: '0.5px'
                }}>
                  SUGGESTIONS
                </div>
                {filteredSuggestions.map((s, i) => (
                  <div
                    key={s}
                    onMouseDown={() => {
                      setQuery(s)
                      setShowSuggestions(false)
                      setActiveSuggestion(-1)
                    }}
                    onMouseEnter={() => setActiveSuggestion(i)}
                    style={{
                      padding: '10px 14px', cursor: 'pointer',
                      fontSize: 13, display: 'flex', alignItems: 'center', gap: 10,
                      background: i === activeSuggestion ? 'var(--accent-glow)' : 'transparent',
                      color: i === activeSuggestion ? 'var(--accent-primary)' : 'var(--text-primary)',
                      borderBottom: i < filteredSuggestions.length - 1
                        ? '1px solid var(--border)' : 'none',
                      transition: 'all 0.1s'
                    }}
                  >
                    <Search size={13} color="var(--text-muted)" />
                    <span>{s}</span>
                    {i === activeSuggestion && (
                      <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)' }}>
                        ↵ select
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Location */}
          <div style={{ position: 'relative', minWidth: 160 }}>
            <MapPin size={15} style={{
              position: 'absolute', left: 10, top: '50%',
              transform: 'translateY(-50%)', color: 'var(--text-muted)'
            }} />
            <select
              className="input-field"
              value={location}
              onChange={e => setLocation(e.target.value)}
              style={{ paddingLeft: 30, cursor: 'pointer' }}
            >
              {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          {/* Filter toggle */}
          <button onClick={() => setShowFilters(!showFilters)} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '10px 16px', borderRadius: 8,
            background: showFilters ? 'var(--accent-glow)' : 'var(--bg-secondary)',
            border: '1px solid var(--border-light)',
            color: showFilters ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontSize: 13, fontWeight: 500, cursor: 'pointer'
          }}>
            <Filter size={14} /> Filters
          </button>

          {/* Search button */}
          <button
            onClick={handleSearch}
            className="btn-primary"
            disabled={loading}
            style={{ padding: '10px 24px', fontSize: 14 }}
          >
            {loading
              ? <Loader size={15} style={{ animation: 'spin 0.8s linear infinite' }} />
              : <Search size={15} />}
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Filters row */}
        {showFilters && (
          <div style={{
            display: 'flex', gap: 10, paddingTop: 14,
            borderTop: '1px solid var(--border)', flexWrap: 'wrap'
          }}>
            <div>
              <div style={{
                fontSize: 11, color: 'var(--text-muted)',
                marginBottom: 6, fontWeight: 500
              }}>CATEGORY</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {CATEGORIES.map(c => (
                  <button key={c} onClick={() => setCategory(c)} style={{
                    fontSize: 12, padding: '4px 12px', borderRadius: 20,
                    cursor: 'pointer',
                    background: category === c ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                    color: category === c ? 'white' : 'var(--text-secondary)',
                    border: '1px solid var(--border-light)', transition: 'all 0.15s'
                  }}>{c}</button>
                ))}
              </div>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <div style={{
                fontSize: 11, color: 'var(--text-muted)',
                marginBottom: 6, fontWeight: 500
              }}>SOURCE</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {SOURCES.map(s => (
                  <button key={s} onClick={() => setSource(s)} style={{
                    fontSize: 12, padding: '4px 12px', borderRadius: 20,
                    cursor: 'pointer',
                    background: source === s ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                    color: source === s ? 'white' : 'var(--text-secondary)',
                    border: '1px solid var(--border-light)', transition: 'all 0.15s'
                  }}>{s}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Popular tags */}
        {!searched && (
          <div style={{
            display: 'flex', gap: 8, flexWrap: 'wrap',
            marginTop: showFilters ? 14 : 0
          }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Popular:</span>
            {['Python Developer', 'React Engineer', 'Data Scientist', 'DevOps', 'ML Engineer', 'Full Stack'].map(tag => (
              <button key={tag} onClick={() => {
                setQuery(tag)
                setShowSuggestions(false)
              }} style={{
                fontSize: 12, padding: '4px 12px', borderRadius: 20,
                background: 'var(--bg-secondary)', color: 'var(--text-secondary)',
                border: '1px solid var(--border)', cursor: 'pointer', transition: 'all 0.15s'
              }}>{tag}</button>
            ))}
          </div>
        )}
      </div>

      {/* LOADING */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{
            width: 40, height: 40,
            border: '3px solid var(--border-light)',
            borderTop: '3px solid var(--accent-primary)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Searching across all job boards...
          </p>
        </div>
      )}

      {/* RESULTS */}
      {!loading && searched && (
        <div>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: 16
          }}>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              Found{' '}
              <strong style={{ color: 'var(--text-primary)' }}>{jobs.length}</strong>
              {' '}jobs for{' '}
              <strong style={{ color: 'var(--accent-primary)' }}>"{query}"</strong>
              {location !== 'India' && ` in ${location}`}
            </p>
            <button onClick={() => {
              setJobs([]); setSearched(false); setQuery('')
            }} style={{
              display: 'flex', alignItems: 'center', gap: 4,
              fontSize: 12, color: 'var(--text-secondary)',
              background: 'none', border: 'none', cursor: 'pointer'
            }}>
              <X size={13} /> Clear results
            </button>
          </div>
          {jobs.map((job, i) => (
            <JobCard
              key={job.id || i}
              job={job}
              onSave={handleSave}
              saved={savedJobs.has(job.id)}
            />
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && !searched && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            background: 'var(--accent-glow)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            border: '1px solid rgba(16,185,129,0.2)'
          }}>
            <Briefcase size={28} color="var(--accent-primary)" />
          </div>
          <h3 style={{ fontSize: 18, marginBottom: 8 }}>
            Search for your next opportunity
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Enter a job title, skill or keyword above to search across all job boards
          </p>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}