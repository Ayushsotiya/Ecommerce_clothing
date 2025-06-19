import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from "@/components/ui/button";

const PRODUCTS_PER_PAGE = 6;

const Shop = () => {
  const { products } = useSelector((state) => state.product);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentProducts = products.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#131314' }}>
      <div className="text-white py-28 container mx-auto px-4 text-center">
        <p className="text-xl md:text-2xl opacity-90">
          Discover the latest trends in fashion
        </p>  
      </div>

      <div className=" w-[75%] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 px-4 pb-10">
        {currentProducts.map((product, index) => (
          <div
            key={index}
            className="bg-zinc-900 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
          >
            <Link to={`/product/${product._id}`}>
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-60 object-fill bg-white"
              />
              <div className="flex justify-between items-center">
                <div className="p-4 text-white">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-400 mt-2">{product.description}</p>
                  <p className="text-sm text-gray-400 mt-1">₹ {product.price}</p>
                </div>
                <div className="flex flex-col gap-2 p-4">
                  <Button>Buy Now</Button>
                  <Button className="bg-white">Add to cart</Button>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pb-10">
          <Button onClick={()=>setCurrentPage(currentPage-1)} disable={currentPage===1}>Previous Page</Button>
          {Array.from({ length: totalPages }).map((_, idx) => (
            <Button
              key={idx}
              variant="outline"
              className={
                currentPage === idx + 1
                  ? "bg-white text-black border-white hover:bg-gray-200"
                  : "text-white border-white hover:bg-white hover:text-black"
              }
              onClick={() => setCurrentPage(idx + 1)} 
            >
              {idx + 1}
            </Button>
          ))}
          <Button onClick={()=>setCurrentPage(currentPage+1)} disable={currentPage===totalPages}>Next Page</Button>
        </div>
      )}

    </div>
  );
};

export default Shop;
