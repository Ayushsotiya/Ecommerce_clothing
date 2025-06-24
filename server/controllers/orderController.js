const User  = require("../models/User");
const Order = require("../models/Order");


exports.fetchOrders = async(req,res)=>{
    try{
        const response = await Order.find({})
            .populate('user')
            .populate('items.product')
            .exec();
        if(!response){
            console.log("Cant find the response theek karo");
            return res.status(404).json({
                success:false,
                message:"fix karo kuch response mai nhi arha hai"
            })
        }
        console.log(response);
        return res.status(200).json({
            success:true,
            response,
        })
    }catch(error){
       return res.status(500).json({
        success:false,
        message:"Internal server error"
       })
    }
}


exports.userSpecificOrder = async(req,res)=>{
     try{
        const userId = req.user.id;
        console.log(userId);
        const response = await Order.find({user:userId})
            .populate('items.product')
            .populate('user')
            .exec();
        console.log(response);
        if(!response ){
            console.log("there is no Orders");
            return res.status(402).json({
                success:false,
                message:"Could not found the order",
            })
        }

        return res.status(200).json({
            success:true,
            message:"Orders are fetched",
            orders:response
        })
     }catch(error){
        return res.status(500).json({
            success:false,
            message:"internal server error"
        })
     }
}