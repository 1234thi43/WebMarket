import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchProducts = createAsyncThunk('products/fetchAll', async () => {
	// const res = await fetch('http://localhost:5000/api/products');
	const res = await fetch(`${URL}/api/products`);
	const data = await res.json();
	return data.products;
});

const productSlice = createSlice({
	name: 'products',
	initialState: {
		items: [],
		loading: false,
	},
	reducers: {
		updateProduct(state, action) {
			const updated = action.payload;
			state.items = state.items.map((p) => (p._id === updated._id ? updated : p));
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchProducts.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchProducts.fulfilled, (state, action) => {
				state.items = action.payload;
				state.loading = false;
			})
			.addCase(fetchProducts.rejected, (state) => {
				state.loading = false;
			});
	},
});

export const { updateProduct } = productSlice.actions;
export default productSlice.reducer;
