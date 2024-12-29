import jwt from "jsonwebtoken";
import userModel from "../models/usermodel.js";

const isLoggedIn=async(req,res,next)=>{
        if(!req.cookies.token)
        {
            return res.redirect('/')
        }
        try
        {
            let decode=jwt.verify(req.cookies.token,process.env.JWT_KEY);
            let user=await userModel.findOne({email:decode.email}).select("-password");
            req.user=user;
            next();
        }
        catch(err)
        {
            res.redirect('/');

        }
};
export const isLoggedin=isLoggedIn;
// import jwt from "jsonwebtoken";
// import userModel from "../models/usermodel.js";

// const isLoggedIn = async (req, res, next) => {
    
//     if (!req.cookies.token) {

//         return res.redirect('/');
//     }
    
//     try {
//         const token = req.cookies.token;
//         const decode = jwt.verify(token, process.env.JWT_KEY);
//         const user = await userModel.findOne({ email: decode.email }).select("-password");
//         if (!user) {
//             return res.redirect('/');
//         }
        
//         req.user = user;
//         next();
//     } catch (err) {
//         res.redirect('/');
//     }
// };

// export const isLoggedin = isLoggedIn;
