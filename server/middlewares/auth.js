const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');

exports.auth = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.body.token || req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token Is Missing'
            });
        }
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Token Is Invalid',
            });
        }
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Something Went Wrong While Verifying Token"
        });
    }
}

exports.isUser = async (req, res, next) => {
    try {
        if (req.user.type !== 'User') {
            return res.status(401).json({
                success: false,
                message: 'This Is A Protected Route For Students'
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'User Role Cannot Be Verified, Please Try Again'
        });
    }
}

exports.isAdmin = async (req, res, next) => {
    try {
        if (req.user.type !== 'Admin') {
            return res.status(401).json({
                success: false,
                message: 'This Is A Protected Route For Admin'
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Admin Role Cannot Be Verified, Please Try Again'
        });
    }
}
