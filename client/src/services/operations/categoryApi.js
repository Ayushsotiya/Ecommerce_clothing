import { category } from "../api"
import { apiConnector } from "../apiConnector";
import { ToastContainer, toast } from 'react-toastify';
import {setCategory} from "../../slice/categorySlice";

const {
    CREATECATEGORY_API,
    DELETECATEGORY_API,
    SHOWALLCATEGORY_API,
    CATEGORYPAGEDETAILS_API
} = category;

export async function createCategory(name,token){
        try{
           const response = await apiConnector("POST",CREATECATEGORY_API,{name,token},{Authorization:`Bearer ${token}`})
           console.log("CreateCategory API RESPONSE...........", response)
           if(!response.data.success){
              throw new Error("cant create the categoty");
           }
           toast.success("Category created");
        
           return response;
        }catch(error){
            console.log(error.message);
            toast.dismiss("couldddd not Category created");
        }

}
export async function showAllCategory(dispatch){
  
    try{
        const response = await apiConnector("GET",SHOWALLCATEGORY_API);
        if(!response.data.success){
           throw new Error("cant fetch the categoty");
        }
           dispatch(setCategory(response.data.data));
         toast("Category fetched",{theme:"dark",autoClose:1000});
        return response;
    }catch(error){
        console.log(error.message);
       toast("Category cannot fetched",{theme:"dark",autoClose:1000});
    }
}
export async function deleteCategory(name,token){
    try{
        console.log("1")
        const response = await apiConnector("POST","http://localhost:4000/api/v1/category/deletecategory",{name},{ Authorization: `Bearer ${token}` }
);
        console.log("DELTE_Category API RESPONSE...........", response)
        if(!response.data.success){
           throw new Error("cant delete the categoty");
        }
        toast("Category delete",{theme:"dark",autoClose:1000});
        return response;
     }catch(error){
         console.log(error.message);
         toast("cant delete the categoty",{theme:"dark",autoClose:1000});
     }
}
