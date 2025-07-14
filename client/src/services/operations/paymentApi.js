import { payment } from "../api";
import { apiConnector } from "../apiConnector";
import { toast } from "react-hot-toast";
import logo from "../../assets/footer-logo.png"
import {setLoading,resetCart} from "../../slice/cartSlice"
const { CREATEORDER_API, VERIFYPAYMENT_API } = payment;

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;

    script.onload = () => {
      resolve(true);
    }
    script.onerror = () => {
      resolve(false);
    }
    document.body.appendChild(script);
  })
}



export async function createOrder (productIds, token, navigate, userDetails,dispatch) {
    try {
      const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!res) {
        toast.error("RazorPay SDK failed to load");
        return;
      }
      console.log("0")
      const response = await apiConnector("POST", CREATEORDER_API, {products:productIds}, {
        Authorization: `Bearer ${token}`,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      console.log("1");
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: response.data.data.amount,
        currency: "INR",
        name: "EzyBuyy",
        description: "Pay ",
        image: logo,
        order_id: response.data.data.id,
        handler: function (response) {
          verifyPayment({ ...response, products: productIds }, token, navigate,dispatch);
        },
        prefill: {
          name: userDetails.firstName,
          email: userDetails.email,
        },
        theme: {
          color: "#000000",
        },
      };
      console.log("2");
      const razorpayObject = new window.Razorpay(options);
      razorpayObject.open();
      console.log("3");
      razorpayObject.on("payment.failed", function (response) {
        console.log(response);
        alert("This step of Payment Failed");
      });
    } catch (error) {
      console.log(error);
    } 
  };

async function verifyPayment(bodyData, token, navigate, dispatch) {
  const toastId = toast.loading("Verifying Payment...");
  console.log("2222222222222222222")
  dispatch(setLoading(true));
  console.log("!!!!!!!!!!!!!!!!!")
  try {
    console.log("verification called");
    const response = await apiConnector("POST", VERIFYPAYMENT_API, bodyData, {
      Authorization: `Bearer ${token}`,
    });
    console.log("verification received");
    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Payment successful, you have purchased the product");
    navigate("/dashboard/orders-history");
    dispatch(resetCart());
  } catch (error) {
    console.log("PAYMENT VERIFY ERROR:", error);
    toast.error("Could not verify payment");
  } finally {
    toast.dismiss(toastId);
    dispatch(setLoading(false));
  }
}
