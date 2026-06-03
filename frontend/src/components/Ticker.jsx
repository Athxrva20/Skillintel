const SKILLS = [
  { name: 'Python', change: '+12%', up: true },
  { name: 'React', change: '+8%', up: true },
  { name: 'Kubernetes', change: '+20%', up: true },
  { name: 'Machine Learning', change: '+22%', up: true },
  { name: 'TypeScript', change: '+18%', up: true },
  { name: 'AWS', change: '+15%', up: true },
  { name: 'Docker', change: '+10%', up: true },
  { name: 'Data Science', change: '+16%', up: true },
  { name: 'jQuery', change: '-15%', up: false },
  { name: 'Angular', change: '-2%', up: false },
]

export default function Ticker() {
  const items = [...SKILLS, ...SKILLS]
  return (
    <div className="ticker-wrap">
      <span className="ticker-label">⚡ Trending</span>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div className="ticker-inner">
          {items.map((s, i) => (
            <span key={i} className="tick-item">
              <span className="tick-skill">{s.name}</span>
              <span className={s.up ? 'tick-up' : 'tick-down'}>
                {s.up ? '▲' : '▼'} {s.change}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}