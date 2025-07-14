import React, { useEffect, useState } from "react";
import { apiConnector } from "../../services/apiConnector";

const OrderComponent = ({ orders, userType }) => {
  const [statusMap, setStatusMap] = useState({});

  const updateOrderStatus = async (status, orderId) => {
    try {
      const response = await apiConnector("POST", "http://localhost:4000/api/v1/order/update", { status, orderId });
      if (!response) {
        throw new Error("FAILED TO UPDATE THE ORDER FIX IT ");
      }
      console.log("RESPONSE OF ORDER_UPDATE IS ->>>", response);
    } catch (error) {
      console.log("FAILED TO UPDATE THE ORDER");
    }
  };

  return (
    <div className="p-6 mt-10 overflow-x-auto">
      <h1 className="text-3xl font-bold mb-8 text-white tracking-tight">
        All Orders
      </h1>

      <div className="min-w-[1000px]">
        {/* Table Headers */}
        <div className="grid grid-cols-8 gap-6 bg-zinc-800 text-white px-6 py-3 rounded-t-md font-semibold text-sm uppercase">
          <div>Order ID</div>
          <div>Product</div>
          <div>Description</div>
          <div>Image</div>
          <div>User Name</div>
          <div>Address</div>
          <div>Amount</div>
          <div>Status</div>
        </div>

        {/* Orders */}
        {orders.map((order, index) => {
          const user = order.user;
          const address = user?.address;

          return (
            <div
              key={order._id || index}
              className={`grid grid-cols-8 gap-6 px-6 py-4 items-center ${index % 2 === 0 ? "bg-zinc-900" : "bg-zinc-950"
                } text-white hover:bg-zinc-800 transition-colors duration-200`}
            >
              <div className="truncate">{order._id}</div>

              {/* First Product */}
              <div className="truncate">{order.items[0]?.product?.name || "N/A"}</div>
              <div className="truncate">{order.items[0]?.product?.description || "N/A"}</div>

              {/* Product Image */}
              <div>
                <img
                  src={order.items[0]?.product?.images?.[0]}
                  alt="product"
                  className="w-14 h-14 object-cover rounded-md border border-white/10"
                />
              </div>

              {/* User Name */}
              <div className="font-medium text-green-400">{user?.Name || "N/A"}</div>

              {/* Address */}
              <div className="text-sm text-zinc-300 leading-snug">
                {address
                  ? <>
                      <div>{user.address.houseNo}, {user.address.street}</div>
                      <div>{user.address.address}</div>
                      <div>{user.address.city}, {user.address.state} - {user.address.postalCode}</div>
                    </>
                  : "N/A"}
              </div>  

              {/* Amount */}
              <div className="font-medium">₹{order.totalAmount}</div>

              {/* Status */}
              {userType === "Admin" ? (
                <div className="flex gap-2">
                  <select
                    value={statusMap[order._id] || order.status}
                    onChange={(e) =>
                      setStatusMap((prev) => ({
                        ...prev,
                        [order._id]: e.target.value,
                      }))
                    }
                    className="bg-black text-white rounded-md px-2 py-1"
                  >
                    <option>Delivered</option>
                    <option>Shipped</option>
                    <option>Cancelled</option>
                    <option>Pending</option>
                  </select>
                  <button
                    onClick={() => updateOrderStatus(statusMap[order._id] || order.status, order._id)}
                    className="bg-primary rounded-md p-1 text-black"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div
                  className={`py-1 w-fit px-4 rounded-full text-sm text-center font-medium ${order.status === "Delivered"
                    ? "bg-green-700 text-green-100"
                    : order.status === "Pending"
                      ? "bg-yellow-600 text-yellow-100"
                      : "bg-red-600 text-red-100"
                    }`}
                >
                  {order.status}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderComponent;


// {orders?.length > 0 ? (
//   <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
//     {orders.map((order, idx) => (
//       <Card
//         key={order._id || idx}
//         className="bg-white text-black shadow-lg hover:shadow-xl transition-shadow rounded-2xl border border-gray-100"
//       >
//         <CardHeader className="pb-2">
//           <div className="flex justify-between items-center">
//             <CardTitle className="text-lg font-semibold">
//               Order #{order._id.slice(-6)}
//             </CardTitle>
//             <span
//               className={`text-xs px-3 py-1 border font-semibold rounded-full uppercase tracking-wide ${
//                 order.status === "Delivered"
//                   ? "border-green-600 text-green-600"
//                   : order.status === "Pending"
//                   ? "border-yellow-500 text-yellow-500"
//                   : "border-red-500 text-red-500"
//               }`}
//             >
//               {order.status}
//             </span>
//           </div>
//           <CardDescription className="text-xs mt-2 text-gray-500">
//             Placed on{" "}
//             {new Date(order.createdAt).toLocaleDateString("en-IN", {
//               day: "2-digit",
//               month: "2-digit",
//               year: "numeric",
//             })}
//           </CardDescription>
//         </CardHeader>

//         <Separator className="bg-gray-200" />

//         <CardContent className="pt-4 space-y-4">
//           <h3 className="text-sm font-semibold text-gray-700">
//             Products
//           </h3>

//           <div className="space-y-4">
//             {order.items.map((item, i) => (
//               <div
//                 key={i}
//                 className="flex gap-4 items-center border rounded-md p-2 hover:shadow-sm transition"
//               >
//                 <img
//                   src={item.product.images[0]}
//                   alt={item.product.name}
//                   className="w-20 h-20 object-contain rounded-md border"
//                 />
//                 <div className="flex flex-col flex-1">
//                   <span className="font-medium text-sm text-gray-800">
//                     {item.product.name}
//                   </span>
//                   <span className="text-xs text-gray-600">
//                     ₹{item.product.price}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <Separator className="bg-gray-100" />

//           <div className="flex justify-between items-center pt-2">
//             <span className="text-sm font-medium text-gray-600">
//               Total:
//             </span>
//             <span className="text-lg font-bold text-gray-900">
//               ₹{order.totalAmount}
//             </span>
//           </div>
//         </CardContent>
//       </Card>
//     ))}
//   </div>
// ) : (
//   <div className="text-gray-400 italic text-center py-16 text-lg">
//     No orders found.
//   </div>
// )}