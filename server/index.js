const express = require('express');
const app = express();
require("dotenv").config();
const cors = require('cors');
const {connectDB} = require('./Config/db');
const {cloudinaryConnect} = require("./Config/cloudanry");
const cookieParser = require('cookie-parser');
const authRoute = require("./routes/authRoutes");
const productRoute = require("./routes/productRoutes")
const categoryRoute = require("./routes/categoryRoutes")
const ratingAndReviewRoute = require("./routes/ratingAndReviewRoute");
const fileUpload = require("express-fileupload");
const paymentRoute = require("./routes/paymentRoutes");
const orderRoute = require('./routes/OrderRoutes');
const PORT = process.env.PORT;


app.use(fileUpload({
    useTempFiles: true, 
    tempFileDir: "/tmp/",
}));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/product', productRoute);
app.use('/api/v1/category',categoryRoute);
app.use('/api/v1/ratingandreview',ratingAndReviewRoute);
app.use('/api/v1/payment',paymentRoute);
app.use('/api/v1/order',orderRoute);
connectDB();
cloudinaryConnect();


app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
