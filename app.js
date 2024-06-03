const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils//wrapasync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const Review=require("./models/review.js");
const wrapasync = require("./utils//wrapasync.js");
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const userRouter=require("./routes/user.js");

main().then((res)=>{
    console.log("connection succesful");
}).catch((err)=>{
    console.log(err);
});
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const sessionOptions={
    secret:"mysecretecode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
};
app.get("/",(req,res)=>{
    res.send("i am root");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.serializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
});
// app.get("/demouser",async(req,res)=>{
//     let fakeuser=new User({
//         email:"stu@gmail.com",
//         username:"delta-student",
//     });
//     let registeredUser= await User.register(fakeuser,"hello");
//     res.send(registeredUser);
// });
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter)

//reviews**
//post route>>


app.all('*',(req,res,next)=>{
    next(new ExpressError(404, "page not found !"));
});

app.use((err,req,res,next)=>{
    let{statusCode=500,message="This Page is not valid."}=err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{err});

    // res.send("please eneter valid price this price wouls not be acceptable ");
});

app.listen(5050,()=>{

    console.log("server is listining to port 8080");
});

