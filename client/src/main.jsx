
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom" 
import './index.css'
import App from './App.jsx'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from "react-redux"
import { Toaster } from "react-hot-toast" 

import authSlice from "@/slice/authSlice"
import profileSlice from "@/slice/profileSlice"
import productSlice from "@/slice/productSlice"
import categorySlice from "@/slice/categorySlice"

export const store = configureStore({
  reducer: {
    auth: authSlice,
    profile: profileSlice,
    product: productSlice,
    category:categorySlice,
  }
})

createRoot(document.getElementById('root')).render(

    <BrowserRouter>
      <Provider store={store}>
        <App />
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            style: {
              background: "#1a1a1a",
              color: "#fff",
              border: "1px solid #333",
            },
          }}
        />
      </Provider>
    </BrowserRouter>
)
