const jwt=require('jsonwebtoken');
const JWT_SECRET='your_jwt_secret';


const authenticateUser=(req,res,next)=>{

    const token =req.cookies.token|| req.headers.authorization.split(' ')[1];
     console.log(token);
    if(!token){
        return res.status(401).json({
            message:'No token,authorization denied'
        });
    }
 try{
    console.log('JWT_SECRET:',JWT_SECRET);
    const decoded=jwt.verify(token,JWT_SECRET);
    req.user=decoded.user;

    console.log("Decoded user:",req.user);
    next();
 }catch (error){
    console.log(error);
    res.status(401).json({
        message:'Token is not valid'
    });
 }
    
};

module.exports={
    authenticateUser,
}