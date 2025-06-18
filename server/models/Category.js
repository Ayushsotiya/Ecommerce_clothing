const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type : String,
        required: true,
    },
    product: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        },
    ],
});

module.exports = mongoose.model("Category", categorySchema);