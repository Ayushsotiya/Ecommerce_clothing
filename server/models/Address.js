const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    houseNo: {
        type: String,
        trim: true,
    },
    street:{
        type:String,
        trim:true,
    },
    Address:{
        type:String,
        trim:true,
    },
    city: {
        type: String,
        trim: true,
    },
    state: {
        type: String,
        trim: true,
    },
    postalCode: {
        type: String,
        trim: true,
    },
    country: {
        type: String,
        trim: true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
});

module.exports = mongoose.model("Address", addressSchema);
