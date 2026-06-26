import { useNavigate } from 'react-router-dom';

const EMOJI = {
  Plumbing: '🔧', Tutoring: '📚', Photography: '📷', Cleaning: '🧹',
  'Tech Repair': '💻', Barber: '✂️', Tailoring: '🧵', Design: '🎨', Other: '⭐'
};

export default function ListingCard({ listing }) {
  const navigate = useNavigate();
  const initials = listing.seller_name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '??';

  return (
    <div className="listing-card" onClick={() => navigate(`/listings/${listing.id}`)}>
      <div className="listing-img">
        {listing.featured === 1 && <span className="listing-featured-badge">⭐ Featured</span>}
        {listing.image
          ? <img src={listing.image} alt={listing.title} />
          : <span>{EMOJI[listing.category] || '⭐'}</span>
        }
      </div>

      <div className="listing-body">
        <div className="listing-category">{listing.category}</div>
        <div className="listing-title">{listing.title}</div>
        <div className="listing-seller">
          <div className="seller-avatar">{initials}</div>
          {listing.seller_name}
        </div>
        <div className="listing-location">
          <span>📍</span>
          {listing.is_remote ? 'Remote / Online' : listing.city}
        </div>

        <div className="listing-footer-meta">
          <span className="listing-rating">
            ★ {Number(listing.rating || 0).toFixed(1)}
            <span>({listing.num_reviews || 0})</span>
          </span>
          <span className="listing-price">
            {listing.price_type === 'from' ? 'From ' : ''}
            {Number(listing.price).toLocaleString()} CFA
          </span>
        </div>
      </div>

      <div className="listing-card-footer">
        <button className="btn-msg" onClick={e => { e.stopPropagation(); navigate(`/listings/${listing.id}`); }}>
          💬 Message seller
        </button>
      </div>
    </div>
  );
}
