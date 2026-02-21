import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { Plus, Minus, Trash2 } from 'lucide-react';

export default function CartPage() {
    const { cartItems, updateQuantity, clearCart } = useCart();

    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(0);

    return (
        <div>
            <Navbar />
            <div className="container" style={{ padding: '2rem 1rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>My Cart</h2>

                {cartItems.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <div className="flex flex-col gap-4">
                        {cartItems.map((item) => (
                            <div key={item.id} className="card flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="flex items-center gap-4 w-full">
                                    <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', borderRadius: '4px', objectFit: 'cover' }} />
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: 600 }}>{item.name}</p>
                                        <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>from {item.shop_name}</p>
                                        <p style={{ fontWeight: 'bold', color: 'var(--primary)' }}>₹{item.price}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        className="btn"
                                        style={{ background: 'var(--gray-200)', padding: '0.25rem' }}
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span style={{ fontWeight: 600, minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                                    <button
                                        className="btn"
                                        style={{ background: 'var(--gray-200)', padding: '0.25rem' }}
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>

                                <div style={{ fontWeight: 'bold', fontSize: '1.2rem', minWidth: '80px', textAlign: 'right' }}>
                                    ₹{item.price * item.quantity}
                                </div>
                            </div>
                        ))}

                        <div className="card" style={{ marginTop: '1rem', padding: '1.5rem' }}>
                            <div className="flex justify-between items-center" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                                <span>Total</span>
                                <span>₹{totalPrice}</span>
                            </div>
                            <div className="flex gap-4 mt-4" style={{ marginTop: '1.5rem' }}>
                                <button className="btn btn-primary" style={{ flex: 1, padding: '1rem', fontSize: '1.1rem' }}>
                                    Proceed to Checkout
                                </button>
                                <button
                                    className="btn flex items-center justify-center gap-2"
                                    style={{ flex: 1, padding: '1rem', fontSize: '1.1rem', background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca' }}
                                    onClick={() => {
                                        if (window.confirm("Are you sure you want to clear your cart?")) {
                                            useCart().clearCart();
                                        }
                                    }}
                                >
                                    <Trash2 size={20} /> Clear Cart
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
