const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const env = require("../config/env");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const auth = asyncHandler(async (req, res, next) => {
    let token;

    
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        
      token = authHeader.split(" ")[1];
    
    }

    if (!token && req.cookies?.accessToken) {
    
      token = req.cookies.accessToken;
   
    }

    if (!token) {
   
      throw new ApiError(401, "Authentication token is required");
   
    }

    let decoded;

    try {
   
      decoded = jwt.verify(token, env.JWT_SECRET);
   
    }
     catch (error) {
        if (error.name === "TokenExpiredError") {
    
    throw new ApiError(401, "Token has expired");
    
        }

        throw new ApiError(401, "Invalid authentication token");
    }

    const userId = decoded.id || decoded.userId;

    if (!userId) {
              throw new ApiError(401, "Invalid token");
    }

        const User = mongoose.models.User || require("../models/User.model");

    const user = await User.findById(userId).select("-password");

    if (!user) {
        throw new ApiError(401, "User not found");
    }

    if (user.isActive === false || user.status === "BLOCKED") {
        
      throw new ApiError(403, "Your account is inactive");
    
    }

    req.user = user;

    next();
});

module.exports = auth;