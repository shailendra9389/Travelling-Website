const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils//wrapasync.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/listing.js");
const {islogedin}=require("../middleware.js");

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map(el=>el.message).join(",");
    
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};
// //Index route
router.get("/",wrapAsync(async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//new route..
router.get("/new",islogedin,(req, res)=>{
   
    res.render("listings/new.ejs");
});


//show route..

router.get("/:id",wrapAsync(async(req,res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("success","Listing you requested doesnot exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{ listing });
}));


//create rote..
router.post("/",islogedin,wrapAsync(async(req,res)=>{
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send valid data for listings");
    // }
    // let result=listingSchema.validate(req.body);
    // console.log(result);
    // if(result.error){
    //     throw new ExpressError(400,result.error);
    // }
    
    const newlisting=new Listing(req.body.listing);
    await newlisting.save();
    req.flash("success","new listing created!!");
    res.redirect("/listings");
    // next();
}));

//edit route..
router.get("/:id/edit",islogedin,wrapAsync(async(req,res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("success","Listing you requested doesnot exist");
        res.redirect("/listings");
    }  
    res.render("listings/edit.ejs",{ listing });

}));

//UPdate route..
 router.put("/:id", islogedin,wrapAsync(async(req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listings");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing });
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
 }));
//DELETE route..

router.delete("/:id",islogedin,wrapAsync(async(req,res)=>{
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!!");
    res.redirect("/listings");

}));

module.exports=router;
