import { setLoading, setCart } from "../../slice/productSlice";
import { apiConnector } from "../apiConnector";

import { cart } from "../api";
import { error } from "console";
const { FETCHCART_API, DELETECART_API, ADDCART_API } = cart;


export const fetchCart = () => {
    return async (dispatch) => {
        try {
            dispatch(setLoading(true));
            const response = await apiConnector("POST", FETCHCART_API);
            console.log("FETCH_CART_REPPONSE", response);
            if (response.data.success == false) {
                throw new error("Failed to fetch cart");
            }
            dispatch(setCart(response.data.cart));
        } catch (error) {
            console.log(error)
        }
        dispatch(setLoading(false));
    }
}



export const deleteCart = (productID) => {
    return async (dispatch) => {
        try {
            dispatch(setLoading(true));
            const response = await apiConnector("POST", DELETECART_API, { productID });
            console.log("DELETE_CART_RESPONSE", response);
            if (!response.data.success) {
                throw new Error("Failed to delete item from cart");
            }
            dispatch(setCart(response.data.cart));
        } catch (error) {
            console.error("Error in deleteCart thunk:", error);
        }
        dispatch(setLoading(false));
    };
};


export const addProduct = (productID) => {
    return async (dispatch) => {
        try {
            dispatch(setLoading(true));
            const response = await apiConnector("POST", ADDCART_API, { productID });
            console.log("ADD_PRODUCT_CART_RESPONSE", response);
            if (!response.data.success) {
                throw new Error("Failed to delete item from cart");
            }
            dispatch(setCart(response.data.cart));
        } catch (error) {
            console.error("Error in deleteCart thunk:", error);
        }
        dispatch(setLoading(false));
    }
}
