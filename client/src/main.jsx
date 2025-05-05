import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router"
import './index.css'
import App from './App.jsx'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from "react-redux";
import  authSlice  from "@/slice/authSlice";
import { Toaster } from "@/components/ui/sonner"
import  profileSlice  from "@/slice/profileSlice";
export const store = configureStore({
  reducer: {
    auth: authSlice,
    profile : profileSlice,
  }
})
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
      <Toaster />
    </BrowserRouter>
  </StrictMode>,
)
