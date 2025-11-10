import { createSlice } from '@reduxjs/toolkit';
import { ROLE } from '../constants/role';
const initialState = { user: null, token: null };
const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setUser: (state, action) => {
			state.user = action.payload.user;
			state.token = action.payload.token;
		},
		logout: (state) => {
			state.user = null;
			state.token = null;
			document.cookie = 'token=; path=/; max-age=0';
		},
	},
});
export const selectRole = (state) => state.auth.user?.role ?? ROLE.GUEST;
export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
