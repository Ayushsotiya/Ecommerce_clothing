import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../services/operations/authApi';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { showAllCategory } from "../../services/operations/categoryApi";
import NavLogo from "../../assets/nav-logo.png"

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const handleLogout = () => {
    dispatch(logout(navigate));
  };

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await showAllCategory(dispatch);
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategories();
  }, [])

  return (
    <div className='flex justify-between items-center py-3 px-6 bg-black text-white border-b border-white/10 fixed w-full z-10'>
      {/* Logo */}
      <Link to="/" className='flex items-center'>
        <img src={NavLogo} alt="Brand logo" className='h-8' />
      </Link>

      {/* Navigation Links */}
      <div className='hidden md:flex'>
        <ul className='flex gap-6'>
          <li>
            <Link to="/" className='text-sm font-medium hover:text-white/80 transition-colors'>Home</Link>
          </li>

          <li className="relative group">
            <Link
              to="/shop"
              className="text-sm font-medium hover:text-white/80 transition-colors"
            >
              Shop
            </Link>
            {/* Dropdown */}
            {categories.length > 0 && (
              <ul className="absolute top-full left-0 mt-2 w-48 bg-black border border-white/10 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20">
                {categories.map((cat) => (
                  <li key={cat._id}>
                    <Link
                      to={`/shop?category=${cat.name}`}
                      className="block px-4 py-2 text-sm text-white hover:bg-white hover:text-black transition-colors"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li>
            <Link to="/about" className='text-sm font-medium hover:text-white/80 transition-colors'>About</Link>
          </li>

          <li>
            <Link to="/contact" className='text-sm font-medium hover:text-white/80 transition-colors'>Contact</Link>
          </li>
        </ul>
      </div>

      {/* User Actions */}
      <div className='flex items-center gap-4'>
        {user ? (
          <>
            <Link to="/cart" className="p-2 hover:bg-white/10 rounded-full transition-colors relative">
              {totalItems > 0 && (
                <div className="absolute -top-1 -right-1 flex items-center justify-center bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full">
                  {totalItems}
                </div>
              )}
              <ShoppingCart size={18} />
            </Link>

            <div className="relative group">
              <button className="focus:outline-none">
                {user.image ? (
                  <Link to={user.type === 'Admin' ? ("/dashboard/admin/profile") : ("/dashboard/profile")}>
                    <img
                      src={user.image}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border border-white/20"
                    />
                  </Link>

                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <User size={16} />
                  </div>
                )}
              </button>

              <div className="absolute right-0 mt-2  w-40 bg-black border border-specialGrey rounded-md shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link
                  to={user.type === 'Admin' ? ("dashboard/admin/profile") : ("dashboard/profile")}
                  className="px-4 py-2 text-sm group hover:bg-white hover:text-black  hover:rounded-lg transition-all duration-200 flex items-center gap-2"
                >
                  <User size={14} className="group-hover:text-black" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm group hover:bg-white hover:rounded-lg hover:text-black transition-all duration-200 flex items-center gap-2"
                >
                  <LogOut size={14} className="group-hover:text-black" />
                  Logout
                </button>
              </div>

            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium hover:text-white/80 transition-colors flex items-center gap-1"
            >
              <User size={16} className="mr-1" />
              Login
            </Link>
            <span className="text-white/30">|</span>
            <Link
              to="/signup"
              className="text-sm font-medium bg-white text-black px-3 py-1.5 rounded hover:bg-white/90 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;