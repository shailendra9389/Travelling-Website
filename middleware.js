module.exports.islogedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","You must be logedin to create a listing");
        return res.redirect("/login");
    }
    next();
}