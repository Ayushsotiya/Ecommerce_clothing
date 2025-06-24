import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const OrderComponent = ({ orders }) => {
  return (
    <div className="p-6 mt-10">
      <h1 className="text-3xl font-semibold mb-6 text-white ">All Orders</h1>

      {orders?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {orders.map((order, idx) => (
            <Card
              key={order._id || idx}
              className="bg-white text-black transition-shadow hover:shadow-lg"
            >
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base font-semibold">
                    Order #{order._id}
                  </CardTitle>
                  <span
                    className={`text-xs px-2 py-1 border font-medium rounded-md bg-transparent ${
                      order.status === "Delivered"
                        ? "border-green-600 text-green-600"
                        : order.status === "Pending"
                        ? "border-yellow-500 text-yellow-500"
                        : "border-red-500 text-red-500"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <CardDescription className="text-xs mt-1 text-gray-600">
                  {new Date(order.date).toLocaleDateString()}
                </CardDescription>
              </CardHeader>

              <Separator className="bg-gray-200" />

              <CardContent className="pt-4 space-y-2">
                <h3 className="text-sm font-medium mb-1">Products:</h3>
                <ul className="list-disc list-inside text-sm text-gray-800">
                  {order.products.map((product, i) => (
                    <li key={i}>
                      {product.name} × {product.quantity}
                    </li>
                  ))}
                </ul>

                <div className="text-right font-semibold text-base mt-4">
                  ₹{order.totalAmount}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-gray-400 italic text-center py-10">
          No orders found.
        </div>
      )}
    </div>
  );
};

export default OrderComponent;
