import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, resetCart } from "../../slice/cartSlice";
import { createOrder } from "../../services/operations/paymentApi";
import { useNavigate } from "react-router-dom";
import { Trash2 } from 'lucide-react';
export default function AddToCart() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cart, total, totalItems } = useSelector((state) => state.cart);
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);

    const handleRemove = (courseId) => {
        dispatch(removeFromCart(courseId));
    };

    const handleClearCart = () => {
        dispatch(resetCart());
    };

    const purchase = async (cart) => {
        try {
            const productIds = Array.isArray(cart)
                ? cart.map((p) => p._id)
                : [cart._id];
            await createOrder(productIds, token, navigate, user, dispatch);
        } catch (error) {
            console.error("Purchase failed:", error);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="p-6 text-center text-xl font-semibold text-white bg-[#131314] h-screen">
                Your cart is empty.
            </div>
        );
    }

    return (
        <div className="bg-royalBlack w-full">
            <div className="p-6 max-w-5xl mx-auto min-h-screen bg-[#131314] text-white">
                <h2 className="text-3xl font-bold mb-8 text-[#FEB714]">Your Cart</h2>
                <div className="space-y-6">
                    {cart.map((course) => (
                        <div
                            key={course._id}
                            className="flex items-center justify-between border-b border-gray-700 pb-4"
                        >
                            <div className="flex items-center gap-5">
                                <img
                                    src={course.images[0] || "/placeholder.png"}
                                    alt={course.name}
                                    className="w-20 h-20 object-cover rounded shadow-md"
                                />
                                <div>
                                    <h3 className="text-lg font-semibold">{course.name}</h3>
                                    <p className="text-sm text-gray-400">Price: ₹{course.price}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <p className="font-bold text-lg text-white">₹{course.price}</p>
                                <button
                                    onClick={() => handleRemove(course._id)}
                                    className="text-red-400 hover:text-red-500 transition"
                                >
                                    <Trash2 />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 text-right space-y-2">
                    <p className="text-lg">Total Items: <span className="font-medium text-[#FEB714]">{totalItems}</span></p>
                    <p className="text-2xl font-bold">Total: <span className="text-white">₹{total}</span></p>

                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            disabled={!token}
                            onClick={handleClearCart}
                            className="px-5 py-2 rounded bg-red-400 hover:bg-red-500 transition text-white disabled:opacity-50"
                        >
                            Clear Cart
                        </button>
                        <button
                            onClick={() => purchase(cart)}
                            className="px-5 py-2 rounded bg-primary text-black font-semibold hover:bg-yellow-400 transition"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>

    );
}
