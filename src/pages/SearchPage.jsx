import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Bookmark, Mail, Search, SlidersHorizontal, UserRound } from 'lucide-react'
import { getNutritionists } from '../lib/memberApi'
import { getMemberDisplayName } from '../lib/session'

const theme = {
  primary: '#73955f',
  deep: '#465c39',
  muted: '#7f8776',
}

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'N'
}

function buildExpertProfile(item, index) {
  const tintPalette = ['#eef3ef', '#f3e4d8', '#f1ede6', '#efe8d9', '#e8f0fb', '#eee6fa']
  const years = typeof item.experience === 'number' && item.experience >= 0 ? item.experience : null

  return {
    id: item.id,
    name: item.name || item.username || 'Nutritionist',
    specialty: item.specialization || 'General Dietetics',
    email: item.email || '',
    username: item.username || '',
    initials: getInitials(item.name || item.username || 'Nutritionist'),
    tint: tintPalette[index % tintPalette.length],
    exp: years,
    expLabel: years === null ? 'Experience not shared' : `${years} year${years === 1 ? '' : 's'} experience`,
  }
}

export default function SearchPage() {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState('All')
  const [query, setQuery] = useState('')
  const [saved, setSaved] = useState(new Set())
  const [sortBy, setSortBy] = useState('experience')
  const [experts, setExperts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const username = getMemberDisplayName()
  const initial = username.charAt(0).toUpperCase()

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        setLoading(true)
        setError('')
        const response = await getNutritionists()

        if (!cancelled) {
          setExperts(Array.isArray(response) ? response.map(buildExpertProfile) : [])
        }
      } catch (requestError) {
        if (!cancelled) {
          setExperts([])
          setError(requestError.message || 'Unable to load nutritionists right now.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  const filterTabs = useMemo(() => (
    ['All', ...new Set(experts.map((item) => item.specialty).filter(Boolean))]
  ), [experts])

  const filtered = useMemo(() => (
    experts
      .filter((doctor) => {
        const searchValue = `${doctor.name} ${doctor.specialty} ${doctor.email} ${doctor.username}`.toLowerCase()
        const matchesQuery = searchValue.includes(query.toLowerCase())
        const matchesFilter = activeFilter === 'All' || doctor.specialty === activeFilter
        return matchesQuery && matchesFilter
      })
      .sort((left, right) => {
        if (sortBy === 'name') {
          return left.name.localeCompare(right.name)
        }

        return (right.exp ?? -1) - (left.exp ?? -1)
      })
  ), [activeFilter, experts, query, sortBy])

  const featuredDoctor = filtered[0] || experts[0] || null

  return (
    <div className="animate-fade">
      <div className="page-header">
        <div className="page-header-left">
          <span className="page-header-greeting">Expert discovery</span>
          <span className="page-header-title">Find your nutritionist</span>
        </div>
        <div className="page-header-right">
          <button className="header-icon-btn"><Bell size={18} /></button>
          <div className="header-avatar">{initial}</div>
        </div>
      </div>

      <div className="page-body">
        <section className="dashboard-hero" style={{ marginBottom: 18 }}>
          <div className="dashboard-hero-grid">
            <div>
              <div className="eyebrow">Experts</div>
              <h2 className="hero-heading" style={{ marginTop: '0.55rem' }}>
                Browse specialists available for guidance, planning, and consultations.
              </h2>
              <p className="hero-copy">
                Search by name or specialization and open a profile to book an appointment.
              </p>
              <div className="pill-row">
                <span className="badge badge-green">{experts.length} nutritionists</span>
                <span className="badge badge-amber">{filtered.length} matches</span>
              </div>
            </div>

            <div className="focus-card">
              <div className="dashboard-panel-heading">
                <div>
                  <h3>Selected profile</h3>
                  <p>{featuredDoctor ? 'Open the profile to review details and book.' : 'No nutritionists available yet'}</p>
                </div>
              </div>

              {featuredDoctor ? (
                <>
                  <div className="timeline-item" style={{ paddingTop: 0 }}>
                    <div className="queue-avatar" style={{ background: featuredDoctor.tint }}>{featuredDoctor.initials}</div>
                    <div>
                      <div className="queue-title">{featuredDoctor.name}</div>
                      <div className="queue-sub">{featuredDoctor.specialty}</div>
                    </div>
                  </div>
                  <div className="pill-row">
                    <span className="badge badge-green">{featuredDoctor.expLabel}</span>
                    {featuredDoctor.username ? <span className="badge badge-gray">@{featuredDoctor.username}</span> : null}
                  </div>
                  <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate(`/app/doctor/${featuredDoctor.id}`)}>
                    Open expert profile
                  </button>
                </>
              ) : (
                <div className="admin-note" style={{ marginTop: '1rem' }}>
                  Nutritionist profiles will appear here when available.
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="g-2-auto">
          <div className="search-input-wrap" style={{ minHeight: 52 }}>
            <Search size={16} color={theme.muted} />
            <input placeholder="Search by name, specialty, or email" value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="form-input"
              style={{ minHeight: 52, paddingLeft: 16 }}
            >
              <option value="experience">Sort by experience</option>
              <option value="name">Sort by name</option>
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

        {loading ? <div className="admin-note">Loading nutritionists...</div> : null}
        {error ? <div className="admin-note">{error}</div> : null}
        {!loading && !error && !filtered.length ? (
          <div className="admin-note">No nutritionists match this search yet.</div>
        ) : null}

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
                  <span className="badge badge-green">{doctor.expLabel}</span>
                </div>

                <div className="timeline-list">
                  <div className="signal-item" style={{ gridTemplateColumns: 'auto 1fr auto', paddingTop: 0 }}>
                    <UserRound size={14} color={theme.deep} />
                    <div className="signal-title">Username</div>
                    <div className="signal-meta">{doctor.username || 'Not set'}</div>
                  </div>
                  <div className="signal-item" style={{ gridTemplateColumns: 'auto 1fr auto' }}>
                    <Mail size={14} color={theme.muted} />
                    <div className="signal-title">Email</div>
                    <div className="signal-meta">{doctor.email || 'Not shared'}</div>
                  </div>
                </div>

                <div className="dashboard-panel-heading" style={{ marginTop: 16, marginBottom: 0 }}>
                  <div>
                    <div className="eyebrow" style={{ fontSize: 11 }}>Available for booking</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, lineHeight: 1, marginTop: 6 }}>{doctor.specialty}</div>
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
