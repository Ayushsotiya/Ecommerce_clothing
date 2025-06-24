import { payment } from "../api";
import { apiConnector } from "../apiConnector";
import { toast } from "react-hot-toast";
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



export function createOrder(data, token, navigate, userDetails, products) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

      if (!res) {
        toast.error("RazorPay SDK failed to load");
        return;
      }
      const response = await apiConnector("POST", CREATEORDER_API, data, {
        Authorization: `Bearer ${token}`,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: response.data.data.amount,
        currency: "INR",
        name: "EzyBuyy",
        description: "Pay & Checkout this Course, Upgrade your DSA Skill",
        image: "/assets/images/logo.png",
        order_id: response.data.data.id,
        handler: function (response) {
          verifyPayment({ ...response, products }, token, navigate, dispatch);
        },
        prefill: {
          name: userDetails.firstName,
          email: userDetails.email,
        },
        theme: {
          color: "#2300a3",
        },
      };

      const razorpayObject = new Razorpay(options);
      razorpayObject.open();

      razorpayObject.on("payment.failed", function (response) {
        console.log(response);
        alert("This step of Payment Failed");
      });
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export async function verifyPayment(bodyData, token, navigate, dispatch) {
  const toastId = toast.loading("Verifying Payment...");
  dispatch(setPaymentLoading(true));
  try {
    const response = await apiConnector("POST", VERIFYPAYMENT_API, bodyData, {
      Authorization: `Bearer ${token}`,
    });

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
    dispatch(setPaymentLoading(false));
  }
}
