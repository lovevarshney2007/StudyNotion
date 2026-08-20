import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/UserModel.js";

dotenv.config();

// auth 
export const auth = async (req, res, next) => {
    try {
        // extract token
        const token = req.header("Authorization")?.replace("Bearer ", "") || req.cookies?.token || req.body?.token;
        // if token is missing then return response
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing",
            });
        }

        // verify token 
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Token is invalid: " + error.message,
            });
        }
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Something went wrong while validating the token"
        });
    }
};

// isStudent 
export const isStudent = async (req, res, next) => {
    try {
        const userDetails = await User.findById(req.user.id || req.user._id) || await User.findOne({ email: req.user.email });

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (userDetails.active === false) {
            return res.status(403).json({
                success: false,
                message: "Your account is deactivated. Please contact admin.",
            });
        }

        if (userDetails.accountType !== "Student") {
            return res.status(403).json({
                success: false,
                message: "This is a protected route for Students only"
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong, please try again"
        });
    }
};

// isInstructor 
export const isInstructor = async (req, res, next) => {
    try {
        const userDetails = await User.findById(req.user.id || req.user._id) || await User.findOne({ email: req.user.email });

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (userDetails.active === false) {
            return res.status(403).json({
                success: false,
                message: "Your account is deactivated. Please contact admin.",
            });
        }

        if (userDetails.accountType !== "Instructor") {
            return res.status(403).json({
                success: false,
                message: "This is a protected route for Instructors only"
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong, please try again"
        });
    }
};

// isAdmin 
export const isAdmin = async (req, res, next) => {
    try {
        const userDetails = await User.findById(req.user.id || req.user._id) || await User.findOne({ email: req.user.email });

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (userDetails.active === false) {
            return res.status(403).json({
                success: false,
                message: "Your account is deactivated. Please contact admin.",
            });
        }

        if (userDetails.accountType !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "This is a protected route for Admins only"
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong, please try again"
        });
    }
};

