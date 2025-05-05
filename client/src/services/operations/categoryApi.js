import { category } from "../api"
import { apiConnector } from "../apiConnector";
import {toast} from 'sonner'

const {
    CREATECATEGORY_API,
    DELETECATEGORY_API,
    SHOWALLCATEGORY_API,
    CATEGORYPAGEDETAILS_API
} = category;

export async function createCategory(name , description){
        try{
           const response = await apiConnector("POST",CREATECATEGORY_API,{name,description});
           console.log("CreateCategory API RESPONSE...........", response)
           if(!response.data.success){
              throw new Error("cant create the categoty");
           }
           toast("Category created");
        }catch(error){
            console.log(error.message);
            toast("cant create the categoty");
        }
}

export async function deleteCategory(name){
    try{
        const response = await apiConnector("POST",DELETECATEGORY_API,{name});
        console.log("DELTE_Category API RESPONSE...........", response)
        if(!response.data.success){
           throw new Error("cant delete the categoty");
        }
        toast("Category delete");
     }catch(error){
         console.log(error.message);
         toast("cant delete the categoty");
     }
}
