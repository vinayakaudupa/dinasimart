import { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [totalItems, setTotalItems] = useState(0);

    // Global Order Delivery State
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [deliveryTime, setDeliveryTime] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);

    const setOrderDelivery = (timeInMinutes) => {
        setDeliveryTime(timeInMinutes);
        setTimeLeft(timeInMinutes * 60);
        setOrderPlaced(true);
    };

    const fetchCart = async () => {
        try {
            const res = await fetch('/api/cart');
            const data = await res.json();
            if (data.message === 'success') {
                setCartItems(data.data);
                const count = data.data.reduce((acc, item) => acc + item.quantity, 0);
                setTotalItems(count);
            }
        } catch (err) {
            console.error("Failed to fetch cart", err);
        }
    };

    const addToCart = async (itemId, shopId, price, quantity = 1) => {
        try {
            const res = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemId, shopId, price, quantity })
            });
            const data = await res.json();
            if (data.message) {
                fetchCart();
            }
        } catch (err) {
            console.error("Failed to add to cart", err);
        }
    };

    const updateQuantity = async (id, quantity) => {
        try {
            const res = await fetch('/api/cart/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, quantity })
            });
            const data = await res.json();
            if (data.message) {
                fetchCart();
            }
        } catch (err) {
            console.error("Failed to update cart", err);
        }
    };

    const clearCart = async () => {
        try {
            const res = await fetch('/api/cart/clear', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            if (data.message === 'cleared') {
                setCartItems([]);
                setTotalItems(0);
            }
        } catch (err) {
            console.error("Failed to clear cart", err);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    // Global Timer effect for animation/tracking
    useEffect(() => {
        let timer;
        if (orderPlaced && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 100); // Note: 100ms for fast testing/debug visibility, 1000ms for realistic seconds.
        } else if (orderPlaced && timeLeft <= 0) {
            // Optional: Auto reset when timer hits 0
            // setOrderPlaced(false);
        }
        return () => clearInterval(timer);
    }, [orderPlaced, timeLeft]);

    return (
        <CartContext.Provider value={{
            cartItems, totalItems, addToCart, updateQuantity, clearCart,
            orderPlaced, deliveryTime, timeLeft, setOrderDelivery, setOrderPlaced
        }}>
            {children}
        </CartContext.Provider>
    );
};
