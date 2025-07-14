import React, { useEffect, useState } from "react";
import Order from "../orderComponent";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { apiConnector } from "../../../services/apiConnector";

const Orders = () => {
  const { token } = useSelector((state) => state.auth);
  const [orderData, setOrderData] = useState([]); 

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const res = await apiConnector(
          "POST",
          "http://localhost:4000/api/v1/order/order-info",
          {},
          {
            Authorization: `Bearer ${token}`,
          }
        );
        
        if (!res.data.success) {
          throw new Error("Can't fetch orders");
        }
        console.log(res);
        toast.success("Orders fetched successfully");
        setOrderData(res.data.response); 
      } catch (error) {
        console.log(error);
        toast.error("Order could not be fetched");
      }
    };

    fetchOrderDetails();
  }, []);
   console.log("11->>>>",orderData)
  return (
    <div className="min-h-screen bg-black p-6 flex justify-center  mx-auto">
      <Order orders={orderData} userType={"Admin"} /> 
    </div>
  );
};

export default Orders;
