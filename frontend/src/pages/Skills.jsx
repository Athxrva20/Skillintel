import { useState, useEffect } from 'react'
import { skillsAPI } from '../utils/api'
import toast from 'react-hot-toast'
import {
  TrendingUp, TrendingDown, BarChart2,
  Search, Filter, Zap, Award, RefreshCw
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts'

const CATEGORIES = ['All', 'Programming', 'Frontend', 'Backend', 'Database', 'Cloud', 'AI/ML', 'Mobile', 'Tools']

const TRENDING_DATA = [
  { skill: 'Python', count: 1250, trend: '+12%', up: true, category: 'Programming' },
  { skill: 'React', count: 980, trend: '+8%', up: true, category: 'Frontend' },
  { skill: 'AWS', count: 870, trend: '+15%', up: true, category: 'Cloud' },
  { skill: 'Machine Learning', count: 760, trend: '+22%', up: true, category: 'AI/ML' },
  { skill: 'TypeScript', count: 680, trend: '+18%', up: true, category: 'Programming' },
  { skill: 'Docker', count: 640, trend: '+10%', up: true, category: 'Cloud' },
  { skill: 'Kubernetes', count: 520, trend: '+20%', up: true, category: 'Cloud' },
  { skill: 'Node.js', count: 590, trend: '+5%', up: true, category: 'Backend' },
  { skill: 'SQL', count: 570, trend: '+3%', up: true, category: 'Database' },
  { skill: 'Data Science', count: 490, trend: '+16%', up: true, category: 'AI/ML' },
  { skill: 'Flutter', count: 320, trend: '+14%', up: true, category: 'Mobile' },
  { skill: 'Vue.js', count: 290, trend: '+6%', up: true, category: 'Frontend' },
  { skill: 'Angular', count: 380, trend: '-2%', up: false, category: 'Frontend' },
  { skill: 'jQuery', count: 210, trend: '-15%', up: false, category: 'Frontend' },
  { skill: 'PHP', count: 260, trend: '-8%', up: false, category: 'Backend' },
]

const MONTHLY_TREND = [
  { month: 'Jan', Python: 950, React: 780, AWS: 620, ML: 520 },
  { month: 'Feb', Python: 980, React: 810, AWS: 670, ML: 560 },
  { month: 'Mar', Python: 1020, React: 850, AWS: 710, ML: 610 },
  { month: 'Apr', Python: 1080, React: 900, AWS: 770, ML: 670 },
  { month: 'May', Python: 1150, React: 940, AWS: 820, ML: 720 },
  { month: 'Jun', Python: 1250, React: 980, AWS: 870, ML: 760 },
]

const RADAR_DATA = [
  { subject: 'Python', value: 94 },
  { subject: 'React', value: 82 },
  { subject: 'AWS', value: 76 },
  { subject: 'ML', value: 68 },
  { subject: 'Docker', value: 61 },
  { subject: 'SQL', value: 57 },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border-light)',
        borderRadius: 8, padding: '10px 14px', fontSize: 12
      }}>
        <p style={{ fontWeight: 600, marginBottom: 6 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: {p.value?.toLocaleString()}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function Skills() {
  const [skills, setSkills] = useState(TRENDING_DATA)
  const [filtered, setFiltered] = useState(TRENDING_DATA)
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [view, setView] = useState('grid')
  const [loading, setLoading] = useState(false)
  const [activeChart, setActiveChart] = useState('bar')

  useEffect(() => {
    let result = skills
    if (category !== 'All') {
      result = result.filter(s => s.category === category)
    }
    if (search) {
      result = result.filter(s => s.skill.toLowerCase().includes(search.toLowerCase()))
    }
    setFiltered(result)
  }, [category, search, skills])

  const loadLiveData = async () => {
    setLoading(true)
    try {
      const res = await skillsAPI.getTrending()
      if (res.data.skills?.length > 0) {
        setSkills(res.data.skills)
        toast.success('Skills data refreshed!')
      }
    } catch {
      toast('Using cached data', { icon: '📊' })
    } finally {
      setLoading(false)
    }
  }

  const rising = filtered.filter(s => s.up)
  const declining = filtered.filter(s => !s.up)
  const maxCount = Math.max(...filtered.map(s => s.count))

  return (
    <div className="page-container">

      {/* HEADER */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: 24
      }}>
        <div>
          <h1 className="page-title">Skills Analytics</h1>
          <p className="page-subtitle">
            Real-time skill demand tracked across thousands of job postings
          </p>
        </div>
        <button onClick={loadLiveData} disabled={loading} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '9px 16px', borderRadius: 8,
          background: 'var(--accent-glow)',
          border: '1px solid rgba(16,185,129,0.2)',
          color: 'var(--accent-primary)', fontSize: 13,
          fontWeight: 500, cursor: 'pointer'
        }}>
          <RefreshCw size={14} style={{
            animation: loading ? 'spin 0.8s linear infinite' : 'none'
          }} />
          {loading ? 'Refreshing...' : 'Refresh data'}
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { icon: TrendingUp, label: 'Rising Skills', value: rising.length, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
          { icon: TrendingDown, label: 'Declining Skills', value: declining.length, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
          { icon: Award, label: 'Top Skill', value: 'Python', color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
          { icon: Zap, label: 'Fastest Growing', value: 'ML +22%', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 10,
              background: bg, display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <Icon size={20} color={color} />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS SECTION */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 24 }}>

        {/* MAIN CHART */}
        <div className="card">
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: 20
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <BarChart2 size={16} color="var(--accent-primary)" />
              <span style={{ fontWeight: 600, fontSize: 15 }}>
                {activeChart === 'bar' ? 'Skill Demand Overview' : 'Skill Growth Trend (6 months)'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['bar', 'line'].map(c => (
                <button key={c} onClick={() => setActiveChart(c)} style={{
                  padding: '4px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer',
                  background: activeChart === c ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                  color: activeChart === c ? 'white' : 'var(--text-secondary)',
                  border: '1px solid var(--border-light)', textTransform: 'capitalize'
                }}>{c}</button>
              ))}
            </div>
          </div>

          {activeChart === 'bar' ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={TRENDING_DATA.slice(0, 8)} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="skill" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={MONTHLY_TREND} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="Python" stroke="#10b981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="React" stroke="#14b8a6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="AWS" stroke="#6366f1" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="ML" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}

          {activeChart === 'line' && (
            <div style={{ display: 'flex', gap: 16, marginTop: 12, justifyContent: 'center' }}>
              {[
                { label: 'Python', color: '#10b981' },
                { label: 'React', color: '#14b8a6' },
                { label: 'AWS', color: '#6366f1' },
                { label: 'ML', color: '#f59e0b' },
              ].map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 12, height: 3, background: l.color, borderRadius: 2 }} />
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{l.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RADAR CHART */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Zap size={16} color="var(--accent-primary)" />
            <span style={{ fontWeight: 600, fontSize: 15 }}>Top 6 Skills Radar</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={RADAR_DATA}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
              <PolarRadiusAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} domain={[0, 100]} />
              <Radar dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* FILTER BAR */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 12, padding: '14px 16px', marginBottom: 20,
        display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{
            position: 'absolute', left: 10, top: '50%',
            transform: 'translateY(-50%)', color: 'var(--text-muted)'
          }} />
          <input
            className="input-field"
            placeholder="Search skills..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 32, padding: '8px 12px 8px 32px' }}
          />
        </div>

        {/* Category filters */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)} style={{
              fontSize: 12, padding: '5px 12px', borderRadius: 20,
              cursor: 'pointer',
              background: category === c ? 'var(--accent-primary)' : 'var(--bg-secondary)',
              color: category === c ? 'white' : 'var(--text-secondary)',
              border: '1px solid var(--border-light)', transition: 'all 0.15s'
            }}>{c}</button>
          ))}
        </div>

        {/* View toggle */}
        <div style={{ display: 'flex', gap: 4, marginLeft: 'auto' }}>
          {['grid', 'list'].map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: '6px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer',
              background: view === v ? 'var(--accent-glow)' : 'transparent',
              color: view === v ? 'var(--accent-primary)' : 'var(--text-secondary)',
              border: '1px solid var(--border-light)', textTransform: 'capitalize'
            }}>{v}</button>
          ))}
        </div>
      </div>

      {/* SKILLS LIST/GRID */}
      {view === 'list' ? (
        <div className="card">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
            gap: 12, padding: '8px 0',
            borderBottom: '1px solid var(--border)',
            marginBottom: 8
          }}>
            {['Skill', 'Category', 'Demand', 'Trend', 'Bar'].map(h => (
              <span key={h} style={{
                fontSize: 11, fontWeight: 600,
                color: 'var(--text-muted)', textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>{h}</span>
            ))}
          </div>
          {filtered.map((s, i) => (
            <div key={s.skill} style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
              gap: 12, padding: '12px 0', alignItems: 'center',
              borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none'
            }}>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{s.skill}</span>
              <span style={{
                fontSize: 12, padding: '3px 8px', borderRadius: 10, width: 'fit-content',
                background: 'var(--bg-secondary)', color: 'var(--text-secondary)',
                border: '1px solid var(--border)'
              }}>{s.category}</span>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{s.count.toLocaleString()}</span>
              <span style={{
                fontSize: 13, fontWeight: 600,
                color: s.up ? '#10b981' : '#ef4444',
                display: 'flex', alignItems: 'center', gap: 4
              }}>
                {s.up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                {s.trend}
              </span>
              <div style={{ height: 4, background: 'var(--bg-secondary)', borderRadius: 2 }}>
                <div style={{
                  height: 4, borderRadius: 2,
                  width: `${(s.count / maxCount) * 100}%`,
                  background: s.up ? '#10b981' : '#ef4444',
                  transition: 'width 0.8s ease'
                }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 12
        }}>
          {filtered.map(s => (
            <div key={s.skill} className="card" style={{ padding: 16 }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', marginBottom: 12
              }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{s.skill}</div>
                  <span style={{
                    fontSize: 11, padding: '2px 8px', borderRadius: 10,
                    background: 'var(--bg-secondary)', color: 'var(--text-secondary)',
                    border: '1px solid var(--border)'
                  }}>{s.category}</span>
                </div>
                <span style={{
                  fontSize: 12, fontWeight: 600, padding: '4px 8px', borderRadius: 8,
                  background: s.up ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                  color: s.up ? '#10b981' : '#ef4444',
                  border: `1px solid ${s.up ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
                  display: 'flex', alignItems: 'center', gap: 3
                }}>
                  {s.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {s.trend}
                </span>
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
                {s.count.toLocaleString()}
              </div>
              <div style={{ height: 4, background: 'var(--bg-secondary)', borderRadius: 2 }}>
                <div style={{
                  height: 4, borderRadius: 2,
                  width: `${(s.count / maxCount) * 100}%`,
                  background: s.up ? '#10b981' : '#ef4444',
                  transition: 'width 0.8s ease'
                }} />
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
                job postings
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}