const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const authService = require("../services/auth.service");

const register = asyncHandler(async (req, res) => {
    const user = await authService.register(req.body);

    res.status(201).json(
       
      new ApiResponse(201, user, "User registered successfully")
    
    );
});



const login = asyncHandler(async (req, res) => {
      const result = await authService.login(req.body);

          res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    });

         res.status(200).json(
          new ApiResponse(
              200,
            {
                accessToken: result.accessToken,
                user: result.user
            },
            "Login successful"
        )
    );
});



        const logout = asyncHandler(async (req, res) => {
            await authService.logout(req.user.id);

            res.clearCookie("refreshToken");

            res.status(200).json(
            
              new ApiResponse(200, null, "Logout successful")
            
            );
        });
    const changePassword = asyncHandler(async (req, res) => {
        
      await authService.changePassword(req.user.id, req.body);

        res.status(200).json(
      
          new ApiResponse(200, null, "Password changed successfully")
      
        );
    });


      const refreshToken = asyncHandler(async (req, res) => {
    const token = req.cookies?.refreshToken;

    const result = await authService.refreshToken(token);



    res.status(200).json(
    
      new ApiResponse(200, result, "Token refreshed")
    
    );
});



module.exports = {
    register,
    login,
    refreshToken,
    logout,
    changePassword
};