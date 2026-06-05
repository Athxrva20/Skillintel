import { useState, useEffect } from 'react'
import { forecastAPI } from '../utils/api'
import toast from 'react-hot-toast'
import {
  TrendingUp, TrendingDown, BarChart2,
  RefreshCw, Zap, ArrowUp, ArrowDown,
  Minus, Info
} from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area,
  BarChart, Bar, Legend
} from 'recharts'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const COLORS = [
  '#10b981', '#14b8a6', '#6366f1', '#f59e0b',
  '#ef4444', '#8b5cf6', '#ec4899', '#0ea5e9'
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border-light)',
        borderRadius: 10, padding: '12px 16px', fontSize: 12,
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}>
        <p style={{ fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>
          Month {label}
        </p>
        {payload.map((p, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center',
            gap: 8, marginBottom: 4
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: p.color, flexShrink: 0
            }} />
            <span style={{ color: 'var(--text-secondary)' }}>{p.name}:</span>
            <span style={{ fontWeight: 600, color: p.color }}>
              {p.value?.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

function TrendBadge({ trend }) {
  const isUp = trend?.startsWith('+')
  const isDown = trend?.startsWith('-')
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: 12, fontWeight: 600, padding: '3px 8px', borderRadius: 20,
      background: isUp ? 'rgba(16,185,129,0.1)' : isDown ? 'rgba(239,68,68,0.1)' : 'rgba(99,102,241,0.1)',
      color: isUp ? '#10b981' : isDown ? '#ef4444' : '#6366f1',
      border: `1px solid ${isUp ? 'rgba(16,185,129,0.2)' : isDown ? 'rgba(239,68,68,0.2)' : 'rgba(99,102,241,0.2)'}`
    }}>
      {isUp ? <ArrowUp size={10} /> : isDown ? <ArrowDown size={10} /> : <Minus size={10} />}
      {trend}
    </span>
  )
}

export default function Forecast() {
  const [forecasts, setForecasts] = useState([])
  const [market, setMarket] = useState(null)
  const [months, setMonths] = useState(6)
  const [loading, setLoading] = useState(true)
  const [selectedSkills, setSelectedSkills] = useState(['Python', 'React', 'AWS', 'Machine Learning'])
  const [chartType, setChartType] = useState('line')

  useEffect(() => {
    loadData()
  }, [months])

  const loadData = async () => {
    setLoading(true)
    try {
      const [forecastRes, marketRes] = await Promise.all([
        forecastAPI.getSkills(months),
        forecastAPI.getMarket()
      ])
      setForecasts(forecastRes.data.forecasts || [])
      setMarket(marketRes.data.overview)
    } catch {
      toast('Using projected data', { icon: '📊' })
    } finally {
      setLoading(false)
    }
  }

  // Build chart data from forecasts
  const chartData = Array.from({ length: months }, (_, i) => {
    const point = { month: i + 1 }
    forecasts
      .filter(f => selectedSkills.includes(f.skill))
      .forEach(f => {
        point[f.skill] = f.forecast?.[i] || 0
      })
    return point
  })

  const toggleSkill = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill].slice(0, 6)
    )
  }

  const rising = forecasts.filter(f => f.trend === 'rising')
  const stable = forecasts.filter(f => f.trend === 'stable')
  const declining = forecasts.filter(f => f.trend === 'declining')

  return (
    <div className="page-container">

      {/* HEADER */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: 24
      }}>
        <div>
          <h1 className="page-title">Skill Demand Forecast</h1>
          <p className="page-subtitle">
            Predict where skill demand is headed over the next {months} months
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {/* Month selector */}
          <div style={{ display: 'flex', gap: 4 }}>
            {[3, 6, 12].map(m => (
              <button key={m} onClick={() => setMonths(m)} style={{
                padding: '7px 14px', borderRadius: 8, fontSize: 13,
                cursor: 'pointer', fontWeight: months === m ? 600 : 400,
                background: months === m ? 'var(--accent-primary)' : 'var(--bg-card)',
                color: months === m ? 'white' : 'var(--text-secondary)',
                border: '1px solid var(--border-light)', transition: 'all 0.15s'
              }}>{m}M</button>
            ))}
          </div>
          <button onClick={loadData} disabled={loading} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 14px', borderRadius: 8,
            background: 'var(--accent-glow)',
            border: '1px solid rgba(16,185,129,0.2)',
            color: 'var(--accent-primary)', fontSize: 13,
            fontWeight: 500, cursor: 'pointer'
          }}>
            <RefreshCw size={14} style={{
              animation: loading ? 'spin 0.8s linear infinite' : 'none'
            }} />
            Refresh
          </button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          {
            icon: TrendingUp, label: 'Rising Skills',
            value: rising.length, color: '#10b981',
            bg: 'rgba(16,185,129,0.1)', sub: 'Growing demand'
          },
          {
            icon: Minus, label: 'Stable Skills',
            value: stable.length, color: '#6366f1',
            bg: 'rgba(99,102,241,0.1)', sub: 'Steady demand'
          },
          {
            icon: TrendingDown, label: 'Declining Skills',
            value: declining.length, color: '#ef4444',
            bg: 'rgba(239,68,68,0.1)', sub: 'Falling demand'
          },
          {
            icon: Zap, label: 'Fastest Growing',
            value: rising[0]?.skill || 'ML',
            color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',
            sub: rising[0]?.growth_rate || '+22%'
          },
        ].map(({ icon: Icon, label, value, color, bg, sub }) => (
          <div key={label} className="card" style={{
            display: 'flex', alignItems: 'center', gap: 14
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: 10,
              background: bg, display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <Icon size={20} color={color} />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{value}</div>
              <div style={{ fontSize: 12, fontWeight: 500 }}>{label}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN CHART */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BarChart2 size={16} color="var(--accent-primary)" />
            <span style={{ fontWeight: 600, fontSize: 15 }}>
              {months}-Month Demand Forecast
            </span>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {/* Chart type toggle */}
            <div style={{ display: 'flex', gap: 4 }}>
              {['line', 'area', 'bar'].map(t => (
                <button key={t} onClick={() => setChartType(t)} style={{
                  padding: '4px 12px', borderRadius: 6, fontSize: 12,
                  cursor: 'pointer', textTransform: 'capitalize',
                  background: chartType === t ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                  color: chartType === t ? 'white' : 'var(--text-secondary)',
                  border: '1px solid var(--border-light)'
                }}>{t}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Skill selector */}
        <div style={{
          display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16
        }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', alignSelf: 'center' }}>
            Select skills:
          </span>
          {forecasts.slice(0, 10).map((f, i) => (
            <button key={f.skill} onClick={() => toggleSkill(f.skill)} style={{
              fontSize: 12, padding: '4px 12px', borderRadius: 20,
              cursor: 'pointer', transition: 'all 0.15s',
              background: selectedSkills.includes(f.skill)
                ? COLORS[i % COLORS.length] : 'var(--bg-secondary)',
              color: selectedSkills.includes(f.skill) ? 'white' : 'var(--text-secondary)',
              border: `1px solid ${selectedSkills.includes(f.skill)
                ? COLORS[i % COLORS.length] : 'var(--border-light)'}`,
              opacity: selectedSkills.length >= 6 && !selectedSkills.includes(f.skill) ? 0.5 : 1
            }}>{f.skill}</button>
          ))}
          <span style={{ fontSize: 11, color: 'var(--text-muted)', alignSelf: 'center' }}>
            (max 6)
          </span>
        </div>

        {/* Chart */}
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
            <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
              Generating forecast...
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            {chartType === 'area' ? (
              <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
                <defs>
                  {selectedSkills.map((skill, i) => (
                    <linearGradient key={skill} id={`grad${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
                  axisLine={false} tickLine={false}
                  tickFormatter={v => MONTHS[v - 1] || `M${v}`} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
                  axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                {selectedSkills.map((skill, i) => (
                  <Area key={skill} type="monotone" dataKey={skill}
                    stroke={COLORS[i % COLORS.length]} strokeWidth={2}
                    fill={`url(#grad${i})`} />
                ))}
              </AreaChart>
            ) : chartType === 'bar' ? (
              <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
                  axisLine={false} tickLine={false}
                  tickFormatter={v => MONTHS[v - 1] || `M${v}`} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
                  axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                {selectedSkills.map((skill, i) => (
                  <Bar key={skill} dataKey={skill}
                    fill={COLORS[i % COLORS.length]} radius={[3, 3, 0, 0]} />
                ))}
              </BarChart>
            ) : (
              <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
                  axisLine={false} tickLine={false}
                  tickFormatter={v => MONTHS[v - 1] || `M${v}`} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
                  axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                {selectedSkills.map((skill, i) => (
                  <Line key={skill} type="monotone" dataKey={skill}
                    stroke={COLORS[i % COLORS.length]} strokeWidth={2.5}
                    dot={false} activeDot={{ r: 5 }} />
                ))}
              </LineChart>
            )}
          </ResponsiveContainer>
        )}

        {/* Legend */}
        {!loading && (
          <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            {selectedSkills.map((skill, i) => (
              <div key={skill} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 24, height: 3,
                  background: COLORS[i % COLORS.length], borderRadius: 2
                }} />
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{skill}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FORECAST TABLE */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

        {/* RISING */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <TrendingUp size={16} color="#10b981" />
            <span style={{ fontWeight: 600, fontSize: 15 }}>Rising Skills</span>
            <span style={{
              fontSize: 11, padding: '2px 8px', borderRadius: 10,
              background: 'rgba(16,185,129,0.1)', color: '#10b981',
              border: '1px solid rgba(16,185,129,0.2)', marginLeft: 'auto'
            }}>{rising.length} skills</span>
          </div>
          {rising.slice(0, 6).map((f, i) => (
            <div key={f.skill} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 0',
              borderBottom: i < Math.min(rising.length, 6) - 1
                ? '1px solid var(--border)' : 'none'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: 7,
                  background: 'rgba(16,185,129,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: '#10b981'
                }}>{i + 1}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{f.skill}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                    {f.current_demand?.toLocaleString()} → {f.projected_demand?.toLocaleString()}
                  </div>
                </div>
              </div>
              <TrendBadge trend={f.growth_rate} />
            </div>
          ))}
        </div>

        {/* DECLINING + STABLE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* DECLINING */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <TrendingDown size={16} color="#ef4444" />
              <span style={{ fontWeight: 600, fontSize: 15 }}>Declining Skills</span>
              <span style={{
                fontSize: 11, padding: '2px 8px', borderRadius: 10,
                background: 'rgba(239,68,68,0.1)', color: '#ef4444',
                border: '1px solid rgba(239,68,68,0.2)', marginLeft: 'auto'
              }}>{declining.length} skills</span>
            </div>
            {declining.map((f, i) => (
              <div key={f.skill} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: i < declining.length - 1 ? '1px solid var(--border)' : 'none'
              }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{f.skill}</span>
                <TrendBadge trend={f.growth_rate} />
              </div>
            ))}
          </div>

          {/* MARKET NOTE */}
          <div style={{
            background: 'var(--accent-glow)',
            border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: 12, padding: 16,
            display: 'flex', gap: 12, alignItems: 'flex-start'
          }}>
            <Info size={16} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-primary)', marginBottom: 6 }}>
                Forecast methodology
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Forecasts are based on current job posting trends, historical demand data,
                and market signals. Data is refreshed every 6 hours from live job boards.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MARKET OVERVIEW */}
      {market && (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Zap size={16} color="var(--accent-primary)" />
            <span style={{ fontWeight: 600, fontSize: 15 }}>Market Overview</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {Object.entries(market.avg_salary_trends || {}).map(([level, data]) => (
              <div key={level} style={{
                background: 'var(--bg-secondary)', borderRadius: 10,
                padding: 16, border: '1px solid var(--border)'
              }}>
                <div style={{
                  fontSize: 12, color: 'var(--text-muted)',
                  textTransform: 'capitalize', marginBottom: 8
                }}>
                  {level.replace(/_/g, ' ')}
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
                  {data.range}
                </div>
                <span style={{
                  fontSize: 12, fontWeight: 600, padding: '3px 8px', borderRadius: 20,
                  background: 'rgba(16,185,129,0.1)', color: '#10b981',
                  border: '1px solid rgba(16,185,129,0.2)'
                }}>{data.growth} YoY</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}