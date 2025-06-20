import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: localStorage.getItem('categories')
    ? JSON.parse(localStorage.getItem('categories'))
    : []
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.categories = action.payload;
      localStorage.setItem("categories", JSON.stringify(action.payload));
    },
  },
});

export const { setCategory } = categorySlice.actions;
export default categorySlice.reducer;
