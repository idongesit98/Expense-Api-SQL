const jwt = require("jsonwebtoken");


const authenticate = (req,res,next) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log(token);
    
    if(!token) 
        return res.status(401)
        .json({message:"No token provided"})

    try {
         const decoded = jwt.verify(token, 'plasmodiumfalciparumfemaleanophelesmosquito');
         req.userId = decoded.userId;
         next();
    } catch (error) {
        return res.status(403).json({message:'Invalid or expired token',error:error.message})
    }     
}

module.exports = authenticate;

// jwt.verify(token,'plasmodiumfalciparumfemaleanophelesmosquito',(err,decoded) => {
//     if(err) return res.status(403).json({message:'Failed to authenticate token'})
//         req.userId = decoded.userId;
//     next();
// }); 