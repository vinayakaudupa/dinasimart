import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Package } from 'lucide-react';

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/orders')
            .then(res => res.json())
            .then(data => {
                setOrders(data.data || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch orders:", err);
                setLoading(false);
            });
    }, []);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--gray-50)' }}>
            <Navbar />
            <div className="container" style={{ padding: '2rem 1rem' }}>
                <div className="flex items-center gap-3" style={{ marginBottom: '2rem' }}>
                    <Package size={32} color="var(--primary)" />
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Your Orders</h2>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <p style={{ color: 'var(--gray-500)', fontSize: '1.2rem' }}>Loading your order history...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--gray-500)' }}>
                            No orders found
                        </h3>
                        <p style={{ color: 'var(--gray-500)', marginTop: '0.5rem' }}>Looks like you haven't placed any orders yet.</p>
                        <button className="btn btn-primary" style={{ marginTop: '2rem' }} onClick={() => window.location.href = '/'}>
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {orders.map((order) => {
                            let items = [];
                            try {
                                items = JSON.parse(order.order_data);
                            } catch (e) {
                                console.error("Failed to parse order data:", e);
                            }

                            return (
                                <div key={order.id} className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
                                    <div className="flex justify-between items-start" style={{ borderBottom: '1px solid var(--gray-200)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                                        <div>
                                            <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Order #{order.id}</p>
                                            <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>
                                                Placed on {new Date(order.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--dark)' }}>
                                                ₹{order.total_price}
                                            </p>
                                            <span style={{
                                                display: 'inline-block',
                                                marginTop: '0.25rem',
                                                padding: '0.25rem 0.75rem',
                                                background: '#dcfce7',
                                                color: '#166534',
                                                borderRadius: '1rem',
                                                fontSize: '0.8rem',
                                                fontWeight: 'bold'
                                            }}>
                                                Delivered
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        {items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                                <div className="flex items-center gap-3">
                                                    {item?.image && <img src={item.image} alt={item?.name} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />}
                                                    <div>
                                                        <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item?.name}</p>
                                                        <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>{item?.shop_name}</p>
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: 'right', fontSize: '0.95rem' }}>
                                                    <p>Qty: {item?.quantity || 1}</p>
                                                    <p style={{ fontWeight: 'bold' }}>₹{(item?.price || 0) * (item?.quantity || 1)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                                        <button
                                            className="btn"
                                            style={{ background: 'var(--gray-100)', color: 'var(--dark)', padding: '0.5rem 1rem' }}
                                            onClick={() => window.location.href = '/'}
                                        >
                                            Reorder Items
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
