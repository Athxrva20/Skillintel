import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import toast from 'react-hot-toast'
import {
  User, Mail, Lock, Eye, EyeOff,
  Sun, Moon, ArrowRight, Check
} from 'lucide-react'

const perks = [
  'Free forever — no credit card needed',
  'Real-time skill demand tracking',
  'AI resume analysis & scoring',
  'Job market forecasting',
  'Role explorer with salary data',
]

export default function Register() {
  const { register } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill in all fields')
      return
    }
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match')
      return
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      toast.success('Account created! Welcome to SkilLintel 🎉')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const strength = form.password.length === 0 ? 0
    : form.password.length < 6 ? 1
    : form.password.length < 10 ? 2 : 3

  const strengthColor = ['transparent', '#ef4444', '#f59e0b', '#10b981'][strength]
  const strengthLabel = ['', 'Weak', 'Medium', 'Strong'][strength]

  return (
    <div style={{
      minHeight: '100vh', display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      background: 'var(--bg-primary)'
    }}>

      {/* LEFT — Form */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '40px 48px', position: 'relative'
      }}>
        {/* Theme toggle */}
        <button onClick={toggleTheme} style={{
          position: 'absolute', top: 24, left: 24,
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 8, padding: '7px 9px', color: 'var(--text-secondary)',
          display: 'flex', alignItems: 'center'
        }}>
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Logo */}
        <div style={{
          position: 'absolute', top: 24, right: 24,
          display: 'flex', alignItems: 'center', gap: 8
        }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 30, height: 30, background: 'var(--gradient)',
              borderRadius: 8, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontWeight: 800, color: 'white', fontSize: 15
            }}>S</div>
            <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 16 }}>
              Skill<span style={{ color: 'var(--accent-primary)' }}>Intel</span>
            </span>
          </Link>
        </div>

        <div style={{ width: '100%', maxWidth: 380 }}>
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
              Create your account
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              Start your career intelligence journey today
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div style={{ marginBottom: 14 }}>
              <label style={{
                display: 'block', fontSize: 13,
                fontWeight: 500, marginBottom: 6
              }}>Full name</label>
              <div style={{ position: 'relative' }}>
                <User size={15} style={{
                  position: 'absolute', left: 12, top: '50%',
                  transform: 'translateY(-50%)', color: 'var(--text-muted)'
                }} />
                <input
                  type="text"
                  className="input-field"
                  placeholder="Atharva Phadatare"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  style={{ paddingLeft: 38 }}
                />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: 14 }}>
              <label style={{
                display: 'block', fontSize: 13,
                fontWeight: 500, marginBottom: 6
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
            <div style={{ marginBottom: 14 }}>
              <label style={{
                display: 'block', fontSize: 13,
                fontWeight: 500, marginBottom: 6
              }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{
                  position: 'absolute', left: 12, top: '50%',
                  transform: 'translateY(-50%)', color: 'var(--text-muted)'
                }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input-field"
                  placeholder="Min 6 characters"
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
              {/* Password strength */}
              {form.password.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                    {[1, 2, 3].map(i => (
                      <div key={i} style={{
                        flex: 1, height: 3, borderRadius: 2,
                        background: i <= strength ? strengthColor : 'var(--border-light)',
                        transition: 'background 0.3s'
                      }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 11, color: strengthColor }}>{strengthLabel}</span>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: 'block', fontSize: 13,
                fontWeight: 500, marginBottom: 6
              }}>Confirm password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{
                  position: 'absolute', left: 12, top: '50%',
                  transform: 'translateY(-50%)', color: 'var(--text-muted)'
                }} />
                <input
                  type="password"
                  className="input-field"
                  placeholder="Repeat your password"
                  value={form.confirm}
                  onChange={e => setForm({ ...form, confirm: e.target.value })}
                  style={{
                    paddingLeft: 38,
                    borderColor: form.confirm && form.confirm !== form.password
                      ? '#ef4444' : undefined
                  }}
                />
              </div>
              {form.confirm && form.confirm !== form.password && (
                <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>
                  Passwords don't match
                </p>
              )}
            </div>

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
              {loading ? 'Creating account...' : (
                <>Create account <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 500 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT — Perks panel */}
      <div style={{
        background: 'var(--bg-secondary)',
        borderLeft: '1px solid var(--border)',
        padding: '40px 48px',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'var(--accent-glow)', padding: '6px 14px',
          borderRadius: 20, border: '1px solid rgba(16,185,129,0.2)',
          marginBottom: 24, width: 'fit-content'
        }}>
          <span className="live-dot" style={{ width: 6, height: 6 }} />
          <span style={{ fontSize: 12, color: 'var(--accent-primary)', fontWeight: 600 }}>
            Free forever
          </span>
        </div>

        <h2 style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.2, marginBottom: 16 }}>
          Everything you need<br />
          <span className="gradient-text">completely free</span>
        </h2>

        <p style={{
          fontSize: 14, color: 'var(--text-secondary)',
          lineHeight: 1.7, marginBottom: 36
        }}>
          No hidden fees, no premium plans, no credit card required.
          SkilLintel is 100% free for everyone.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 40 }}>
          {perks.map(perk => (
            <div key={perk} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                background: 'var(--accent-glow)',
                border: '1px solid rgba(16,185,129,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                <Check size={12} color="var(--accent-primary)" />
              </div>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{perk}</span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{
          background: 'var(--bg-card)', borderRadius: 14,
          padding: 24, border: '1px solid var(--border)',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20
        }}>
          {[
            { num: '15K+', label: 'Jobs tracked daily' },
            { num: '45+', label: 'Skills monitored' },
            { num: '2.8K+', label: 'Active users' },
            { num: '100%', label: 'Free forever' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent-primary)' }}>
                {s.num}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}