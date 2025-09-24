import { http, HttpResponse } from 'msw';
import roomsData from './fixtures/rooms.json';

// Utility: filter helpers
function parseBudget(budgetRange) {
  if (!budgetRange) return { min: 0, max: Infinity };
  const [min, max] = budgetRange.replace(/€/g, '').split('-').map(Number);
  return { min, max };
}

export const handlers = [
  // GET /api/rooms/search?city=&budgetRange=&roomType=&amenities=a,b&moveInDate=YYYY-MM-DD&page=1&pageSize=12&sort=price_asc
  http.get('/api/rooms/search', ({ request }) => {
    const url = new URL(request.url);
    const city = url.searchParams.get('city') || '';
    const budgetRange = url.searchParams.get('budgetRange') || '';
    const roomType = url.searchParams.get('roomType') || '';
    const amenities = (url.searchParams.get('amenities') || '').split(',').filter(Boolean);
    const moveInDate = url.searchParams.get('moveInDate') || '';
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const pageSize = parseInt(url.searchParams.get('pageSize') || '12', 10);
    const sort = url.searchParams.get('sort') || 'newest';
    const budget = parseBudget(budgetRange);

    let rows = roomsData.filter(r =>
      (city ? r.city.toLowerCase().includes(city.toLowerCase()) || r.neighborhood.toLowerCase().includes(city.toLowerCase()) : true) &&
      (budget ? r.price >= budget.min && r.price <= budget.max : true) &&
      (roomType ? r.roomType === roomType : true) &&
      (moveInDate ? r.moveInDate >= moveInDate : true) &&
      (amenities.length > 0 ? amenities.every(a => r.amenities.includes(a)) : true)
    );

    if (sort === 'price_asc') rows.sort((a,b)=>a.price-b.price);
    if (sort === 'price_desc') rows.sort((a,b)=>b.price-a.price);
    if (sort === 'newest') rows.sort((a,b)=> (b.moveInDate || '').localeCompare(a.moveInDate || ''));

    const total = rows.length;
    const start = (page - 1) * pageSize;
    const items = rows.slice(start, start + pageSize);

    return HttpResponse.json({ items, page, pageSize, total });
  }),

  // GET /api/rooms/counts?city=&budgetRange=&roomType=&amenities=a,b&moveInDate=YYYY-MM-DD
  http.get('/api/rooms/counts', ({ request }) => {
    const url = new URL(request.url);
    const city = url.searchParams.get('city') || '';
    const budgetRange = url.searchParams.get('budgetRange') || '';
    const roomType = url.searchParams.get('roomType') || '';
    const amenities = (url.searchParams.get('amenities') || '').split(',').filter(Boolean);
    const moveInDate = url.searchParams.get('moveInDate') || '';

    const getFilteredRooms = (excludeFilter = null) => {
      return roomsData.filter(r => {
        const cityMatch = city ? r.city.toLowerCase().includes(city.toLowerCase()) || r.neighborhood.toLowerCase().includes(city.toLowerCase()) : true;
        const moveInDateMatch = moveInDate ? r.moveInDate >= moveInDate : true;

        const budgetMatch = excludeFilter === 'budgetRange' ? true : (budgetRange ? parseBudget(budgetRange).min <= r.price && r.price <= parseBudget(budgetRange).max : true);
        const roomTypeMatch = excludeFilter === 'roomType' ? true : (roomType ? r.roomType === roomType : true);
        const amenitiesMatch = excludeFilter === 'amenities' ? true : (amenities.length > 0 ? amenities.every(a => r.amenities.includes(a)) : true);

        return cityMatch && moveInDateMatch && budgetMatch && roomTypeMatch && amenitiesMatch;
      });
    };

    const counts = {
      budgetRanges: {
        '€400-600': getFilteredRooms('budgetRange').filter(r => r.price >= 400 && r.price <= 600).length,
        '€600-800': getFilteredRooms('budgetRange').filter(r => r.price >= 600 && r.price <= 800).length,
        '€800-1000': getFilteredRooms('budgetRange').filter(r => r.price >= 800 && r.price <= 1000).length,
        '€1000-1200': getFilteredRooms('budgetRange').filter(r => r.price >= 1000 && r.price <= 1200).length,
      },
      roomTypes: {
        private: getFilteredRooms('roomType').filter(r => r.roomType === 'private').length,
        shared: getFilteredRooms('roomType').filter(r => r.roomType === 'shared').length,
        studio: getFilteredRooms('roomType').filter(r => r.roomType === 'studio').length,
      },
      amenities: {
        wifi: getFilteredRooms('amenities').filter(r => r.amenities.includes('wifi')).length,
        washing_machine: getFilteredRooms('amenities').filter(r => r.amenities.includes('washing_machine')).length,
        dishwasher: getFilteredRooms('amenities').filter(r => r.amenities.includes('dishwasher')).length,
        balcony: getFilteredRooms('amenities').filter(r => r.amenities.includes('balcony')).length,
      },
    };

    return HttpResponse.json(counts);
  }),

  // GET /api/rooms/:id
  http.get('/api/rooms/:id', ({ params }) => {
    const room = roomsData.find(r => r.id === params.id);
    if (!room) return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    return HttpResponse.json(room);
  }),

  // POST /api/rooms/:id/contact
  http.post('/api/rooms/:id/contact', async () => {
    // pretend to send a message — always OK in sandbox
    return HttpResponse.json({ ok: true });
  }),
];
