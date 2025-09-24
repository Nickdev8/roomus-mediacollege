import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import RoomCard from '../components/RoomCard.jsx';
import { searchRooms, getRoomCounts } from '../../../api/rooms';

const BUDGETS = ['€400-600', '€600-800', '€800-1000', '€1000-1200'];
const AMENITIES = ['wifi', 'washing_machine', 'dishwasher', 'balcony'];
const AMENITY_LABELS = {
  wifi: 'WiFi',
  washing_machine: 'Washing Machine',
  dishwasher: 'Dishwasher',
  balcony: 'Balcony',
};

export default function ListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState({ items: [], total: 0, page: 1, pageSize: 12 });
  const [counts, setCounts] = useState({ budgetRanges: {}, roomTypes: {}, amenities: {} });
  const [loading, setLoading] = useState(false);

  const state = useMemo(() => ({
    sort: searchParams.get('sort') || 'newest',
    city: searchParams.get('city') || '',
    budgetRange: searchParams.get('budgetRange') || '',
    roomType: searchParams.get('roomType') || '',
    amenities: (searchParams.get('amenities') || '').split(',').filter(Boolean),
    moveInDate: searchParams.get('moveInDate') || '',
    page: parseInt(searchParams.get('page') || '1', 10),
  }), [searchParams]);

  useEffect(() => {
    setLoading(true);
    searchRooms({
      sort: state.sort,
      city: state.city,
      budgetRange: state.budgetRange,
      roomType: state.roomType,
      amenities: state.amenities,
      moveInDate: state.moveInDate,
      page: state.page,
      pageSize: 12,
    }).then(setData).finally(() => setLoading(false));

    getRoomCounts({
      city: state.city,
      budgetRange: state.budgetRange,
      roomType: state.roomType,
      amenities: state.amenities,
      moveInDate: state.moveInDate,
    }).then(setCounts);
  }, [state.city, state.budgetRange, state.roomType, state.amenities.join(','), state.moveInDate, state.page, state.sort]);

  function updateParam(k, v) {
    const next = new URLSearchParams(searchParams);
    if (!v || (Array.isArray(v) && v.length === 0)) next.delete(k);
    else next.set(k, Array.isArray(v) ? v.join(',') : v);
    if (k !== 'page') {
      next.set('page', '1');
    }
    setSearchParams(next);
  }

  const handleFilterChange = (key, value) => {
    updateParam(key, value);
  };

  return (
    <div className="layout">
      <aside className="filters">
        <h2>Filters</h2>

        <label>
          <div className="rm-filter-header">
            <span>City / neighborhood</span>
            {state.city && (
              <button
                className="rm-clear-filter-btn"
                onClick={() => handleFilterChange("city", "")}
              >
                Clear
              </button>
            )}
          </div>
          <div className="rm-filter-input-wrapper">
            <input
              type="text"
              placeholder="e.g. Amsterdam, Urk"
              value={state.city || ""}
              onChange={(e) => handleFilterChange("city", e.target.value)}
              className="rm-filter-input"
            />
          </div>
        </label>
        
        <label>
          Sort
          <select value={state.sort} onChange={e => updateParam('sort', e.target.value)}>
            <option value="newest">Newest</option>
            <option value="price_asc">Price ↑</option>
            <option value="price_desc">Price ↓</option>
          </select>
        </label>

        <label>
          <div className="rm-filter-header">
            <span>Budget range</span>
            {state.budgetRange && (
              <button
                className="rm-clear-filter-btn"
                onClick={() => handleFilterChange("budgetRange", "")}
              >
                Clear
              </button>
            )}
          </div>
          <div className="rm-filter-input-wrapper">
            <select value={state.budgetRange} onChange={e => handleFilterChange('budgetRange', e.target.value)}>
              <option value="">All Budgets</option>
              {BUDGETS.map(b => <option key={b} value={b}>{b} ({counts.budgetRanges[b] || 0})</option>)}
            </select>
          </div>
        </label>

        <label>
          <div className="rm-filter-header">
            <span>Room type</span>
            {state.roomType && (
              <button
                className="rm-clear-filter-btn"
                onClick={() => handleFilterChange("roomType", "")}
              >
                Clear
              </button>
            )}
          </div>
          <div className="rm-filter-input-wrapper">
            <select value={state.roomType} onChange={e => handleFilterChange('roomType', e.target.value)}>
              <option value="">All Room Types</option>
              <option value="private">Private ({counts.roomTypes.private || 0})</option>
              <option value="shared">Shared ({counts.roomTypes.shared || 0})</option>
              <option value="studio">Studio ({counts.roomTypes.studio || 0})</option>
            </select>
          </div>
        </label>

        <fieldset>
          <div className="rm-filter-header">
            <legend>Amenities</legend>
            {state.amenities.length > 0 && (
              <button
                className="rm-clear-filter-btn"
                onClick={() => handleFilterChange("amenities", [])}
              >
                Clear All
              </button>
            )}
          </div>
          {AMENITIES.map(a => (
            <label key={a} className="checkbox">
              <input
                type="checkbox"
                checked={state.amenities.includes(a)}
                onChange={(e) => {
                  const next = e.target.checked
                    ? [...state.amenities, a]
                    : state.amenities.filter(x => x !== a);
                  handleFilterChange('amenities', next);
                }}
              />
              {AMENITY_LABELS[a]} ({counts.amenities[a] || 0})
            </label>
          ))}
        </fieldset>

        <label>
          <div className="rm-filter-header">
            <span>Move-in date</span>
            {state.moveInDate && (
              <button
                className="rm-clear-filter-btn"
                onClick={() => handleFilterChange("moveInDate", "")}
              >
                Clear
              </button>
            )}
          </div>
          <div className="rm-filter-input-wrapper">
            <input type="date" value={state.moveInDate} onChange={e => handleFilterChange('moveInDate', e.target.value)} />
          </div>
        </label>

      </aside>

      <section className="results">
        {loading && <div className="loading">Loading…</div>}
        {!loading && data.items.length === 0 && <div className="empty">No rooms match. Try widening your budget.</div>}

        <div className="grid">
          {data.items.map(room => <RoomCard key={room.id} room={room} />)}
        </div>

        <div className="pagination">
          <button
            disabled={state.page <= 1}
            onClick={() => updateParam('page', String(state.page - 1))}
          >Prev</button>
          <span>Page {state.page} / {Math.max(1, Math.ceil(data.total / data.pageSize))}</span>
          <button
            disabled={state.page >= Math.ceil(data.total / data.pageSize)}
            onClick={() => updateParam('page', String(state.page + 1))}
          >Next</button>
        </div>
      </section>
    </div>
  );
}
