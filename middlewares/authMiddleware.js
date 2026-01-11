import jwt from "jsonwebtoken"
import  dotenv from "dotenv"
import User from "../models/UserModel.js"

// auth 
export const auth = async(req,res,next) => {
    try {
        // extract token
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ","");
        // if token is missing then return response
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is missing",
            });
        }

        // verify token 
        try {
            const deocode =  jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        } catch (error) {
            // verification - issue 
            return res.status(401).json({
                 success:false,
            message:"Token is invalid",
            })
           
        }
        next();

    } catch (error) {
        return res.status(401).json({
            success:false,
            message:'Something went wrong while validateing the token '
        });
    }
}

// isStudent 
export const isStudent = async (req,res,next) => {
    try {
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is a protecte route for student Only "
            })
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Something went wrong try again"
        })
    }
}

// isInstructor 
export const isInstructor = async (req,res,next) => {
    try {
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is a protecte route for Instructor Only "
            })
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Something went wrong try again"
        })
    }
}

// isAdmin 

export const isAdmin = async (req,res,next) => {
    try {
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protecte route for Admin Only "
            })
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Something went wrong try again"
        })
    }
}

