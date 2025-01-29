const jwt = require("jsonwebtoken");
const Employee = require("../models/user");




const isAuthenticated = async(req, res, next) => {

     try {

    // check if theres request header
    if(!req.headers.authorization && !req.headers.authorization.startsWith('Bearer ')) 
        return res.status(401).json({message: 'Authorization required'});

    
    // get token from cookie 
    let token = req.headers.authorization.split(" ")[1];

    if(!token)
        return res.status(401).json({message: 'Not authorized'});

        // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {

        if(err) {
            res.status(401).send({
                status : false,
                message : "Unauthorize Access " 
           });
        }

        req.employee = decodedToken;
    })
   
    next();

    }catch(ex) {
        res.status(500).json({message: "Something went wrong"});
        console.log(ex.message);

    }

    /* ------------------------------------------------ */

    // try{

    //     const token = req.cookies.token;

    //     console.log(token);

    //     if(!token) {
    //         return res.status(401).json({
    //             status: 'false',
    //             msg:"Please login first"
    //         });
    //     }

    //     // verify the token

    //     jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    //         if (err) {
    //             return res.status(401).json({
    //                 status: 'false',
    //                 msg:"Unauthorized access"
    //             });
    //         }

    //         req.employee = decodedToken

    //         console.log(req.employee);
    //     });

    //     next();

    // }catch(e){
    //         console.log(e);
    //         res.status(500).json({
    //             status: false,
    //             msg: "Something went wrong. Please try again later."
    //         });
    // }
};


module.exports = {
    isAuthenticated
};