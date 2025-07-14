
import { Routes, Route } from "react-router";
import { useEffect } from 'react';
import Home from './pages/Home'
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Shop from "./pages/Shop";
import NavBar from './components/common/NavBar';
import Otp from "./pages/Otp";
import NotFound from './pages/NotFound';
import DashBoard from './pages/DashBoard';
import OpenRoute from "./components/auth/OpenRoute"
import PrivateRoute from "./components/auth/PrivateRoute"
import Profile from './components/dashboard/profile';
import Footer from "@/components/common/Footer"
import Analysis from './components/dashboard/admin/Analysis';
import Orders from "./components/dashboard/admin/Orders"
import OrderHistory from "./components/dashboard/user/OrderHistory"
import Products from "./components/dashboard/admin/Products"
import Category from "./components/dashboard/admin/Category"
import Address from './components/dashboard/user/Address';
import { useSelector } from 'react-redux';
import ResetPassword from "./pages/ResetPasssword"
import AddProduct from "./components/dashboard/admin/productUpload/createProduct"
import { useLocation } from "react-router-dom";
import { fetchAllProducts } from "./services/operations/productApi";
import { useDispatch } from "react-redux";
import ProductDetails from "./pages/Product";
import AddToCart from "./components/common/AddToCart"
function App() {
  const { user } = useSelector((state) => state.profile)
  const dispatch = useDispatch();
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith("/dashboard");
    useEffect(() => {
      dispatch(fetchAllProducts())
    }, [])
  return (
    <>
      {!isDashboardRoute && <NavBar className="fixed" />}
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/contact" element={<Contact />}></Route>
        <Route path="/shop" element={<Shop/>}></Route>
        <Route path="/login" element={<OpenRoute><Login /></OpenRoute>}></Route>
        <Route path="/signup" element={<OpenRoute><Signup /></OpenRoute>}></Route>
        <Route path="/verify-email" element={< OpenRoute> <Otp /></OpenRoute>}></Route>
        <Route path="/reset-password" element={<OpenRoute><ResetPassword /></OpenRoute>}></Route>
        <Route path= '/product/:id' element = {<ProductDetails/>}></Route>
        <Route path="/cart" element={<PrivateRoute><AddToCart/></PrivateRoute>}></Route>
        <Route path="/dashboard" element={<PrivateRoute><DashBoard /></PrivateRoute>}>
          {user?.type === 'Admin' ? (
            <>
              <Route path="admin/profile" element={<Profile />}></Route>
              <Route path="admin/analytics" element={<Analysis />}></Route>
              <Route path="admin/orders" element={<Orders />}></Route>
              <Route path="admin/products" element={<Products />}></Route>
              <Route path="admin/category" element={<Category />}></Route>
              <Route path='admin/add-product' element={<AddProduct />}></Route>
            </>
          ) :
            (<>
              <Route path="profile" element={<Profile />}></Route>
              <Route path="address" element={<Address />}></Route>
              <Route path="orders-history" element={<OrderHistory />}></Route>
            </>
            )
          }
        </Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
      {!isDashboardRoute && <Footer />}
    </>
  )
}

export default App
