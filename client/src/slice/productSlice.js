import{createSlice} from "@reduxjs/toolkit";


const initialState = {
    loading : false,
    product :localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : [null],
}

const productSlice = createSlice({
    name:'product',
    initialState,
    reducers:{
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setProduct : (state,action)=>{
            state.product  = action.payload
            localStorage.setItem('products', JSON.stringify(action.payload));
        }
    }
});

export default productSlice.reducer;
export const{setLoading,setProduct} = productSlice.actions;
