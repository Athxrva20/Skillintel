import { useState, useEffect } from 'react'
import { rolesAPI } from '../utils/api'
import toast from 'react-hot-toast'
import {
  Search, TrendingUp, DollarSign, Users,
  ArrowRight, ChevronDown, ChevronUp,
  Briefcase, Star, Zap, X, Filter
} from 'lucide-react'

const DEMAND_COLOR = {
  'Very High': { bg: 'rgba(16,185,129,0.1)', color: '#10b981', border: 'rgba(16,185,129,0.2)' },
  'High': { bg: 'rgba(20,184,166,0.1)', color: '#14b8a6', border: 'rgba(20,184,166,0.2)' },
  'Medium': { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: 'rgba(245,158,11,0.2)' },
  'Low': { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'rgba(239,68,68,0.2)' },
}

const GROWTH_COLOR = (g) => {
  const num = parseFloat(g)
  if (num >= 20) return '#10b981'
  if (num >= 10) return '#14b8a6'
  if (num >= 0) return '#f59e0b'
  return '#ef4444'
}

const ROLE_ICONS = {
  'Software Engineer': '💻',
  'Data Scientist': '📊',
  'Frontend Developer': '🎨',
  'Backend Developer': '⚙️',
  'DevOps Engineer': '🚀',
  'ML Engineer': '🤖',
  'Cloud Architect': '☁️',
  'Full Stack Developer': '🔥',
}

function RoleCard({ role, onClick, selected }) {
  const demand = DEMAND_COLOR[role.demand] || DEMAND_COLOR['Medium']
  const growthColor = GROWTH_COLOR(role.growth)

  return (
    <div
      onClick={() => onClick(role)}
      className="card"
      style={{
        cursor: 'pointer',
        border: selected
          ? '1px solid var(--accent-primary)'
          : '1px solid var(--border)',
        background: selected ? 'var(--accent-glow)' : 'var(--bg-card)',
        transition: 'all 0.2s'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-light)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 20
          }}>
            {ROLE_ICONS[role.name] || '💼'}
          </div>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{role.name}</h3>
            <span style={{
              fontSize: 11, padding: '2px 8px', borderRadius: 10,
              background: demand.bg, color: demand.color,
              border: `1px solid ${demand.border}`
            }}>{role.demand}</span>
          </div>
        </div>
        <span style={{
          fontSize: 13, fontWeight: 700,
          color: growthColor,
          background: `${growthColor}15`,
          padding: '4px 8px', borderRadius: 8,
          border: `1px solid ${growthColor}30`
        }}>{role.growth}</span>
      </div>

      {/* Description */}
      <p style={{
        fontSize: 12, color: 'var(--text-secondary)',
        lineHeight: 1.5, marginBottom: 12,
        display: '-webkit-box', WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical', overflow: 'hidden'
      }}>{role.description}</p>

      {/* Salary */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        marginBottom: 12, fontSize: 13
      }}>
        <DollarSign size={13} color="var(--accent-primary)" />
        <span style={{ fontWeight: 600 }}>{role.avg_salary}</span>
        <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>avg salary</span>
      </div>

      {/* Top skills */}
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
        {role.top_skills?.slice(0, 3).map(skill => (
          <span key={skill} style={{
            fontSize: 11, padding: '3px 8px', borderRadius: 10,
            background: 'var(--bg-secondary)', color: 'var(--text-secondary)',
            border: '1px solid var(--border)'
          }}>{skill}</span>
        ))}
      </div>
    </div>
  )
}

function RoleDetail({ role, onClose }) {
  if (!role) return null
  const demand = DEMAND_COLOR[role.demand] || DEMAND_COLOR['Medium']
  const growthColor = GROWTH_COLOR(role.growth)

  return (
    <div style={{
      position: 'sticky', top: 80,
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 14, padding: 24, maxHeight: 'calc(100vh - 120px)',
      overflowY: 'auto'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-light)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 24
          }}>
            {ROLE_ICONS[role.name] || '💼'}
          </div>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{role.name}</h2>
            <div style={{ display: 'flex', gap: 6 }}>
              <span style={{
                fontSize: 11, padding: '2px 8px', borderRadius: 10,
                background: demand.bg, color: demand.color,
                border: `1px solid ${demand.border}`
              }}>{role.demand} Demand</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} style={{
          background: 'var(--bg-secondary)', border: '1px solid var(--border)',
          borderRadius: 8, padding: 6, cursor: 'pointer',
          color: 'var(--text-secondary)', display: 'flex'
        }}>
          <X size={16} />
        </button>
      </div>

      {/* Description */}
      <p style={{
        fontSize: 13, color: 'var(--text-secondary)',
        lineHeight: 1.7, marginBottom: 20,
        padding: 14, background: 'var(--bg-secondary)',
        borderRadius: 10, border: '1px solid var(--border)'
      }}>{role.description}</p>

      {/* Key stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        {[
          { icon: DollarSign, label: 'Avg Salary', value: role.avg_salary, color: '#10b981' },
          { icon: TrendingUp, label: 'Growth Rate', value: role.growth, color: growthColor },
          { icon: Star, label: 'Demand', value: role.demand, color: '#f59e0b' },
          { icon: Users, label: 'Experience', value: role.experience_levels?.join(', ') || 'All levels', color: '#6366f1' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} style={{
            background: 'var(--bg-secondary)', borderRadius: 10,
            padding: 12, border: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Icon size={13} color={color} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{label}</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Required skills */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <Zap size={14} color="var(--accent-primary)" />
          <span style={{ fontSize: 13, fontWeight: 600 }}>Required Skills</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {role.top_skills?.map((skill, i) => (
            <span key={skill} style={{
              fontSize: 12, padding: '5px 12px', borderRadius: 20, fontWeight: 500,
              background: i < 3 ? 'var(--accent-glow)' : 'var(--bg-secondary)',
              color: i < 3 ? 'var(--accent-primary)' : 'var(--text-secondary)',
              border: `1px solid ${i < 3 ? 'rgba(16,185,129,0.2)' : 'var(--border)'}`
            }}>{skill}</span>
          ))}
        </div>
      </div>

      {/* Experience levels */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <Users size={14} color="var(--accent-primary)" />
          <span style={{ fontSize: 13, fontWeight: 600 }}>Experience Levels</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {role.experience_levels?.map((level, i) => (
            <div key={level} style={{
              flex: 1, textAlign: 'center', padding: '8px 4px',
              background: i === 0 ? 'var(--accent-glow)' : 'var(--bg-secondary)',
              borderRadius: 8, border: `1px solid ${i === 0 ? 'rgba(16,185,129,0.2)' : 'var(--border)'}`,
              fontSize: 12, fontWeight: 500,
              color: i === 0 ? 'var(--accent-primary)' : 'var(--text-secondary)'
            }}>{level}</div>
          ))}
        </div>
      </div>

      {/* Related roles */}
      {role.related_roles && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <ArrowRight size={14} color="var(--accent-primary)" />
            <span style={{ fontSize: 13, fontWeight: 600 }}>Related Roles</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {role.related_roles.map(r => (
              <div key={r} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 12px', background: 'var(--bg-secondary)',
                borderRadius: 8, border: '1px solid var(--border)',
                fontSize: 13, color: 'var(--text-secondary)'
              }}>
                <span>{ROLE_ICONS[r] || '💼'}</span>
                <span>{r}</span>
                <ArrowRight size={12} style={{ marginLeft: 'auto' }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={() => window.location.href = '/jobs'}
        className="btn-primary"
        style={{ width: '100%', justifyContent: 'center', padding: 12 }}
      >
        <Briefcase size={15} />
        Find {role.name} Jobs
      </button>
    </div>
  )
}

export default function Roles() {
  const [roles, setRoles] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedRole, setSelectedRole] = useState(null)
  const [demandFilter, setDemandFilter] = useState('All')
  const [sortBy, setSortBy] = useState('demand')

  useEffect(() => {
    loadRoles()
  }, [])

  useEffect(() => {
    let result = [...roles]

    if (search) {
      result = result.filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.top_skills?.some(s => s.toLowerCase().includes(search.toLowerCase()))
      )
    }

    if (demandFilter !== 'All') {
      result = result.filter(r => r.demand === demandFilter)
    }

    if (sortBy === 'growth') {
      result.sort((a, b) => parseFloat(b.growth) - parseFloat(a.growth))
    } else if (sortBy === 'demand') {
      const order = { 'Very High': 4, 'High': 3, 'Medium': 2, 'Low': 1 }
      result.sort((a, b) => (order[b.demand] || 0) - (order[a.demand] || 0))
    } else if (sortBy === 'salary') {
      result.sort((a, b) => {
        const getMin = s => parseInt(s?.split('-')[0]?.replace(/\D/g, '') || 0)
        return getMin(b.avg_salary) - getMin(a.avg_salary)
      })
    }

    setFiltered(result)
  }, [roles, search, demandFilter, sortBy])

  const loadRoles = async () => {
    setLoading(true)
    try {
      const res = await rolesAPI.getAll()
      setRoles(res.data.roles || [])
      if (res.data.roles?.length > 0) {
        setSelectedRole(res.data.roles[0])
      }
    } catch {
      toast('Using cached role data', { icon: '💼' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">

      {/* HEADER */}
      <div style={{ marginBottom: 24 }}>
        <h1 className="page-title">Role Explorer</h1>
        <p className="page-subtitle">
          Deep dive into tech roles — salary ranges, required skills, growth outlook
        </p>
      </div>

      {/* STATS ROW */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: 'Roles Tracked', value: roles.length, icon: Briefcase, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
          { label: 'Very High Demand', value: roles.filter(r => r.demand === 'Very High').length, icon: TrendingUp, color: '#14b8a6', bg: 'rgba(20,184,166,0.1)' },
          { label: 'Avg Growth Rate', value: '+16%', icon: Star, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
          { label: 'Top Salary', value: '50 LPA', icon: DollarSign, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
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

      {/* FILTER BAR */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 12, padding: '12px 16px', marginBottom: 20,
        display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{
            position: 'absolute', left: 10, top: '50%',
            transform: 'translateY(-50%)', color: 'var(--text-muted)'
          }} />
          <input
            className="input-field"
            placeholder="Search roles or skills..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 32, padding: '8px 12px 8px 32px' }}
          />
        </div>

        {/* Demand filter */}
        <div style={{ display: 'flex', gap: 4 }}>
          {['All', 'Very High', 'High', 'Medium'].map(d => (
            <button key={d} onClick={() => setDemandFilter(d)} style={{
              fontSize: 12, padding: '5px 12px', borderRadius: 20,
              cursor: 'pointer',
              background: demandFilter === d ? 'var(--accent-primary)' : 'var(--bg-secondary)',
              color: demandFilter === d ? 'white' : 'var(--text-secondary)',
              border: '1px solid var(--border-light)', transition: 'all 0.15s'
            }}>{d}</button>
          ))}
        </div>

        {/* Sort */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Sort:</span>
          <select
            className="input-field"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{ padding: '6px 10px', fontSize: 12, width: 'auto' }}
          >
            <option value="demand">By Demand</option>
            <option value="growth">By Growth</option>
            <option value="salary">By Salary</option>
          </select>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20 }}>

        {/* ROLES GRID */}
        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{
                width: 36, height: 36,
                border: '3px solid var(--border-light)',
                borderTop: '3px solid var(--accent-primary)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                margin: '0 auto 12px'
              }} />
              <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Loading roles...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <Briefcase size={40} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
              <p style={{ color: 'var(--text-secondary)' }}>No roles found matching your search</p>
              <button onClick={() => { setSearch(''); setDemandFilter('All') }} style={{
                marginTop: 12, fontSize: 13, color: 'var(--accent-primary)',
                background: 'none', border: 'none', cursor: 'pointer'
              }}>Clear filters</button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 14
            }}>
              {filtered.map(role => (
                <RoleCard
                  key={role.name}
                  role={role}
                  onClick={setSelectedRole}
                  selected={selectedRole?.name === role.name}
                />
              ))}
            </div>
          )}
        </div>

        {/* ROLE DETAIL PANEL */}
        {selectedRole && (
          <RoleDetail
            role={selectedRole}
            onClose={() => setSelectedRole(null)}
          />
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}