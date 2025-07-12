import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    address:localStorage.getItem('address')?JSON.parse(localStorage.getItem('address')):null,
    Loading: false,
}

const profileSlice = createSlice({
    name : "profile",
    initialState: initialState,
    reducers:{
        setAddress(state,action){
            state.address =action.payload,
            localStorage.setItem('address',JSON.stringify(action.payload));
        },
        setUser(state,action){
            state.user = action.payload
            localStorage.setItem ('user',JSON.stringify(action.payload))
        },
        setLoading(state, action) {
            state.Loading = action.payload;
        },
    },
});
export const {setLoading,setUser,setAddress} = profileSlice.actions;
export default profileSlice.reducer;