import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, resetCart } from "../../slice/cartSlice";
import { createOrder } from "../../services/operations/paymentApi"
import { useNavigate } from "react-router-dom"

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
                ? cart.map(p => p._id)
                : [cart._id];
            await createOrder(productIds, token, navigate, user, dispatch);
        } catch (error) {
            console.error("Purchase failed:", error);
        }
    }

    if (cart.length === 0) {
        return <div className="p-6 text-center text-xl font-semibold">Your cart is empty.</div>;
    }

    return (
        <div className="p-6 max-w-4xl h-[100vh] mx-auto ">
            <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
            {cart.map((course) => (
                <div key={course._id} className="flex items-center justify-between border-b py-4">
                    <div className="flex items-center gap-4">
                        <img
                            src={course.images[0] || "/placeholder.png"}
                            alt={course.name}
                            className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                            <h3 className="text-lg font-medium">{course.name}</h3>
                            <p className="text-sm text-gray-500">Price: ₹{course.price}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <p className="font-semibold">₹{course.price}</p>
                        <button
                            onClick={() => handleRemove(course._id)}
                            className="text-red-500 hover:underline"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ))}
            <div className="text-right mt-6">
                <p className="text-lg">Total Items: {totalItems}</p>
                <p className="text-xl font-bold">Total: ₹{total}</p>
                <div className="flex justify-end gap-4 mt-4">
                    <button
                        disabled={!token}
                        onClick={handleClearCart}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Clear Cart
                    </button>
                    <button
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        onClick={() => purchase(cart)}
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
}
