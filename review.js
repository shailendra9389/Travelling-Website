const express=require("express");
const router=express.Router({mergeParams:true});
const Listing=require("../models/listing.js");
const ExpressError=require("../utils/ExpressError.js");
const wrapAsync = require("../utils//wrapasync.js");
const {reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");


const validatereview=(req,res,next)=>{
    let { error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

//post review route
router.post("/", validatereview,wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","new review created!!");
    res.redirect(`/listings/${listing._id}`);
}));
//delete review route
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let { id, reviewId }=req.params;
    Listing.findByIdAndUpdate(id,{$pull: {reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review deleted!!");
    res.redirect(`/listings/${id}`);
}));

module.exports=router;



