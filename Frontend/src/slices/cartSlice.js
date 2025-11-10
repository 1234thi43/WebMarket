import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'cart';

const loadCart = () => {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
};

const saveCart = (cart) => {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
	} catch (e) {
		console.error('Ошибка при сохранении корзины:', e);
	}
};

const initialState = {
	items: loadCart(),
};

const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		addToCart: (state, action) => {
			const { product, quantity = 1 } = action.payload;
			const existing = state.items.find((item) => item._id === product._id);
			if (existing) {
				existing.quantity += quantity;
			} else {
				state.items.push({ ...product, quantity });
			}
			saveCart(state.items);
		},
		setQuantity: (state, action) => {
			const { id, quantity } = action.payload;
			state.items = state.items.map((item) =>
				item._id === id
					? { ...item, quantity: Math.max(1, Number(quantity)) }
					: item,
			);
			saveCart(state.items);
		},
		removeFromCart: (state, action) => {
			state.items = state.items.filter((item) => item._id !== action.payload);
			saveCart(state.items);
		},
		clearCart: (state) => {
			state.items = [];
			saveCart([]);
		},
	},
});

export const { addToCart, removeFromCart, setQuantity, clearCart } = cartSlice.actions;

export const selectCart = (state) => state.cart.items;

export default cartSlice.reducer;
