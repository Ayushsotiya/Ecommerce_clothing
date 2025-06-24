import React, { useEffect,useState } from 'react'
import Order from "../orderComponent";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { apiConnector } from "../../../services/apiConnector";

const OrderHistory = () => {
  const [orderData, setOrderData] = useState([]);
  const {user} = useSelector((state)=>state.profile);
  const { token } = useSelector((state) => state.auth);
  const userId = user._id;
  useEffect(() => {
    const fetchUserOrder = async () => {
      try {
        const res = await apiConnector(
          "POST",
          "http://localhost:4000/api/v1/order/order-userInfo",
          {},
          {
            Authorization: `Bearer ${token}`,
          }
        );
        if (!res.data.success) {
          throw new Error("Can't fetch orders");
        }
        toast.success("Orders fetched successfully");
        setOrderData(res.data.orders);
      } catch (error) {
        console.log(error);
        toast.error("Order could not be fetched");
      }
      toast.dismiss();
    }
    const res = fetchUserOrder();
    setOrderData(res.data);
  } ,[])
  return (
    <div className='flex flex-col gap-y-10 text-white'>
      <Order name={orderData} />
    </div>

  )
}

export default OrderHistory