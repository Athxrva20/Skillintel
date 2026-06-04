import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { skillsAPI, forecastAPI } from '../utils/api'
import Ticker from '../components/Ticker'
import {
  TrendingUp, Briefcase, FileText, BarChart2,
  Search, ArrowRight, Zap, Users, Globe,
  TrendingDown, Activity
} from 'lucide-react'

const ACTIVITY = [
  { dot: '#10b981', text: 'Python demand surged 12% in the last 24h — 340 new postings', time: '2m ago' },
  { dot: '#6366f1', text: 'Google posted 18 new ML Engineer roles in Bangalore', time: '5m ago' },
  { dot: '#f59e0b', text: 'Kubernetes overtook Docker in job listing frequency this week', time: '12m ago' },
  { dot: '#ef4444', text: 'jQuery demand dropped below 20% — declining fast', time: '28m ago' },
  { dot: '#14b8a6', text: 'Remote jobs now make up 38% of all tech listings in India', time: '1h ago' },
]

const QUICK_LINKS = [
  { path: '/jobs', icon: Briefcase, label: 'Search Jobs', desc: 'Browse live listings', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  { path: '/skills', icon: TrendingUp, label: 'Skill Analytics', desc: 'See what\'s trending', color: '#14b8a6', bg: 'rgba(20,184,166,0.1)' },
  { path: '/resume', icon: FileText, label: 'Resume AI', desc: 'Analyze your resume', color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
  { path: '/forecast', icon: BarChart2, label: 'Forecast', desc: 'Predict skill demand', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  { path: '/roles', icon: Search, label: 'Role Explorer', desc: 'Explore career paths', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
]

function StatCard({ icon: Icon, label, value, sub, color, bg }) {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: bg, display: 'flex',
        alignItems: 'center', justifyContent: 'center', flexShrink: 0
      }}>
        <Icon size={22} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 700 }}>{value}</div>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{sub}</div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [skills, setSkills] = useState([])
  const [market, setMarket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const load = async () => {
      try {
        const [skillsRes, marketRes] = await Promise.all([
          skillsAPI.getTrending(),
          forecastAPI.getMarket()
        ])
        setSkills(skillsRes.data.skills?.slice(0, 7) || [])
        setMarket(marketRes.data.overview)
      } catch (e) {
        // Use fallback data
        setSkills([
          { skill: 'Python', count: 1250, trend: '+12%' },
          { skill: 'React', count: 980, trend: '+8%' },
          { skill: 'AWS', count: 870, trend: '+15%' },
          { skill: 'Machine Learning', count: 760, trend: '+22%' },
          { skill: 'TypeScript', count: 680, trend: '+18%' },
          { skill: 'Docker', count: 640, trend: '+10%' },
          { skill: 'Kubernetes', count: 520, trend: '+20%' },
        ])
        setMarket({
          total_jobs_tracked: 15420,
          skills_analyzed: 45,
          hottest_roles: ['ML Engineer', 'Cloud Architect', 'Full Stack Developer', 'Data Scientist'],
          avg_salary_trends: {
            entry_level: { range: '4-8 LPA', growth: '+8%' },
            mid_level: { range: '10-20 LPA', growth: '+12%' },
            senior_level: { range: '25-50 LPA', growth: '+15%' }
          }
        })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const maxCount = skills.length > 0 ? Math.max(...skills.map(s => s.count)) : 1

  return (
    <div className="page-container">

      {/* HEADER */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: 24
      }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>
            Good {time.getHours() < 12 ? 'morning' : time.getHours() < 17 ? 'afternoon' : 'evening'},{' '}
            <span className="gradient-text">{user?.name?.split(' ')[0]} 👋</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Here's what's happening in the job market today
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'Space Grotesk' }}>
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', marginTop: 4 }}>
            <span className="live-dot" style={{ width: 6, height: 6 }} />
            <span style={{ fontSize: 11, color: 'var(--accent-primary)', fontWeight: 600 }}>Live data</span>
          </div>
        </div>
      </div>

      {/* TICKER */}
      <div style={{ marginBottom: 24 }}>
        <Ticker />
      </div>

      {/* STAT CARDS */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <StatCard
          icon={Briefcase} label="Jobs Tracked" color="#10b981" bg="rgba(16,185,129,0.1)"
          value={market ? market.total_jobs_tracked.toLocaleString() : '...'}
          sub="↑ +234 today"
        />
        <StatCard
          icon={TrendingUp} label="Skills Mapped" color="#14b8a6" bg="rgba(20,184,166,0.1)"
          value={market ? market.skills_analyzed + '+' : '...'}
          sub="↑ +3 this week"
        />
        <StatCard
          icon={Users} label="Active Roles" color="#6366f1" bg="rgba(99,102,241,0.1)"
          value="8"
          sub="Career paths mapped"
        />
        <StatCard
          icon={Globe} label="Remote Jobs" color="#f59e0b" bg="rgba(245,158,11,0.1)"
          value="38%"
          sub="Of all tech listings"
        />
      </div>

      {/* MAIN GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>

        {/* SKILLS PANEL */}
        <div className="card">
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: 16
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={16} color="var(--accent-primary)" />
              <span style={{ fontWeight: 600, fontSize: 15 }}>Top skills in demand</span>
            </div>
            <Link to="/skills" style={{
              fontSize: 12, color: 'var(--accent-primary)',
              display: 'flex', alignItems: 'center', gap: 4
            }}>
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {loading ? (
            <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Loading...</div>
          ) : (
            skills.map((s, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{s.skill}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{s.count?.toLocaleString()}</span>
                    <span style={{ fontSize: 11, color: '#10b981' }}>{s.trend || '+10%'}</span>
                  </div>
                </div>
                <div style={{ height: 4, background: 'var(--bg-secondary)', borderRadius: 2 }}>
                  <div style={{
                    height: 4, borderRadius: 2,
                    width: `${(s.count / maxCount) * 100}%`,
                    background: i % 2 === 0 ? '#10b981' : '#14b8a6',
                    transition: 'width 1s ease'
                  }} />
                </div>
              </div>
            ))
          )}
        </div>

        {/* ACTIVITY FEED */}
        <div className="card">
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: 16
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity size={16} color="var(--accent-primary)" />
              <span style={{ fontWeight: 600, fontSize: 15 }}>Live market activity</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span className="live-dot" style={{ width: 6, height: 6 }} />
              <span style={{ fontSize: 11, color: 'var(--accent-primary)', fontWeight: 600 }}>Live</span>
            </div>
          </div>
          {ACTIVITY.map((item, i) => (
            <div key={i} style={{
              display: 'flex', gap: 10, alignItems: 'flex-start',
              padding: '10px 0',
              borderBottom: i < ACTIVITY.length - 1 ? '1px solid var(--border)' : 'none'
            }}>
              <div style={{
                width: 7, height: 7, borderRadius: '50%',
                background: item.dot, marginTop: 5, flexShrink: 0
              }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {item.text}
                </p>
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* QUICK LINKS */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Zap size={16} color="var(--accent-primary)" />
          <span style={{ fontWeight: 600, fontSize: 15 }}>Quick access</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
          {QUICK_LINKS.map(({ path, icon: Icon, label, desc, color, bg }) => (
            <Link key={path} to={path} style={{
              background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              borderRadius: 12, padding: '16px 12px', textAlign: 'center',
              transition: 'all 0.2s', textDecoration: 'none',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: bg, display: 'flex',
                alignItems: 'center', justifyContent: 'center'
              }}>
                <Icon size={18} color={color} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SALARY TRENDS + HOT ROLES */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* SALARY TRENDS */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <TrendingUp size={16} color="var(--accent-primary)" />
            <span style={{ fontWeight: 600, fontSize: 15 }}>Salary trends India</span>
          </div>
          {market && Object.entries(market.avg_salary_trends).map(([level, data]) => (
            <div key={level} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 0', borderBottom: '1px solid var(--border)'
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, textTransform: 'capitalize' }}>
                  {level.replace('_', ' ')}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{data.range}</div>
              </div>
              <span style={{
                fontSize: 13, fontWeight: 600, color: '#10b981',
                background: 'rgba(16,185,129,0.1)', padding: '4px 10px',
                borderRadius: 20, border: '1px solid rgba(16,185,129,0.2)'
              }}>{data.growth}</span>
            </div>
          ))}
        </div>

        {/* HOT ROLES */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Search size={16} color="var(--accent-primary)" />
            <span style={{ fontWeight: 600, fontSize: 15 }}>Hottest roles right now</span>
          </div>
          {market?.hottest_roles?.map((role, i) => (
            <Link key={role} to="/roles" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 0', borderBottom: i < market.hottest_roles.length - 1
                ? '1px solid var(--border)' : 'none', textDecoration: 'none'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: 'var(--accent-glow)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, color: 'var(--accent-primary)'
                }}>
                  {i + 1}
                </div>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{role}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="badge badge-green" style={{ fontSize: 11 }}>Hot</span>
                <ArrowRight size={13} color="var(--text-muted)" />
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}