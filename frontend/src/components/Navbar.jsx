import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import {
  LayoutDashboard, Search, TrendingUp, FileText,
  BarChart2, Briefcase, Sun, Moon, LogOut, Menu, X
} from 'lucide-react'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/jobs',      label: 'Jobs',      icon: Briefcase },
  { path: '/skills',    label: 'Skills',    icon: TrendingUp },
  { path: '/resume',    label: 'Resume AI', icon: FileText },
  { path: '/forecast',  label: 'Forecast',  icon: BarChart2 },
  { path: '/roles',     label: 'Roles',     icon: Search },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav style={{
      background: 'var(--bg-card)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: '0 24px', height: 56,
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 16
      }}>

        {/* Logo */}
        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div style={{
            width: 30, height: 30, background: 'var(--gradient)',
            borderRadius: 8, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'white'
          }}>S</div>
          <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 16 }}>
            Skill<span style={{ color: 'var(--accent-primary)' }}>Intel</span>
          </span>
          {/* Live dot */}
          <span style={{ display: 'flex', alignItems: 'center', gap: 4,
            background: 'var(--accent-glow)', padding: '2px 8px',
            borderRadius: 20, border: '1px solid rgba(16,185,129,0.2)'
          }}>
            <span className="live-dot" style={{ width: 6, height: 6 }} />
            <span style={{ fontSize: 10, color: 'var(--accent-primary)', fontWeight: 600 }}>Live</span>
          </span>
        </Link>

        {/* Nav Links — Desktop */}
        <div style={{ display: 'flex', gap: 2, flex: 1, justifyContent: 'center' }}
          className="desktop-nav">
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path
            return (
              <Link key={path} to={path} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 8, fontSize: 13,
                fontWeight: active ? 600 : 400,
                color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
                background: active ? 'var(--accent-glow)' : 'transparent',
                transition: 'all 0.15s', textDecoration: 'none'
              }}>
                <Icon size={15} />
                {label}
              </Link>
            )
          })}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {/* Theme toggle */}
          <button onClick={toggleTheme} style={{
            background: 'var(--bg-hover)', border: '1px solid var(--border)',
            borderRadius: 8, padding: '6px 8px', color: 'var(--text-secondary)',
            display: 'flex', alignItems: 'center', transition: 'all 0.2s'
          }}>
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* User avatar */}
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: 'var(--gradient)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, color: 'white'
              }}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <button onClick={handleLogout} style={{
                background: 'transparent', border: '1px solid var(--border)',
                borderRadius: 8, padding: '6px 8px', color: 'var(--text-secondary)',
                display: 'flex', alignItems: 'center', gap: 4, fontSize: 13,
                transition: 'all 0.2s'
              }}>
                <LogOut size={14} />
              </button>
            </div>
          )}

          {/* Mobile menu button */}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{
            background: 'transparent', border: 'none',
            color: 'var(--text-secondary)', display: 'none'
          }} className="mobile-menu-btn">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: 'var(--bg-card)', borderTop: '1px solid var(--border)',
          padding: '12px 24px'
        }}>
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link key={path} to={path}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 0', color: location.pathname === path
                  ? 'var(--accent-primary)' : 'var(--text-secondary)',
                borderBottom: '1px solid var(--border)', fontSize: 14
              }}>
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}