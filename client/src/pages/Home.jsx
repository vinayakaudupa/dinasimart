import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Bike, ChevronRight } from 'lucide-react';

export default function Home() {
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const navigate = useNavigate();
    const { orderPlaced, timeLeft } = useCart();

    useEffect(() => {
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => setCategories(data.data))
            .catch(err => console.error(err));

        fetch('/api/items')
            .then(res => res.json())
            .then(data => setItems(data.data))
            .catch(err => console.error(err));
    }, []);

    const getCategoryItems = (catId) => {
        return items.filter(i => i.category_id === catId).slice(0, 4); // Show top 4 items
    };

    return (
        <div style={{ minHeight: '100vh' }}>
            <Navbar />

            <main className="container" style={{ padding: '2rem 1rem' }}>

                <div style={{
                    background: 'var(--brand-gradient)',
                    borderRadius: 'var(--radius)',
                    padding: '2rem',
                    marginBottom: '1rem',
                    color: 'white',
                    boxShadow: 'var(--shadow-md)'
                }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Welcome to DinasiMart</h2>
                    <p>Get your daily essentials delivered in minutes.</p>
                </div>

                {/* Persistent Order Tracking Banner */}
                {orderPlaced && timeLeft > 0 && (
                    <div
                        onClick={() => navigate('/cart')}
                        style={{
                            background: '#e8f5e9',
                            border: '1px solid #4ade80',
                            borderRadius: 'var(--radius)',
                            padding: '1rem',
                            marginBottom: '2rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            boxShadow: 'var(--shadow-sm)'
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <div style={{
                                background: 'white',
                                padding: '0.5rem',
                                borderRadius: '50%',
                                boxShadow: 'var(--shadow-sm)'
                            }}>
                                <Bike size={24} color="var(--primary)" />
                            </div>
                            <div>
                                <h3 style={{ fontWeight: 700, color: 'var(--dark)' }}>Upcoming Delivery</h3>
                                <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
                                    Arriving in ~{Math.ceil(timeLeft / 60)} minutes
                                </p>
                            </div>
                        </div>
                        <ChevronRight size={20} color="var(--gray-500)" />
                    </div>
                )}

                <div className="flex gap-4" style={{ marginBottom: '2rem' }}>
                    <button
                        className="btn btn-primary flex items-center gap-2"
                        onClick={() => navigate('/orders')}
                        style={{ padding: '0.75rem 1.5rem', fontSize: '1.1rem' }}
                    >
                        🛍️ View Your Orders
                    </button>
                </div>

                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Shop by Category</h3>

                <div className="grid" style={{
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '2rem',
                    paddingBottom: '2rem'
                }}>
                    {categories.map((cat) => (
                        <div
                            key={cat.id}
                            className="card"
                            style={{
                                height: 'auto',
                                padding: '1.5rem',
                                boxShadow: 'var(--shadow-lg)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem'
                            }}
                        >
                            <div className="flex items-center gap-3" style={{ borderBottom: '1px solid var(--gray-200)', paddingBottom: '0.5rem' }}>
                                <div style={{
                                    width: '40px', height: '40px',
                                    background: 'var(--gray-100)',
                                    borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1rem',
                                    fontWeight: 'bold'
                                }}>
                                    {cat.name[0]}
                                </div>
                                <h4 style={{ fontWeight: 700, fontSize: '1.2rem' }}>{cat.name}</h4>
                            </div>

                            <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                                {getCategoryItems(cat.id).map(item => (
                                    <div
                                        key={item.id}
                                        onClick={() => navigate(`/product/${item.id}`)}
                                        style={{
                                            cursor: 'pointer',
                                            padding: '0.5rem',
                                            borderRadius: 'var(--radius)',
                                            background: 'var(--gray-100)',
                                            textAlign: 'center'
                                        }}
                                    >
                                        <img src={item.image} style={{ width: '100%', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                                        <p style={{ fontSize: '0.8rem', fontWeight: 600, marginTop: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {item.name}
                                        </p>
                                    </div>
                                ))}
                                {getCategoryItems(cat.id).length === 0 && <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>No items</p>}
                            </div>

                        </div>
                    ))}
                </div>

            </main>
        </div>
    );
}
