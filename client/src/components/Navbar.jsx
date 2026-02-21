import { useState, useEffect } from 'react';
import { Search, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import SearchBar from './SearchBar';

export default function Navbar() {
    const { totalItems, cartItems } = useCart();
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0).toFixed(0);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        setIsAuthenticated(localStorage.getItem('isAuthenticated') === 'true');
    }, []);

    return (
        <nav className="card" style={{
            position: 'sticky', top: 0, zIndex: 100, borderRadius: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0.75rem 2rem', borderBottom: '1px solid var(--gray-200)'
        }}>
            <div className="flex items-center gap-4" style={{ flex: 1 }}>
                <h1 style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => window.location.href = '/'}>
                    DinasiMart
                </h1>
                <div style={{ flex: 1, maxWidth: '600px', marginLeft: '2rem' }}>
                    <SearchBar />
                </div>
            </div>

            <div className="flex items-center gap-4">
                {isAuthenticated ? (
                    <button className="btn" style={{ fontWeight: 500 }} onClick={() => {
                        localStorage.removeItem('isAuthenticated');
                        window.location.reload();
                    }}>Logout</button>
                ) : (
                    <button className="btn" style={{ fontWeight: 500 }} onClick={() => window.location.href = '/login'}>Login</button>
                )}
                <button
                    className="btn btn-primary flex items-center gap-2"
                    style={{ padding: '0.5rem 1rem' }}
                    onClick={() => window.location.href = '/cart'}
                >
                    <ShoppingCart size={20} />
                    <div className="flex flex-col items-start" style={{ lineHeight: 1 }}>
                        <span style={{ fontSize: '0.8rem' }}>{totalItems} items</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>₹{totalPrice}</span>
                    </div>
                </button>
            </div>
        </nav>
    );
}
