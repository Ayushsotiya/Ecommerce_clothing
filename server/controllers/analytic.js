const Order = require("../models/Order");
const User = require("../models/User");

const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

// =======================
// 📈 Monthly Revenue
// =======================
exports.monthlyRevenue = async (req, res) => {
    try {
        const revenue = await Order.aggregate([
            {
                $match: {
                    createdAt: { $exists: true, $ne: null }
                }
            },
            {
                $group: {
                    _id: { month: { $month: "$createdAt" } },
                    totalRevenue: { $sum: "$totalAmount" },
                },
            },
        ]);

        const revenueData = monthNames.map((name, index) => {
            const found = revenue.find(
                r => r._id.month === index + 1
            );

            return {
                month: name,
                revenue: found ? found.totalRevenue : 0,
            };
        });

        return res.status(200).json({
            success: true,
            message: "Monthly revenue fetched successfully",
            data: revenueData,
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch monthly revenue",
        });
    }
};

// =======================
// 📦 Monthly Purchases
// =======================
exports.monthlyPurchase = async (req, res) => {
    try {
        const orders = await Order.aggregate([
            {
                $match: {
                    createdAt: { $exists: true, $ne: null }
                }
            },
            {
                $group: {
                    _id: { month: { $month: "$createdAt" } },
                    totalOrders: { $sum: 1 },
                },
            },
        ]);

        const purchasesData = monthNames.map((name, index) => {
            const found = orders.find(
                o => o._id.month === index + 1
            );

            return {
                month: name,
                purchases: found ? found.totalOrders : 0,
            };
        });

        return res.status(200).json({
            success: true,
            message: "Monthly purchases fetched successfully",
            data: purchasesData,
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch monthly purchases",
        });
    }
};

// =======================
// 👥 Total Customers
// =======================
exports.totalCustomers = async (req, res) => {
    try {
        const total = await User.countDocuments({ type: "User" });

        return res.status(200).json({
            success: true,
            message: "Total customers fetched successfully",
            data: { total },
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch total customers",
        });
    }
};