import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    cart: localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [],
    loading :false,
}

const cart = createSlice({
     name:"cart",
     initialState,
     reducers:{
        setCart:(state,action)=>{
           state.cart = action.payload,
           localStorage.setItem('cart',JSON.stringify(action.payLoad));
        },
        resetCart:(state)=>{
            state.cart = [];
            localStorage.setItem('cart',JSON.stringify([]));
        },
        setLoading:(state,action)=>{
            state.loading = action.payload
        }
     }
})


export const{setCart,setLoading,resetCart} = cart.actions;
export default cart.reducer;