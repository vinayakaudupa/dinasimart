import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { MapPin, Plus, Minus } from 'lucide-react';

export default function ProductPage() {
    const { id } = useParams();
    const [itemDetails, setItemDetails] = useState(null);
    const [shops, setShops] = useState([]);
    const [related, setRelated] = useState([]);
    const { cartItems, addToCart, updateQuantity } = useCart();

    useEffect(() => {
        // Fetch item details
        fetch(`/api/items/${id}`)
            .then(res => res.json())
            .then(data => setItemDetails(data.data));

        // Fetch shops for this item
        fetch(`/api/items/${id}/shops`)
            .then(res => res.json())
            .then(data => {
                setShops(data.data);
            });

        // Fetch related items
        fetch(`/api/items/${id}/related`)
            .then(res => res.json())
            .then(data => setRelated(data.data));

    }, [id]);

    const itemInfo = itemDetails || { name: "Loading...", image: "" };

    // Calculate total quantity of this specific item in the cart across all shops
    const totalItemQuantity = (cartItems || [])
        .filter(c => c?.item_id === parseInt(id))
        .reduce((sum, c) => sum + (c?.quantity || 0), 0);

    return (
        <div>
            <Navbar />
            <div className="container" style={{ padding: '2rem 1rem' }}>

                {/* Header with Search Result Name */}
                <div className="flex items-center gap-4" style={{ marginBottom: '2rem', minHeight: '80px', flexWrap: 'wrap' }}>
                    {itemInfo.image && <img src={itemInfo.image} style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' }} />}
                    <div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
                            Results for {itemInfo.name}
                        </h2>
                        {totalItemQuantity > 0 && (
                            <span style={{
                                display: 'inline-block',
                                marginTop: '0.5rem',
                                padding: '0.25rem 0.75rem',
                                background: 'var(--primary)',
                                color: 'white',
                                borderRadius: '1rem',
                                fontSize: '0.9rem',
                                fontWeight: 'bold'
                            }}>
                                {totalItemQuantity} in cart
                            </span>
                        )}
                    </div>
                </div>

                <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                    {shops.map((shop) => {
                        const cartItem = (cartItems || []).find(c => c?.item_id === parseInt(id) && c?.shop_id === shop?.id);

                        return (
                            <div key={shop.id} className="card" style={{ opacity: shop.stock > 0 ? 1 : 0.6 }}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{shop.name}</h3>
                                        <div className="flex items-center gap-1" style={{ color: 'var(--gray-500)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                                            <MapPin size={16} /> {shop.distance} km
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--dark)' }}>₹{shop.price}</p>
                                        <p style={{ color: shop.stock > 0 ? 'var(--primary)' : 'var(--gray-500)', fontSize: '0.8rem', fontWeight: 600 }}>
                                            {shop.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                        </p>
                                    </div>
                                </div>

                                {cartItem ? (
                                    <div className="flex items-center justify-between" style={{ width: '100%', marginTop: '1rem', background: 'var(--gray-200)', borderRadius: 'var(--radius)', padding: '0.25rem' }}>
                                        <button
                                            className="btn"
                                            style={{ background: 'var(--white)', padding: '0.25rem 0.5rem', flex: 1 }}
                                            onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}
                                        >
                                            <Minus size={18} />
                                        </button>
                                        <span style={{ fontWeight: 'bold', fontSize: '1.1rem', flex: 1, textAlign: 'center' }}>
                                            {cartItem.quantity}
                                        </span>
                                        <button
                                            className="btn"
                                            style={{ background: 'var(--white)', padding: '0.25rem 0.5rem', flex: 1 }}
                                            onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => addToCart(parseInt(id), shop.id, shop.price)}
                                        className={`btn flex items-center justify-center gap-2 ${shop.stock > 0 ? 'btn-primary' : ''}`}
                                        style={{ width: '100%', marginTop: '1rem', background: shop.stock > 0 ? '' : 'var(--gray-300)', cursor: shop.stock > 0 ? 'pointer' : 'not-allowed' }}
                                        disabled={shop.stock <= 0}
                                    >
                                        <Plus size={18} /> {shop.stock > 0 ? 'Add' : 'Unavailable'}
                                    </button>
                                )}
                            </div>
                        )
                    })}

                    {shops.length === 0 && <p>No shops currently satisfy this item.</p>}
                </div>

                {related.length > 0 && (
                    <div style={{ marginTop: '3rem' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>You might also like</h3>
                        <div className="flex gap-4" style={{ overflowX: 'auto', paddingBottom: '1rem' }}>
                            {related.map(rel => (
                                <div key={rel.id} className="card" style={{ minWidth: '200px' }}>
                                    <img src={rel.image} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: 'var(--radius)' }} />
                                    <p style={{ fontWeight: 600, marginTop: '0.5rem' }}>{rel.name}</p>
                                    <button
                                        onClick={() => window.location.href = `/product/${rel.id}`}
                                        className="btn"
                                        style={{ marginTop: '0.5rem', width: '100%', background: 'var(--gray-100)' }}
                                    >
                                        View
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
