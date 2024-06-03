const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapasync = require("../utils/wrapasync.js");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controller/user.js");
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup",wrapasync(async(req,res)=>{
    try{
        let{username,email,password}=req.body;
        const newuser=new User({email,username});
        const registeredUser=await User.register(newuser,password);
        req.flash("success","Welcome to Wanderlust!");
        console.log(registeredUser);
        res.redirect("/listings");
    } catch(err){

        req.flash("error" ,err.message);
        res.redirect("/listings")
      
    
    }

}));
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login",passport.authenticate("local" ,{failureRedirect: "/login",
    failureFlash: true,
 }),
    async(req, res)=>{
            req.flash("success","Welcome back to Wanderlust! You are logged in!");
            console.log("Sucess");
            res.redirect("/login");
       
        }  
            
);



// router
//   .route("/login")
//   .get(userController.renderLogin)
//   .post(
//     saveRedirectUrl,
//     passport.authenticate("local", {
//       failureRedirect: "/login",
//       failureFlash: true,
//     }),
//     userController.login
//   );

module.exports=router;
