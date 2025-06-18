import React from 'react';

const Product = () => {
  const products = [
    {
      id: 1,
      name: 'Wireless Mouse',
      description: 'Ergonomic mouse with USB receiver',
      category: 'Electronics',
      price: '₹799',
      stock: 120,
      status: 'In Stock',
      reviewer: 'John Doe',
      image: 'https://via.placeholder.com/60?text=Mouse',
    },
    {
      id: 2,
      name: 'Yoga Mat',
      description: 'Non-slip fitness mat for home workouts',
      category: 'Fitness',
      price: '₹599',
      stock: 80,
      status: 'Low Stock',
      reviewer: 'Jane Smith',
      image: 'https://via.placeholder.com/60?text=Mat',
    },
    {
      id: 3,
      name: 'LED Table Lamp',
      description: 'Dimmable study lamp with USB charging',
      category: 'Home Decor',
      price: '₹1,299',
      stock: 45,
      status: 'In Stock',
      reviewer: 'Assign reviewer',
      image: 'https://via.placeholder.com/60?text=Lamp',
    },
    {
      id: 4,
      name: 'LED Table Lamp1',
      description: 'Dimmable study lamp with USB charging1',
      category: 'Home Decor1',
      price: '₹1,2994',
      stock: 40,
      status: 'In Stock',
      reviewer: 'Assign reviewer',
      image: 'https://via.placeholder.com/60?text=Lamp+1',
    },
  ];

  return (
    <div className="px-6 w-full mt-16 bg-black text-white">
      <h1 className="text-4xl font-semibold mb-8 my-8">Product Inventory</h1>
      <div>Welcome back!</div>
      <div className="w-full max-w-7xl mx-5 bg-[#1c1c1e] border border-[#797878] rounded-2xl shadow-lg overflow-x-auto">
        <table className="min-w-full table-auto text-sm text-left text-white">
          <thead className="bg-black text-gray-400 text-xs uppercase font-semibold tracking-wider">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Image</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Stock</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Reviewer</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#575656]">
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-[#171718] transition-colors"
              >
                <td className="px-6 py-3">{product.name}</td>

                <td className="px-6 py-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                </td>

                <td className="px-6 py-3 max-w-xs truncate text-gray-300">
                  {product.description}
                </td>

                <td className="px-6 py-3">{product.category}</td>
                <td className="px-6 py-3">{product.price}</td>
                <td className="px-6 py-3">{product.stock}</td>

                <td className="px-6 py-3">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                      product.status === 'In Stock'
                        ? 'bg-green-300/10 text-green-400'
                        : 'bg-yellow-300/10 text-yellow-400'
                    }`}
                  >
                    {product.status}
                  </span>
                </td>

                <td className="px-6 py-3">{product.reviewer}</td>

                <td className="px-6 py-3 text-center space-x-2 flex flex-row gap-x-2">
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-4 py-1.5 rounded-xl transition-all">
                    Edit
                  </button>
                  <button className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-1.5 rounded-xl transition-all">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Product;
