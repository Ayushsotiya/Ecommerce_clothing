import { product } from "../api";
import { apiConnector } from "../apiConnector";
import { toast } from "react-hot-toast";
import { setLoading, addProduct, setProduct, deleteproduct } from "../../slice/productSlice";

const {
  CREATEPRODUCT_API,
  GETALLPRODUCT_API,
  UPDATEPRODUCT_API,
  DELETEPROUDCT_API,
} = product;

// Create Product
export function createProduct(formData, token) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", CREATEPRODUCT_API, formData, {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      console.log("CREATE PRODUCT RESPONSE:", response);
      dispatch(addProduct(response.data.product));
      toast.success(" Product created");
    } catch (error) {
      console.error("CREATE PRODUCT ERROR:", error);
      toast.error(" Could not create product");
    }
    dispatch(setLoading(false));
  };
}

// Fetch All Products
export const fetchAllProducts = () => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("GET", GETALLPRODUCT_API);
      console.log("GET_ALL_PRODUCTS RESPONSE:", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      dispatch(setProduct(response.data.data));
      toast.success("Products fetched");
    } catch (error) {
      console.error("GET_ALL_PRODUCTS ERROR:", error);
      toast.error("Could not fetch products");
    }
    dispatch(setLoading(false));
  };
};

// Update Product
export function updateProduct(productId, formData, token) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      // Append productId to formData if needed
      formData.append("productId", productId);

      const response = await apiConnector(
        "PUT",
        UPDATEPRODUCT_API,
        formData, // send FormData directly
        {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // important
        }
      );

      console.log("UPDATE PRODUCT RESPONSE:", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Product updated");
    } catch (error) {
      console.error("UPDATE PRODUCT ERROR:", error);
      toast.error("Could not update product");
    }
    dispatch(setLoading(false));
  };
}


// Delete Product
export function deleteProduct(productId, token) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector(
        "DELETE",
        DELETEPROUDCT_API,
        { productId },
        { Authorization: `Bearer ${token}` }
      );

      console.log("DELETE PRODUCT RESPONSE:", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      dispatch(deleteproduct(productId));
      toast.success("🗑️ Product deleted");
    } catch (error) {
      console.error("DELETE PRODUCT ERROR:", error);
      toast.error(" Could not delete product");
    }
    dispatch(setLoading(false));
  };
}
