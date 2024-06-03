const express=require("express");
const router=express.Router();
router.get("/",(req,res)=>{
    res.send("this is post route")
});
router.get("/:id",(req,res)=>{
    res.send("this is postid route")
});
router.delete("/delete",(req,res)=>{
    res.send("this is post delete route")
});
module.exports=router;