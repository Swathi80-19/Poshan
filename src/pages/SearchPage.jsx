import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Bookmark, Clock3, MapPin, Search, SlidersHorizontal, Star } from 'lucide-react'

const theme = {
  primary: '#73955f',
  deep: '#465c39',
  gold: '#c9953b',
  muted: '#7f8776',
  line: 'rgba(92, 120, 74, 0.14)',
}

const filterTabs = ['All', 'Clinical', 'Weight Care', 'Sports', 'Gut Health', 'PCOS']

const doctors = [
  { id: 1, name: 'Dr. Sara Ali Khan', specialty: 'Clinical Nutrition', rating: 4.8, reviews: 126, exp: 8, location: 'Delhi', fee: '₹599', nextSlot: 'Today, 4 PM', initials: 'SK', tint: '#eef3ef', tag: 'Top Rated' },
  { id: 2, name: 'Dr. Aishwarya', specialty: 'Weight Management', rating: 4.7, reviews: 98, exp: 7, location: 'Mumbai', fee: '₹549', nextSlot: 'Today, 6 PM', initials: 'AI', tint: '#f3e4d8', tag: 'Popular' },
  { id: 3, name: 'Dr. Athlone', specialty: 'Food Science & Nutrition', rating: 4.5, reviews: 74, exp: 5, location: 'Bangalore', fee: '₹449', nextSlot: 'Tomorrow, 10 AM', initials: 'AT', tint: '#f1ede6' },
  { id: 4, name: 'Dr. Bipasha', specialty: 'Nutrition & Dietetics', rating: 4.9, reviews: 203, exp: 12, location: 'Chennai', fee: '₹799', nextSlot: 'Today, 3 PM', initials: 'BP', tint: '#efe8d9', tag: 'Signature' },
  { id: 5, name: 'Dr. Fateh Noor', specialty: 'Nutritional Biochemistry', rating: 4.6, reviews: 89, exp: 9, location: 'Hyderabad', fee: '₹699', nextSlot: 'Today, 7 PM', initials: 'FN', tint: '#eef3ef' },
  { id: 6, name: 'Dr. Ramesh Gupta', specialty: 'Sports Nutrition', rating: 4.4, reviews: 61, exp: 6, location: 'Pune', fee: '₹399', nextSlot: 'Tomorrow, 2 PM', initials: 'RG', tint: '#f3e4d8' },
]

export default function SearchPage() {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState('All')
  const [query, setQuery] = useState('')
  const [saved, setSaved] = useState(new Set())
  const [sortBy, setSortBy] = useState('rating')

  const filtered = useMemo(() => {
    return doctors
      .filter((doctor) => {
        const matchesQuery =
          doctor.name.toLowerCase().includes(query.toLowerCase()) ||
          doctor.specialty.toLowerCase().includes(query.toLowerCase())

        const matchesFilter =
          activeFilter === 'All' ||
          doctor.specialty.toLowerCase().includes(activeFilter.toLowerCase()) ||
          doctor.name.toLowerCase().includes(activeFilter.toLowerCase())

        return matchesQuery && matchesFilter
      })
      .sort((a, b) => (sortBy === 'rating' ? b.rating - a.rating : b.exp - a.exp))
  }, [activeFilter, query, sortBy])

  return (
    <div className="animate-fade">
      <div className="page-header">
        <div className="page-header-left">
          <span className="page-header-greeting">Expert discovery</span>
          <span className="page-header-title">Find your nutrition match</span>
        </div>
        <div className="page-header-right">
          <button className="header-icon-btn"><Bell size={18} /></button>
          <div className="header-avatar">K</div>
        </div>
      </div>

      <div className="page-body">
        <section className="dashboard-hero" style={{ marginBottom: 18 }}>
          <div className="dashboard-hero-grid">
            <div>
              <div className="eyebrow">Curated consults</div>
              <h2 className="hero-heading" style={{ marginTop: '0.55rem' }}>
                A calmer directory with stronger fit signals.
              </h2>
              <p className="hero-copy">
                Browse specialists by relevance, compare consultation style, and move into booking from a cleaner full-width workspace.
              </p>
              <div className="pill-row">
                <span className="badge badge-green">12 experts available today</span>
                <span className="badge badge-amber">Fastest slot: 3 PM</span>
                <span className="badge badge-gray">Focus on quality over clutter</span>
              </div>
            </div>

            <div className="focus-card">
              <div className="dashboard-panel-heading">
                <div>
                  <h3>Featured match</h3>
                  <p>Best aligned with structured long-term nutrition care</p>
                </div>
                <span className="badge badge-amber">Signature</span>
              </div>
              <div className="timeline-item" style={{ paddingTop: 0 }}>
                <div className="queue-avatar" style={{ background: '#efe8d9' }}>BP</div>
                <div>
                  <div className="queue-title">Dr. Bipasha</div>
                  <div className="queue-sub">12 years · Nutrition & Dietetics · Chennai</div>
                </div>
                <div className="queue-meta" style={{ color: theme.gold, fontWeight: 800 }}>₹799</div>
              </div>
              <div className="pill-row">
                <span className="badge badge-green">4.9 rating</span>
                <span className="badge badge-gray">203 reviews</span>
                <span className="badge badge-amber">Today, 3 PM</span>
              </div>
              <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/app/doctor/4')}>
                Book featured expert
              </button>
            </div>
          </div>
        </section>

        <div className="g-2-auto">
          <div className="search-input-wrap" style={{ minHeight: 52 }}>
            <Search size={16} color={theme.muted} />
            <input placeholder="Search by name or specialty" value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="form-input"
              style={{ minHeight: 52, paddingLeft: 16 }}
            >
              <option value="rating">Sort by rating</option>
              <option value="exp">Sort by experience</option>
            </select>
            <button className="header-icon-btn">
              <SlidersHorizontal size={16} />
            </button>
          </div>
        </div>

        <div className="dashboard-panel-heading" style={{ marginTop: 6 }}>
          <div className="filter-tabs">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`filter-tab ${activeFilter === tab ? 'active' : ''}`}
                onClick={() => setActiveFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <span style={{ color: theme.muted, fontSize: 13 }}>{filtered.length} experts found</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
          {filtered.map((doctor) => {
            const isSaved = saved.has(doctor.id)
            return (
              <article
                key={doctor.id}
                className="doctor-card"
                style={{ padding: 20, cursor: 'pointer' }}
                onClick={() => navigate(`/app/doctor/${doctor.id}`)}
              >
                <div className="dashboard-panel-heading" style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div className="queue-avatar" style={{ background: doctor.tint }}>{doctor.initials}</div>
                    <div>
                      <div className="doctor-name">{doctor.name}</div>
                      <div className="doctor-specialty">{doctor.specialty}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      setSaved((current) => {
                        const next = new Set(current)
                        if (next.has(doctor.id)) next.delete(doctor.id)
                        else next.add(doctor.id)
                        return next
                      })
                    }}
                    style={{ color: isSaved ? theme.primary : '#c1c7bd' }}
                  >
                    <Bookmark size={18} fill={isSaved ? theme.primary : 'none'} />
                  </button>
                </div>

                <div className="pill-row" style={{ marginTop: 0, marginBottom: 14 }}>
                  {doctor.tag ? <span className="badge badge-amber">{doctor.tag}</span> : null}
                  <span className="badge badge-green">{doctor.exp} years</span>
                </div>

                <div className="timeline-list">
                  <div className="signal-item" style={{ gridTemplateColumns: 'auto 1fr auto', paddingTop: 0 }}>
                    <Star size={14} color={theme.gold} fill={theme.gold} />
                    <div className="signal-title">Rating</div>
                    <div className="signal-meta" style={{ color: theme.ink }}>{doctor.rating} ({doctor.reviews})</div>
                  </div>
                  <div className="signal-item" style={{ gridTemplateColumns: 'auto 1fr auto' }}>
                    <MapPin size={14} color={theme.muted} />
                    <div className="signal-title">Location</div>
                    <div className="signal-meta">{doctor.location}</div>
                  </div>
                  <div className="signal-item" style={{ gridTemplateColumns: 'auto 1fr auto' }}>
                    <Clock3 size={14} color={theme.muted} />
                    <div className="signal-title">Next slot</div>
                    <div className="signal-meta">{doctor.nextSlot}</div>
                  </div>
                </div>

                <div className="dashboard-panel-heading" style={{ marginTop: 16, marginBottom: 0 }}>
                  <div>
                    <div className="eyebrow" style={{ fontSize: 11 }}>Consultation fee</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 1, marginTop: 6 }}>{doctor.fee}</div>
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={(event) => {
                      event.stopPropagation()
                      navigate(`/app/doctor/${doctor.id}`)
                    }}
                  >
                    Book
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}
