import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {createOrder} from "../services/operations/paymentApi"
const PRODUCTS_PER_PAGE = 6;


const addToCart = () => console.log("add to cart");
const Shop = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const { products } = useSelector((state) => state.product);
  const { token } = useSelector((state) => state.auth);
  const {user} = useSelector((state) => state.profile);
  const { categories } = useSelector((state) => state.category);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [imageIndexes, setImageIndexes] = useState({});

  const filteredByCategory = selectedCategory === "All"
    ? products
    : products.filter((p) => p.category?.name === selectedCategory);


  const filteredProducts = filteredByCategory.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handleImageChange = (productId, direction, totalImages) => {
    setImageIndexes((prev) => {
      const currentIndex = prev[productId] || 0;
      const newIndex =
        direction === "next"
          ? (currentIndex + 1) % totalImages
          : (currentIndex - 1 + totalImages) % totalImages;
      return { ...prev, [productId]: newIndex };
    });
  };


  const purchase = async (product,) => {
    try {
      const productIds = Array.isArray(product) 
        ? product.map(p => p._id)
        : [product._id];
      await createOrder( productIds , token, navigate, user,dispatch);
    } catch (error) {
      console.error("Purchase failed:", error);
    }
  }
  return (
    <div className="min-h-screen bg-[#131314]">
      <div className="text-white py-20 text-center">
        <h1 className="text-3xl font-bold mb-2">Discover the Latest Trends in Fashion</h1>
        <p className="text-gray-400">Browse from our curated collection</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-8 px-4">
        <input
          type="text"
          placeholder="Search for products..."
          className="w-full md:w-[300px] px-4 py-2 rounded-md border border-gray-300 outline-none"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />

        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full md:w-[200px] px-4 py-2 rounded-md border border-gray-300 outline-none bg-white text-black"
        >
          <option value="All">All Categories</option>
          {categories?.map((category) => (
            <option key={category._id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Product Grid */}
      <div className="w-[90%] sm:w-[85%] md:w-[80%] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 pb-12">
        {currentProducts.map((product) => {
          const imageIndex = imageIndexes[product._id] || 0;
          const totalImages = product.images?.length || 0;

          return (
            <div
              key={product._id}
              className="bg-zinc-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300"
            >
              <div
                className="cursor-pointer"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <div className="relative flex items-center justify-center h-[400px] bg-zinc-800">
                  <Button
                    size="icon"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white text-black rounded-full shadow"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageChange(product._id, "prev", totalImages);
                    }}
                  >
                    <ChevronLeft />
                  </Button>

                  <img
                    src={product.images?.[imageIndex]}
                    alt={product.name}
                    className="max-h-full max-w-[85%] object-cover"
                  />

                  <Button
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-black rounded-full shadow"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageChange(product._id, "next", totalImages);
                    }}
                  >
                    <ChevronRight />
                  </Button>
                </div>

                <div className="p-4">
                  <h3 className="text-white text-lg font-semibold">{product.name}</h3>
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">{product.description}</p>
                  <p className="text-gray-300 text-sm mt-2 font-medium">₹ {product.price}</p>
                </div>
              </div>

              <div className="flex items-center flex-col gap-2 p-4 pt-0">
                <Button
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    purchase(product);
                  }}
                >
                  Buy Now
                </Button>
                <Button
                  className="w-full bg-white items-center flex text-black hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart();
                  }}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 pb-12">
          <Button
            variant="ghost"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }).map((_, idx) => (
            <Button
              key={idx}
              size="sm"
              variant={currentPage === idx + 1 ? "default" : "outline"}
              className={
                currentPage === idx + 1
                  ? "bg-white text-black"
                  : "border-white text-white hover:bg-white hover:text-black"
              }
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </Button>
          ))}
          <Button
            variant="ghost"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default Shop;
