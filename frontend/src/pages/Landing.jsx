import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import Ticker from '../components/Ticker'
import {
  TrendingUp, Briefcase, FileText, BarChart2,
  Search, ArrowRight, Sun, Moon, Zap, Shield,
  Users, Globe, ChevronRight, Star
} from 'lucide-react'

function useCounter(target, duration = 1500) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer); return }
      setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])
  return count
}

const features = [
  {
    icon: TrendingUp, color: '#10b981', bg: 'rgba(16,185,129,0.1)',
    title: 'Live Skill Analytics',
    desc: 'Track which skills are rising or falling in real-time across thousands of job postings.'
  },
  {
    icon: Briefcase, color: '#14b8a6', bg: 'rgba(20,184,166,0.1)',
    title: 'Smart Job Search',
    desc: 'Search across Adzuna, LinkedIn, Indeed and Jooble — all in one place.'
  },
  {
    icon: FileText, color: '#6366f1', bg: 'rgba(99,102,241,0.1)',
    title: 'Resume AI',
    desc: 'Upload your resume and get an AI score, skill gap analysis and tailoring tips.'
  },
  {
    icon: BarChart2, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',
    title: 'Demand Forecast',
    desc: 'See where skill demand is headed over the next 6 months before making career moves.'
  },
  {
    icon: Search, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)',
    title: 'Role Explorer',
    desc: 'Deep dive into any tech role — salary ranges, required skills, and growth outlook.'
  },
  {
    icon: Zap, color: '#ef4444', bg: 'rgba(239,68,68,0.1)',
    title: 'AI Chat Assistant',
    desc: 'Ask anything about careers, skills or job market trends and get instant AI answers.'
  },
]

const testimonials = [
  { name: 'Priya S.', role: 'Frontend Developer', text: 'SkilLintel helped me identify exactly which skills to learn before my job switch. Got a 40% salary hike!', stars: 5 },
  { name: 'Rahul M.', role: 'Data Scientist', text: 'The resume AI feature is incredible. It told me exactly what was missing and I got interviews within a week.', stars: 5 },
  { name: 'Ananya K.', role: 'DevOps Engineer', text: 'The skill forecast feature is what sets this apart. I knew Kubernetes was trending before my manager did!', stars: 5 },
]

export default function Landing() {
  const { theme, toggleTheme } = useTheme()
  const jobs = useCounter(15420)
  const skills = useCounter(45)
  const users = useCounter(2800)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>

      {/* TOP NAV */}
      <nav style={{
        maxWidth: 1200, margin: '0 auto', padding: '16px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, background: 'var(--gradient)',
            borderRadius: 10, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontWeight: 800, color: 'white', fontSize: 16
          }}>S</div>
          <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 18 }}>
            Skill<span style={{ color: 'var(--accent-primary)' }}>Intel</span>
          </span>
          <span style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: 'var(--accent-glow)', padding: '2px 8px',
            borderRadius: 20, border: '1px solid rgba(16,185,129,0.2)'
          }}>
            <span className="live-dot" style={{ width: 6, height: 6 }} />
            <span style={{ fontSize: 10, color: 'var(--accent-primary)', fontWeight: 600 }}>Live</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={toggleTheme} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 8, padding: '7px 9px', color: 'var(--text-secondary)',
            display: 'flex', alignItems: 'center'
          }}>
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <Link to="/login" style={{
            color: 'var(--text-secondary)', fontSize: 14,
            padding: '8px 16px', borderRadius: 8,
            border: '1px solid var(--border)', background: 'var(--bg-card)'
          }}>Sign in</Link>
          <Link to="/register" className="btn-primary" style={{ padding: '8px 18px', borderRadius: 8 }}>
            Get started
          </Link>
        </div>
      </nav>

      {/* TICKER */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 20px' }}>
        <Ticker />
      </div>

      {/* HERO */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>

          {/* LEFT */}
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'var(--accent-glow)', padding: '6px 14px',
              borderRadius: 20, border: '1px solid rgba(16,185,129,0.2)',
              marginBottom: 20
            }}>
              <Zap size={12} color="var(--accent-primary)" />
              <span style={{ fontSize: 12, color: 'var(--accent-primary)', fontWeight: 600 }}>
                AI-powered · Real-time market data
              </span>
            </div>

            <h1 style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.15, marginBottom: 16, letterSpacing: '-1px' }}>
              Your unfair edge<br />
              in the{' '}
              <span className="gradient-text">job market</span>
            </h1>

            <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 28, maxWidth: 440 }}>
              SkilLintel monitors thousands of live job postings, extracts what employers actually want,
              and shows you exactly where to focus your skills to get ahead.
            </p>

            <div style={{ display: 'flex', gap: 12, marginBottom: 36, flexWrap: 'wrap' }}>
              <Link to="/register" className="btn-primary" style={{ fontSize: 15, padding: '12px 24px' }}>
                Start for free <ArrowRight size={16} />
              </Link>
              <Link to="/login" className="btn-secondary" style={{ fontSize: 15, padding: '12px 24px' }}>
                Sign in
              </Link>
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 28 }}>
              {[
                { num: jobs.toLocaleString() + '+', label: 'Jobs tracked' },
                { num: skills + '+', label: 'Skills mapped' },
                { num: users.toLocaleString() + '+', label: 'Users' },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>{s.num}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Live preview card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* Search box */}
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 14, padding: 16
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'var(--bg-secondary)', border: '1px solid var(--border-light)',
                borderRadius: 8, padding: '10px 14px', marginBottom: 12
              }}>
                <Search size={15} color="var(--text-muted)" />
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Search skills, jobs or roles...</span>
                <span style={{
                  marginLeft: 'auto', fontSize: 11,
                  background: 'var(--bg-primary)', color: 'var(--text-muted)',
                  padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border)'
                }}>⌘K</span>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['Python', 'React', 'ML Engineer', 'AWS', 'Remote'].map(tag => (
                  <span key={tag} style={{
                    fontSize: 12, padding: '4px 10px', borderRadius: 20,
                    background: 'var(--accent-glow)', color: 'var(--accent-primary)',
                    border: '1px solid rgba(16,185,129,0.2)', cursor: 'pointer'
                  }}>{tag}</span>
                ))}
              </div>
            </div>

            {/* Skill bars preview */}
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 14, padding: 16
            }}>
              <div style={{
                fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)',
                marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6
              }}>
                <TrendingUp size={13} color="var(--accent-primary)" />
                Top skills right now
              </div>
              {[
                { name: 'Python', pct: 94, color: '#10b981' },
                { name: 'React', pct: 82, color: '#14b8a6' },
                { name: 'AWS', pct: 76, color: '#10b981' },
                { name: 'Machine Learning', pct: 68, color: '#14b8a6' },
              ].map(s => (
                <div key={s.name} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.name}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: s.color }}>{s.pct}%</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--bg-secondary)', borderRadius: 2 }}>
                    <div style={{ height: 4, width: `${s.pct}%`, background: s.color, borderRadius: 2, transition: 'width 1s ease' }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Live activity */}
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 14, padding: 14
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <span className="live-dot" style={{ width: 7, height: 7 }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-primary)' }}>Live activity</span>
              </div>
              {[
                { dot: '#10b981', text: 'Python demand up 12% in last 24h' },
                { dot: '#6366f1', text: 'Google posted 18 new ML roles' },
                { dot: '#f59e0b', text: 'Kubernetes overtook Docker this week' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 8, alignItems: 'flex-start',
                  padding: '6px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none'
                }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: item.dot, marginTop: 5, flexShrink: 0
                  }} />
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        padding: '60px 24px'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 32, marginBottom: 10 }}>
              Everything you need to <span className="gradient-text">stay ahead</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
              Six powerful tools. One platform. Zero guesswork.
            </p>
          </div>
          <div className="grid-3">
            {features.map(({ icon: Icon, color, bg, title, desc }) => (
              <div key={title} className="card">
                <div style={{
                  width: 40, height: 40, background: bg,
                  borderRadius: 10, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', marginBottom: 14
                }}>
                  <Icon size={20} color={color} />
                </div>
                <h3 style={{ fontSize: 15, marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: '60px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 32, marginBottom: 10 }}>
              Loved by <span className="gradient-text">developers</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
              Join thousands of professionals using SkilLintel to grow their careers.
            </p>
          </div>
          <div className="grid-3">
            {testimonials.map((t, i) => (
              <div key={i} className="card">
                <div style={{ display: 'flex', gap: 2, marginBottom: 12 }}>
                  {[...Array(t.stars)].map((_, j) => (
                    <Star key={j} size={14} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>
                  "{t.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'var(--gradient)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700, color: 'white'
                  }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border)',
        padding: '60px 24px', textAlign: 'center'
      }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{ fontSize: 34, marginBottom: 14 }}>
            Ready to get your <span className="gradient-text">unfair edge?</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 28, lineHeight: 1.7 }}>
            Join thousands of developers and data professionals who use SkilLintel
            to make smarter career decisions every day.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn-primary" style={{ fontSize: 15, padding: '13px 28px' }}>
              Start free today <ChevronRight size={16} />
            </Link>
            <Link to="/login" className="btn-secondary" style={{ fontSize: 15, padding: '13px 28px' }}>
              Sign in
            </Link>
          </div>
          <p style={{ marginTop: 14, fontSize: 12, color: 'var(--text-muted)' }}>
            No credit card required · Free forever
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        maxWidth: 1200, margin: '0 auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 26, height: 26, background: 'var(--gradient)',
            borderRadius: 7, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontWeight: 800, color: 'white', fontSize: 13
          }}>S</div>
          <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 14 }}>
            Skill<span style={{ color: 'var(--accent-primary)' }}>Intel</span>
          </span>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          © 2026 SkilLintel. Built with ❤️ for developers.
        </p>
        <div style={{ display: 'flex', gap: 16 }}>
          {['Privacy', 'Terms', 'Contact'].map(l => (
            <span key={l} style={{ fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer' }}>{l}</span>
          ))}
        </div>
      </footer>

    </div>
  )
}