import { product } from "../api"
import { apiConnector } from "../apiConnector";
import {toast} from 'sonner'
import {setLoading ,setProduct} from '../../slice/productSlice';
const {
    CREATEPRODUCT_API,
    GETALLPRODUCT_API,
    UPDATEPRODUCT_API,
    DELETEPROUDCT_API,
} = product;


export function createProduct(name, description, price, stock, category,tag,images ){
    return async(disptach)=>{
        disptach(setLoading(true));
        try{
            const response = await apiConnector("POST",CREATEPRODUCT_API,{name, description, price, stock, category,tag,images});
            console.log("PRODUCTCREATION API RESPONSE...........", response)
            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            toast('product created');
        }catch(error){
            console.log("SIGNUP API ERROR...", error);
            toast("Could Not Create product");
        }
        disptach(setLoading(true));
    }
}

export function getAllProducts() {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("GET", GETALLPRODUCT_API);
            console.log("GET_ALL_PRODUCTS RESPONSE:", response);

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            dispatch(setProduct(response.data.data));
            toast.success("Fetched all products");
        } catch (error) {
            console.error("GET_ALL_PRODUCTS ERROR:", error);
            toast.error("Could not fetch products");
        }
        dispatch(setLoading(false));
    };
}

export function updateProduct(productId, name, price, description, stock, category, tag) {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("PUT", UPDATEPRODUCT_API, {
                productId,
                name,
                price,
                description,
                stock,
                category,
                tag,
            });

            console.log("UPDATE PRODUCT RESPONSE:", response);

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Product updated successfully");
        } catch (error) {
            console.error("UPDATE PRODUCT ERROR:", error);
            toast.error("Could not update product");
        }
        dispatch(setLoading(false));
    };
}

export function deleteProduct(productId) {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("DELETE", DELETEPROUDCT_API, {
                data: { productId }, // Axios requires `data` for DELETE body
            });

            console.log("DELETE PRODUCT RESPONSE:", response);

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Product deleted successfully");
        } catch (error) {
            console.error("DELETE PRODUCT ERROR:", error);
            toast.error("Could not delete product");
        }
        dispatch(setLoading(false));
    };
}