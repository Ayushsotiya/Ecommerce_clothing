import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, incrementQuantity, decrementQuantity, resetCart } from "../../slice/cartSlice";
import { createOrder } from "../../services/operations/paymentApi";
import { useNavigate, Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function Cart() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cart, total, totalItems, loading } = useSelector((state) => state.cart);
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);

    const handleRemove = (productId) => {
        dispatch(removeFromCart(productId));
    };

    const handleIncrement = (productId) => {
        dispatch(incrementQuantity(productId));
    };

    const handleDecrement = (productId) => {
        dispatch(decrementQuantity(productId));
    };

    const handleClearCart = () => {
        dispatch(resetCart());
    };

    const handleCheckout = async () => {
        if (!token) {
            navigate('/login');
            return;
        }
        
        try {
            // Create array of product IDs (repeat for quantity)
            const productIds = cart.flatMap((item) => 
                Array(item.quantity).fill(item._id)
            );
            await createOrder(productIds, token, navigate, user, dispatch);
        } catch (error) {
            console.error("Checkout failed:", error);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-[#131314] pt-20">
                <div className="max-w-4xl mx-auto px-6 py-16 text-center">
                    <div className="w-24 h-24 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="w-12 h-12 text-zinc-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
                    <p className="text-zinc-400 mb-8">Looks like you haven't added anything to your cart yet.</p>
                    <Link 
                        to="/shop" 
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#FEB714] text-black font-semibold rounded-xl hover:bg-yellow-400 transition"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#131314] pt-20">
            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#FEB714]">Shopping Cart</h1>
                        <p className="text-zinc-400 mt-1">{totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart</p>
                    </div>
                    <Link 
                        to="/shop" 
                        className="flex items-center gap-2 text-zinc-400 hover:text-white transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Continue Shopping
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map((item) => (
                            <div
                                key={item._id}
                                className="flex items-center gap-4 bg-zinc-900 rounded-xl p-4 border border-zinc-800"
                            >
                                {/* Product Image */}
                                <img
                                    src={item.images?.[0] || "/placeholder.png"}
                                    alt={item.name}
                                    className="w-24 h-24 object-cover rounded-lg"
                                />
                                
                                {/* Product Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-semibold text-white truncate">{item.name}</h3>
                                    <p className="text-sm text-zinc-400 mt-1">₹{item.price} per item</p>
                                    
                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-3 mt-3">
                                        <button
                                            onClick={() => handleDecrement(item._id)}
                                            className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-white transition"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="text-white font-medium w-8 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => handleIncrement(item._id)}
                                            className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-white transition"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Price & Remove */}
                                <div className="text-right">
                                    <p className="text-xl font-bold text-[#FEB714]">
                                        ₹{(item.price * item.quantity).toLocaleString()}
                                    </p>
                                    <button
                                        onClick={() => handleRemove(item._id)}
                                        className="mt-2 p-2 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition"
                                        title="Remove item"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 sticky top-24">
                            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
                            
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-zinc-400">
                                    <span>Subtotal ({totalItems} items)</span>
                                    <span>₹{total.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-zinc-400">
                                    <span>Shipping</span>
                                    <span className="text-green-500">Free</span>
                                </div>
                                <div className="border-t border-zinc-700 pt-3">
                                    <div className="flex justify-between text-xl font-bold text-white">
                                        <span>Total</span>
                                        <span className="text-[#FEB714]">₹{total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={loading || !token}
                                className="w-full py-3 px-6 bg-[#FEB714] text-black font-bold rounded-xl hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Processing...' : 'Proceed to Checkout'}
                            </button>

                            {!token && (
                                <p className="text-center text-sm text-zinc-400 mt-3">
                                    <Link to="/login" className="text-[#FEB714] hover:underline">Log in</Link> to checkout
                                </p>
                            )}

                            <button
                                onClick={handleClearCart}
                                className="w-full mt-4 py-2 px-4 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition text-sm"
                            >
                                Clear Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
