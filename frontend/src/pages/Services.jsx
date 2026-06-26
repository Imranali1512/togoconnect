import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ListingCard from '../components/ListingCard';

const CATEGORIES = ['All','Plumbing','Tutoring','Photography','Cleaning','Tech Repair','Barber','Tailoring','Design','Other'];
const CITIES = ['All','Lomé','Sokodé','Kara','Kpalimé','Atakpamé','Remote'];

export default function Services() {
  const [searchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [city, setCity] = useState('All');

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (category !== 'All') params.category = category;
    if (city !== 'All') params.city = city;
    axios.get('/api/listings', { params })
      .then(r => setListings(r.data))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, [search, category, city]);

  return (
    <>
      <div className="browse-hero">
        <div className="container">
          <div className="section-label">Marketplace</div>
          <h1>Browse all services</h1>
          <p>{listings.length > 0 ? `${listings.length} services available across Togo` : 'Find the perfect professional for your needs'}</p>
        </div>
      </div>

      <div style={{ padding:'36px 0 60px', minHeight:'calc(100vh - 66px)' }}>
        <div className="container">
          <div className="browse-filters">
            <div className="filter-wrap filter-search-wrap">
              <span className="filter-icon">🔍</span>
              <input type="text" placeholder="Search services..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="filter-wrap">
              <span className="filter-icon">📍</span>
              <select value={city} onChange={e => setCity(e.target.value)}>
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="category-pills">
            {CATEGORIES.map(c => (
              <button key={c} className={`cat-pill${category === c ? ' active' : ''}`} onClick={() => setCategory(c)}>{c}</button>
            ))}
          </div>

          {loading ? (
            <div className="loader"><div className="spinner"></div></div>
          ) : listings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No services found</h3>
              <p>Try adjusting your filters or search with different keywords.</p>
            </div>
          ) : (
            <>
              <p style={{ fontSize:13, color:'var(--tl)', marginBottom:18 }}>{listings.length} services found</p>
              <div className="listings-grid">{listings.map(l => <ListingCard key={l.id} listing={l} />)}</div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
