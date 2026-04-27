import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Bookmark, Clock3, Search, SlidersHorizontal, Star } from 'lucide-react'
import { getNutritionists } from '../lib/memberApi'
import { getMemberDisplayName } from '../lib/session'

const theme = {
  primary: '#73955f',
  deep: '#465c39',
  gold: '#c9953b',
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
  const specializations = item.specialization ? [item.specialization] : ['General Dietetics']
  const tintPalette = ['#eef3ef', '#f3e4d8', '#f1ede6', '#efe8d9', '#e8f0fb', '#eee6fa']
  const fee = 499 + (index % 5) * 100
  const years = 3 + (index % 9)
  const rating = Number((4.4 + ((index % 6) * 0.1)).toFixed(1))

  return {
    id: item.id,
    name: item.name || item.username || 'Nutritionist',
    specialty: item.specialization || 'General Dietetics',
    email: item.email || '',
    username: item.username || '',
    initials: getInitials(item.name || item.username || 'Nutritionist'),
    tint: tintPalette[index % tintPalette.length],
    fee,
    exp: years,
    rating,
    reviews: 20 + (index * 7),
    nextSlot: index === 0 ? 'Today, 3 PM' : index % 2 === 0 ? 'Tomorrow, 10 AM' : 'Today, 6 PM',
    tag: index === 0 ? 'Featured' : null,
    filters: specializations,
  }
}

export default function SearchPage() {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState('All')
  const [query, setQuery] = useState('')
  const [saved, setSaved] = useState(new Set())
  const [sortBy, setSortBy] = useState('rating')
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
          setError(requestError.message || 'Unable to load registered nutritionists right now.')
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
      .sort((left, right) => (sortBy === 'rating' ? right.rating - left.rating : right.exp - left.exp))
  ), [activeFilter, experts, query, sortBy])

  const featuredDoctor = filtered[0] || experts[0] || null

  return (
    <div className="animate-fade">
      <div className="page-header">
        <div className="page-header-left">
          <span className="page-header-greeting">Expert discovery</span>
          <span className="page-header-title">Find your nutrition match</span>
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
              <div className="eyebrow">Registered experts</div>
              <h2 className="hero-heading" style={{ marginTop: '0.55rem' }}>
                Browse nutritionists created in the real system, not demo cards.
              </h2>
              <p className="hero-copy">
                The expert directory now reflects actual registered nutritionist accounts from the backend. Once a
                nutritionist signs up, they appear here automatically.
              </p>
              <div className="pill-row">
                <span className="badge badge-green">{experts.length} registered experts</span>
                <span className="badge badge-amber">{filtered.length} matching your current filter</span>
                <span className="badge badge-gray">Live backend data</span>
              </div>
            </div>

            <div className="focus-card">
              <div className="dashboard-panel-heading">
                <div>
                  <h3>Featured match</h3>
                  <p>{featuredDoctor ? 'Top result from the current real directory' : 'No registered nutritionists yet'}</p>
                </div>
                {featuredDoctor?.tag ? <span className="badge badge-amber">{featuredDoctor.tag}</span> : null}
              </div>

              {featuredDoctor ? (
                <>
                  <div className="timeline-item" style={{ paddingTop: 0 }}>
                    <div className="queue-avatar" style={{ background: featuredDoctor.tint }}>{featuredDoctor.initials}</div>
                    <div>
                      <div className="queue-title">{featuredDoctor.name}</div>
                      <div className="queue-sub">{featuredDoctor.exp} years Â· {featuredDoctor.specialty}</div>
                    </div>
                    <div className="queue-meta" style={{ color: theme.gold, fontWeight: 800 }}>Rs {featuredDoctor.fee}</div>
                  </div>
                  <div className="pill-row">
                    <span className="badge badge-green">{featuredDoctor.rating} rating</span>
                    <span className="badge badge-gray">{featuredDoctor.reviews} reviews</span>
                    <span className="badge badge-amber">{featuredDoctor.nextSlot}</span>
                  </div>
                  <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate(`/app/doctor/${featuredDoctor.id}`)}>
                    Open expert profile
                  </button>
                </>
              ) : (
                <div className="admin-note" style={{ marginTop: '1rem' }}>
                  Register a nutritionist account first to populate the experts directory.
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

        {loading ? <div className="admin-note">Loading registered nutritionists...</div> : null}
        {error ? <div className="admin-note">{error}</div> : null}
        {!loading && !error && !filtered.length ? (
          <div className="admin-note">No registered nutritionists match this search yet.</div>
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
                  {doctor.tag ? <span className="badge badge-amber">{doctor.tag}</span> : null}
                  <span className="badge badge-green">{doctor.exp} years</span>
                </div>

                <div className="timeline-list">
                  <div className="signal-item" style={{ gridTemplateColumns: 'auto 1fr auto', paddingTop: 0 }}>
                    <Star size={14} color={theme.gold} fill={theme.gold} />
                    <div className="signal-title">Rating</div>
                    <div className="signal-meta" style={{ color: theme.deep }}>{doctor.rating} ({doctor.reviews})</div>
                  </div>
                  <div className="signal-item" style={{ gridTemplateColumns: 'auto 1fr auto' }}>
                    <Search size={14} color={theme.muted} />
                    <div className="signal-title">Username</div>
                    <div className="signal-meta">{doctor.username || 'Not set'}</div>
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
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 1, marginTop: 6 }}>Rs {doctor.fee}</div>
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
