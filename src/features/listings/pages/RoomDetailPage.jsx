import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRoom, contactRoom } from '../../../api/rooms';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const AMENITY_LABELS = {
  wifi: 'WiFi',
  washing_machine: 'Washing Machine',
  dishwasher: 'Dishwasher',
  balcony: 'Balcony',
};

export default function RoomDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [ok, setOk] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getRoom(id).then(setRoom);
  }, [id]);

  const handleContactSubmit = async () => {
    setSending(true);
    setError(null);
    try {
      const res = await contactRoom(room.id, { message });
      if (res.ok) {
        setOk(true);
        setMessage(''); // Clear message on success
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (!room) return <div>Loading…</div>;

  const images = Array.from({ length: 3 }).map((_, index) =>
    `https://picsum.photos/seed/${room.id + index}/600/400`
  );

  return (
    <article className="detail">
      <button onClick={() => navigate(-1)} className="back-button">← Back to listings</button>
      <div className="detail__media">
        <Swiper
          modules={[Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          pagination={{ clickable: true }}
          loop={true}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <img src={image} alt={room.title} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="detail__content">
        <h1>{room.title}</h1>
        <p className="detail__price"><strong>€{room.price}</strong>/month</p>
        <p className="detail__location">{room.neighborhood}, {room.city}</p>
        <p className="detail__meta">Move-in: {room.moveInDate} · Type: {room.roomType}</p>
        <div className="detail__amenities">
          <h3>Amenities:</h3>
          <ul>
            {room.amenities.map(amenity => (
              <li key={amenity}>{AMENITY_LABELS[amenity] || amenity}</li>
            ))}
          </ul>
        </div>
        <p className="detail__description">{room.description}</p>

        <div className="contact-form">
          <h3>Contact Lister</h3>
          <textarea
            placeholder="I'm interested in this room! Please tell me more."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="4"
          ></textarea>
          <button
            className="btn"
            onClick={handleContactSubmit}
            disabled={sending}
          >
            {sending ? 'Sending...' : 'Send Message'}
          </button>
          {ok && <p className="toast">We’ll let the lister know. (Sandbox)</p>}
          {error && <p className="toast error">Failed to send message. Please try again.</p>}
        </div>
      </div>
    </article>
  );
}
