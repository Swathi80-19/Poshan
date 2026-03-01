import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, SlidersHorizontal, Star, Bell, MapPin, Clock, Bookmark } from 'lucide-react'

const filterTabs = ['All', 'Nutrition', 'Dietitian', 'Experts', 'Cooking', 'Sports']

const doctors = [
    {
        id: 1, name: 'Dr. Sara Ali Khan', specialty: 'B.Sc. in Nutritional Science',
        rating: 4.8, reviews: 126, exp: '8 years', status: 'online',
        tag: 'Top Rated', initials: 'SK', color: '#DBEAFE',
        location: 'Delhi', fee: '₹599', nextSlot: 'Today, 4 PM',
    },
    {
        id: 2, name: 'Dr. Aishwarya', specialty: 'M.Sc in Clinical Nutrition',
        rating: 4.7, reviews: 98, exp: '7 years', status: 'online',
        tag: 'Popular', initials: 'AI', color: '#E8F1E4',
        location: 'Mumbai', fee: '₹549', nextSlot: 'Today, 6 PM',
    },
    {
        id: 3, name: 'Dr. Athlone', specialty: 'B.Sc in Food Science & Nutrition',
        rating: 4.5, reviews: 74, exp: '5 years', status: 'offline',
        tag: null, initials: 'AT', color: '#FEF9C3',
        location: 'Bangalore', fee: '₹449', nextSlot: 'Tomorrow, 10 AM',
    },
    {
        id: 4, name: 'Dr. Bipasha', specialty: 'M.Sc in Nutrition & Dietetics',
        rating: 4.9, reviews: 203, exp: '12 years', status: 'online',
        tag: 'Expert', initials: 'BP', color: '#EDE9FE',
        location: 'Chennai', fee: '₹799', nextSlot: 'Today, 3 PM',
    },
    {
        id: 5, name: 'Dr. Fateh Noor', specialty: 'Ph.D in Nutritional Biochemistry',
        rating: 4.6, reviews: 89, exp: '9 years', status: 'online',
        tag: null, initials: 'FN', color: '#FEE2E2',
        location: 'Hyderabad', fee: '₹699', nextSlot: 'Today, 7 PM',
    },
    {
        id: 6, name: 'Dr. Ramesh Gupta', specialty: 'M.Sc in Sports Nutrition',
        rating: 4.4, reviews: 61, exp: '6 years', status: 'offline',
        tag: null, initials: 'RG', color: '#F0FDF4',
        location: 'Pune', fee: '₹399', nextSlot: 'Tomorrow, 2 PM',
    },
]

export default function SearchPage() {
    const navigate = useNavigate()
    const [activeFilter, setActiveFilter] = useState('Nutrition')
    const [query, setQuery] = useState('')
    const [saved, setSaved] = useState(new Set())
    const [sortBy, setSortBy] = useState('rating')

    const filtered = doctors
        .filter(d =>
            d.name.toLowerCase().includes(query.toLowerCase()) ||
            d.specialty.toLowerCase().includes(query.toLowerCase())
        )
        .sort((a, b) => sortBy === 'rating' ? b.rating - a.rating : parseInt(b.exp) - parseInt(a.exp))

    return (
        <div className="animate-fade">
            <div className="page-header">
                <div className="page-header-left">
                    <span className="page-header-greeting">Find the best for you</span>
                    <span className="page-header-title">Search Experts</span>
                </div>
                <div className="page-header-right">
                    <button className="header-icon-btn"><Bell size={18} /></button>
                    <div className="header-avatar">K</div>
                </div>
            </div>

            <div className="page-body">
                {/* Featured banner */}
                <div style={{
                    background: 'linear-gradient(135deg, #EDE9FE 0%, #DBEAFE 100%)',
                    borderRadius: 20, padding: '20px 24px', marginBottom: 24,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    border: '1px solid #C4B5FD'
                }}>
                    <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
                            ⭐ Featured Nutritionist
                        </div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: '#111827', marginBottom: 2 }}>Dr. Bipasha</div>
                        <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 10 }}>M.Sc in Nutrition & Dietetics · 12 years exp</div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <span style={{ background: '#F5F3FF', color: '#7C3AED', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>⭐ 4.9 rating</span>
                            <span style={{ background: '#F5F3FF', color: '#7C3AED', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>203 reviews</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: '#7C3AED', border: '3px solid #C4B5FD' }}>BP</div>
                        <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: 12 }}
                            onClick={() => navigate('/app/doctor/4')}>
                            Book Now
                        </button>
                    </div>
                </div>

                {/* Search + sort */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                    <div className="search-input-wrap" style={{ flex: 1 }}>
                        <Search size={16} color="#9CA3AF" />
                        <input
                            placeholder="Search name, specialty..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                        />
                    </div>
                    <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                        style={{
                            padding: '0 14px', borderRadius: 12, border: '1.5px solid #E5E7EB',
                            fontSize: 13, color: '#374151', background: 'white', cursor: 'pointer',
                            fontFamily: 'inherit', outline: 'none'
                        }}
                    >
                        <option value="rating">Sort: Rating</option>
                        <option value="exp">Sort: Experience</option>
                    </select>
                    <button style={{ width: 44, height: 44, borderRadius: 12, background: '#F3F4F6', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6B7280', flexShrink: 0 }}>
                        <SlidersHorizontal size={16} />
                    </button>
                </div>

                {/* Filter tabs */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <div className="filter-tabs">
                        {filterTabs.map(t => (
                            <button
                                key={t}
                                className={`filter-tab ${activeFilter === t ? 'active' : ''}`}
                                onClick={() => setActiveFilter(t)}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    <span style={{ fontSize: 12, color: '#9CA3AF' }}>{filtered.length} found</span>
                </div>

                {/* Doctors grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 16 }}>
                    {filtered.map(doc => (
                        <div
                            key={doc.id}
                            className="doctor-card"
                            onClick={() => navigate(`/app/doctor/${doc.id}`)}
                            style={{ cursor: 'pointer', flexDirection: 'column', gap: 0, padding: 0, overflow: 'hidden' }}
                        >
                            {/* Card top strip */}
                            <div style={{ padding: '18px 18px 14px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                                <div style={{ position: 'relative', flexShrink: 0 }}>
                                    <div style={{
                                        width: 56, height: 56, borderRadius: 16, background: doc.color,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 800, fontSize: 17, color: '#374151'
                                    }}>
                                        {doc.initials}
                                    </div>
                                    <div style={{
                                        position: 'absolute', bottom: 2, right: 2,
                                        width: 11, height: 11, borderRadius: '50%',
                                        background: doc.status === 'online' ? '#22C55E' : '#D1D5DB',
                                        border: '2px solid white'
                                    }} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                                        <span className="doctor-name" style={{ fontSize: 14 }}>{doc.name}</span>
                                        {doc.tag && (
                                            <span className="pill pill-green" style={{ fontSize: 10, padding: '2px 7px', flexShrink: 0 }}>{doc.tag}</span>
                                        )}
                                    </div>
                                    <div className="doctor-specialty" style={{ fontSize: 12 }}>{doc.specialty}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                                        <Star size={11} fill="#EAB308" color="#EAB308" />
                                        <span style={{ fontWeight: 700, color: '#111827', fontSize: 12 }}>{doc.rating}</span>
                                        <span style={{ fontSize: 11, color: '#9CA3AF' }}>({doc.reviews})</span>
                                        <span style={{ color: '#D1D5DB' }}>·</span>
                                        <span style={{ fontSize: 11, color: '#6B7280' }}>{doc.exp}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={e => { e.stopPropagation(); setSaved(s => { const ns = new Set(s); ns.has(doc.id) ? ns.delete(doc.id) : ns.add(doc.id); return ns }) }}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, flexShrink: 0 }}
                                >
                                    <Bookmark size={16} fill={saved.has(doc.id) ? '#8BAF7C' : 'none'} color={saved.has(doc.id) ? '#8BAF7C' : '#D1D5DB'} />
                                </button>
                            </div>

                            {/* Card bottom strip */}
                            <div style={{
                                padding: '12px 18px', background: '#FAFAFA',
                                borderTop: '1px solid #F3F4F6',
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                            }}>
                                <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#6B7280' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <MapPin size={10} />{doc.location}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <Clock size={10} />{doc.nextSlot}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <span style={{ fontSize: 14, fontWeight: 800, color: '#111827' }}>{doc.fee}</span>
                                    <button
                                        className="btn btn-primary"
                                        style={{ padding: '6px 14px', fontSize: 12 }}
                                        onClick={e => { e.stopPropagation(); navigate(`/app/doctor/${doc.id}`) }}
                                    >
                                        Book
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
