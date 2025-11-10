import { useState, useEffect } from 'react';

const STORAGE_KEY = 'cart';

export function useCart() {
	const [cart, setCart] = useState(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			return raw ? JSON.parse(raw) : [];
		} catch {
			return [];
		}
	});

	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
		} catch (e) {
			throw new Error(e);
		}
	}, [cart]);

	const totalCount = cart.reduce((s, it) => s + (it.quantity || 0), 0);

	const addToCart = (product) => {
		setCart((prev) => {
			const idx = prev.findIndex((p) => p._id === product._id);
			if (idx !== -1) {
				const copy = [...prev];
				copy[idx] = { ...copy[idx], quantity: (copy[idx].quantity || 1) + 1 };
				return copy;
			}
			return [...prev, { ...product, quantity: 1 }];
		});
	};

	const removeFromCart = (id) => {
		setCart((prev) => prev.filter((p) => p._id !== id));
	};

	const setQuantity = (id, q) => {
		setCart((prev) =>
			prev.map((p) => (p._id === id ? { ...p, quantity: Math.max(1, q) } : p)),
		);
	};

	const clearCart = () => setCart([]);

	return { cart, addToCart, removeFromCart, setQuantity, clearCart, totalCount };
}
