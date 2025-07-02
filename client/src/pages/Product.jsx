import React from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../services/operations/paymentApi';

import { useNavigate } from 'react-router-dom';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useSelector((state) => state.product);
  const {token } = useSelector((state)=>state.auth);
  const product = products.find((p) => p._id === id);
  const {user } = useSelector((state)=>state.profile)
  const dispatch = useDispatch();
  const purchase = async () => {
    try {
      const productIds = id;
      await createOrder( [productIds] , token, navigate, user,dispatch);
    } catch (error) {
      console.error("Purchase failed:", error);
    }
  }



  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold" style={{ color: '#FEB714' }}>
        Product not found.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 pt-20" style={{ backgroundColor: '#FAF9F6', minHeight: '100vh' }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image Gallery */}
        <div className="flex flex-col gap-4">
          {product.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`product-${idx}`}
              className="w-full h-[300px] object-cover rounded-xl shadow-sm border"
              style={{ borderColor: '#FEB714', borderWidth: '2px' }}
            />
          ))}
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-4" style={{ color: '#131314' }}>
          <h1 className="text-3xl font-bold capitalize">{product.name}</h1>

          <div className="flex items-center gap-4 text-2xl font-semibold">
            <span style={{ color: '#FEB714' }}>₹{product.price}</span>
          </div>

          <div className="text-md">
            <span className="font-semibold">Stock:</span>{' '}
            {product.stock > 0 ? (
              <span style={{ color: 'green' }}>In Stock</span>
            ) : (
              <span style={{ color: 'red' }}>Out of Stock</span>
            )}
          </div>

          <div className="text-md">
            <span className="font-semibold">Category:</span>{' '}
            {product.category?.name || 'N/A'}
          </div>

          <div className="text-md flex flex-wrap gap-2">
            <span className="font-semibold">Tags:</span>
            {product.tags?.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-1 rounded-md text-sm"
                style={{ backgroundColor: '#797878', color: '#FAF9F6' }}
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              className="px-6 py-2 rounded-xl transition-all"
              style={{ backgroundColor: '#131314', color: '#FAF9F6' }}
            >
              Add to Cart
            </button>
            <button 
             onClick={()=> purchase()}
              className="px-6 py-2 rounded-xl transition-all"
              style={{ backgroundColor: '#FEB714', color: '#131314' }}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="mt-12 p-6 rounded-xl shadow-md" style={{ backgroundColor: '#fff', color: '#131314' }}>
        <h2 className="text-2xl font-semibold mb-2">Product Description</h2>
        <p className="text-md" style={{ color: '#797878' }}>
          {product.description}
        </p>
      </div>
    </div>
  );
}
