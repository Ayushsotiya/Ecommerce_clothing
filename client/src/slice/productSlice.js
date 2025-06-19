import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  products: localStorage.getItem("products")
    ? JSON.parse(localStorage.getItem("products"))
    : [],
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setProduct: (state, action) => {
      state.products = action.payload;
      localStorage.setItem("products", JSON.stringify(action.payload));
    },
    addProduct: (state, action) => {
      state.products.push(action.payload);
      localStorage.setItem("products", JSON.stringify(state.products));
    },
    deleteproduct: (state, action) => {
      state.products = state.products.filter(
        (product) => product._id !== action.payload
      );
      localStorage.setItem("products", JSON.stringify(state.products));
    },
  },
});

export default productSlice.reducer;
export const { setLoading, setProduct,addProduct,deleteproduct } = productSlice.actions;
