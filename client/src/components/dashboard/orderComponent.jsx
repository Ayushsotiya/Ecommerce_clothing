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
      <h1 className="text-3xl font-bold mb-8 text-white tracking-tight">
        All Orders
      </h1>

      {orders?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {orders.map((order, idx) => (
            <Card
              key={order._id || idx}
              className="bg-white text-black shadow-lg hover:shadow-xl transition-shadow rounded-2xl border border-gray-100"
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-semibold">
                    Order #{order._id.slice(-6)}
                  </CardTitle>
                  <span
                    className={`text-xs px-3 py-1 border font-semibold rounded-full uppercase tracking-wide ${
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
                <CardDescription className="text-xs mt-2 text-gray-500">
                  Placed on{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </CardDescription>
              </CardHeader>

              <Separator className="bg-gray-200" />

              <CardContent className="pt-4 space-y-4">
                <h3 className="text-sm font-semibold text-gray-700">
                  Products
                </h3>

                <div className="space-y-4">
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex gap-4 items-center border rounded-md p-2 hover:shadow-sm transition"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-20 h-20 object-contain rounded-md border"
                      />
                      <div className="flex flex-col flex-1">
                        <span className="font-medium text-sm text-gray-800">
                          {item.product.name}
                        </span>
                        <span className="text-xs text-gray-600">
                          ₹{item.product.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="bg-gray-100" />

                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm font-medium text-gray-600">
                    Total:
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    ₹{order.totalAmount}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-gray-400 italic text-center py-16 text-lg">
          No orders found.
        </div>
      )}
    </div>
  );
};

export default OrderComponent;
