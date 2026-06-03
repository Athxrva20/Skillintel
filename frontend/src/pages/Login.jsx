import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import toast from 'react-hot-toast'
import {
  Mail, Lock, Eye, EyeOff, Sun, Moon,
  TrendingUp, BarChart2, FileText, ArrowRight
} from 'lucide-react'

const features = [
  { icon: TrendingUp, text: 'Track 45+ in-demand skills in real-time' },
  { icon: BarChart2, text: 'Forecast skill demand 6 months ahead' },
  { icon: FileText, text: 'AI-powered resume analysis & scoring' },
]

export default function Login() {
  const { login } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields')
      return
    }
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      background: 'var(--bg-primary)'
    }}>

      {/* LEFT — Branding panel */}
      <div style={{
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
        padding: '40px 48px',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, background: 'var(--gradient)',
            borderRadius: 10, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontWeight: 800, color: 'white', fontSize: 18
          }}>S</div>
          <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 20 }}>
            Skill<span style={{ color: 'var(--accent-primary)' }}>Intel</span>
          </span>
        </div>

        {/* Middle content */}
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'var(--accent-glow)', padding: '6px 14px',
            borderRadius: 20, border: '1px solid rgba(16,185,129,0.2)',
            marginBottom: 24
          }}>
            <span className="live-dot" style={{ width: 6, height: 6 }} />
            <span style={{ fontSize: 12, color: 'var(--accent-primary)', fontWeight: 600 }}>
              Live market data
            </span>
          </div>

          <h1 style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.2, marginBottom: 16 }}>
            Your career<br />
            intelligence<br />
            <span className="gradient-text">platform</span>
          </h1>

          <p style={{
            fontSize: 14, color: 'var(--text-secondary)',
            lineHeight: 1.7, marginBottom: 36, maxWidth: 340
          }}>
            Join thousands of developers using SkilLintel to make smarter
            career decisions with real-time job market data.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {features.map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36, height: 36, background: 'var(--accent-glow)',
                  borderRadius: 10, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', border: '1px solid rgba(16,185,129,0.2)',
                  flexShrink: 0
                }}>
                  <Icon size={16} color="var(--accent-primary)" />
                </div>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div style={{
          background: 'var(--bg-card)', borderRadius: 12,
          padding: 20, border: '1px solid var(--border)'
        }}>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 12 }}>
            "SkilLintel helped me identify which skills to learn before my job switch.
            Got a 40% salary hike!"
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'var(--gradient)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: 'white'
            }}>P</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Priya S.</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Frontend Developer</div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT — Login form */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '40px 48px', position: 'relative'
      }}>

        {/* Theme toggle */}
        <button onClick={toggleTheme} style={{
          position: 'absolute', top: 24, right: 24,
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 8, padding: '7px 9px', color: 'var(--text-secondary)',
          display: 'flex', alignItems: 'center'
        }}>
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        <div style={{ width: '100%', maxWidth: 380 }}>

          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
              Welcome back
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              Sign in to your SkilLintel account
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: 'block', fontSize: 13, fontWeight: 500,
                marginBottom: 6, color: 'var(--text-primary)'
              }}>Email address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{
                  position: 'absolute', left: 12, top: '50%',
                  transform: 'translateY(-50%)', color: 'var(--text-muted)'
                }} />
                <input
                  type="email"
                  className="input-field"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  style={{ paddingLeft: 38 }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: 'block', fontSize: 13, fontWeight: 500,
                marginBottom: 6, color: 'var(--text-primary)'
              }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{
                  position: 'absolute', left: 12, top: '50%',
                  transform: 'translateY(-50%)', color: 'var(--text-muted)'
                }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input-field"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  style={{ paddingLeft: 38, paddingRight: 38 }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position: 'absolute', right: 12, top: '50%',
                  transform: 'translateY(-50%)', background: 'none',
                  border: 'none', color: 'var(--text-muted)', display: 'flex'
                }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{
                width: '100%', justifyContent: 'center',
                padding: '12px', fontSize: 15,
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Signing in...' : (
                <>Sign in <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            margin: '24px 0'
          }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Don't have an account?
            </span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <Link to="/register" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 8, width: '100%', padding: '12px',
            borderRadius: 8, border: '1px solid var(--border-light)',
            fontSize: 14, fontWeight: 500, color: 'var(--text-primary)',
            background: 'var(--bg-card)', transition: 'all 0.2s'
          }}>
            Create a free account
          </Link>

          <p style={{
            textAlign: 'center', marginTop: 24,
            fontSize: 12, color: 'var(--text-muted)'
          }}>
            By signing in you agree to our{' '}
            <span style={{ color: 'var(--accent-primary)', cursor: 'pointer' }}>Terms</span>
            {' '}and{' '}
            <span style={{ color: 'var(--accent-primary)', cursor: 'pointer' }}>Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  )
}