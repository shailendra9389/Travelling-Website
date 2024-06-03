const express=require("express");
const app=express();
const users=require("./routes/user.js");
const posts=require("./routes/post.js");
const session=require("express-session");
const flash=require("connect-flash");
const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
const sessionOptions={
    secret:"mysupersecret",
    resave:false,
    saveUninitialized:true,
};
app.use(session(sessionOptions));
app.use(flash());
app.use((req,res,next)=>{
    res.locals.successmsg=req.flash("success");
    res.locals.errormsg=req.flash("error");
    next();
});

app.get("/register",(req,res)=>{
    let{name="unknown"}=req.query;
    req.session.name=name;
    if(name==="unknown"){
        req.flash("success","user not registered");
    }else{
        req.flash("error","get registered");
    }
   
    res.redirect("/hello");
});
app.get("/hello",(req,res)=>{

    res.render("page.ejs",{name: req.session.name });
});
 

// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count=1;
//     }
   
//     res.send(`you send a request ${req.session.count} times`)
// });
// app.get("/test",(req,res)=>{
//     res.send("test succesfull");
// });
app.listen(3000,()=>{
    console.log("app.is listinening to port 300");
});


// const cookieParser=require("cookie-parser");
// app.use(cookieParser("secretwork"));


// app.get("/getsignedcookies",(req,res)=>{
//     res.cookie("greet","hello");

//     res.send("sent you some cookies");
// });


// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("verified");
// });
// app.get("/greet",(req,res)=>{
//     let{Name="anonymous"}=req.cookies;
//     res.send(`Hii, ${Name}`);
// });
// app.get("/",(req,res)=>{
//     console.dir(req.cookies);
//     res.send("this is home route");
// });
// app.use("/users",users);
// app.use("/posts",posts);
