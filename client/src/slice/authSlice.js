import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    token: localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : null,
    loading: false,
    signUpData: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
            localStorage.setItem('token', JSON.stringify(action.payload)); 
        },
        setSignUpData: (state, action) => {
            state.signUpData = action.payload;
        },
    },
});

export const { setLoading, setToken, setSignUpData } = authSlice.actions;
export default authSlice.reducer;
