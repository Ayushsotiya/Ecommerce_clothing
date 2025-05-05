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
    },
  ];

  return (
    <div className="mt-28 px-6  text-white flex flex-col gap-y-10 items-center bg-black  w-fit h-fit  ml-32 border border-specialGrey rounded-lg">
      <h1 className="text-4xl font-semibold text-white mt-11">Product Inventory</h1>

      <div className="w-full max-w-7xl overflow-x-auto rounded-xl shadow-lg border border-[#797878] bg-[#1c1c1e] my-12">
        <table className="min-w-full text-sm text-white">
          <thead className="bg-[#2c2c2e] text-left text-xs font-medium uppercase tracking-wider text-gray-400">
            <tr>
              <th className="py-4 px-4">Name</th>
              <th className="py-4 px-4">Description</th>
              <th className="py-4 px-4">Category</th>
              <th className="py-4 px-4">Price</th>
              <th className="py-4 px-4">Stock</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-4">Reviewer</th>
              <th className="py-4 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#797878]">
            {products.map((product) => (
              < tr
                key={product.id}
                className="hover:bg-[#2e2e30]  bg-black transition-colors"
              >
                <td className="py-3 px-4 whitespace-nowrap">{product.name}</td>
                <td className="py-3 px-4 max-w-xs truncate text-gray-300">{product.description}</td>
                <td className="py-3 px-4">{product.category}</td>
                <td className="py-3 px-4">{product.price}</td>
                <td className="py-3 px-4">{product.stock}</td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      product.status === 'In Stock'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="py-3 px-4">{product.reviewer}</td>
                <td className="py-3 px-4 space-x-2">
                  <button className="bg-white text-black font-semibold px-4 py-1.5 rounded-lg hover:bg-yellow-500 transition">
                    Edit
                  </button>
                  <button className="bg-red-500 text-black font-semibold px-4 py-1.5 rounded-lg hover:bg-red-500 transition">
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
