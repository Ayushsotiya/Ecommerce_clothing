import { analytic } from '../api'
import { toast } from "react-hot-toast"
import { apiConnector } from '../apiConnector';

const {
    GETMONTHLYREVEMUE,
    GETMONTHLYPURCHASE 
} = analytic;



export const getMonthlyRevenue = async(token)=>{
    try{
         const response = await apiConnector("GET",GETMONTHLYREVEMUE,{},{Authorization:`Bearer ${token}`});
         if(!response.data.success){
             throw new Error('could not find the revenue');
         }
         toast.success("revenue fetched");
         
         return response.data.data
    }catch(error){
        console.log(error);
        toast.error('Could not get the monthly revenue');
    }
}

export const getMonthlyPurchase = async(token)=>{
    try{
        const response = await apiConnector("GET",GETMONTHLYPURCHASE ,{},{Authorization:`Bearer ${token}`});
        if(!response.data.success){
            throw new Error("Could not find the purchases data");
        }
        toast.success('total purchases fetched');
        console.log("11",response.data.data)
        return response.data.data;

    }catch(error){
       console.log(error);
        toast.error('Could not get the monthly purchases');
    }
}