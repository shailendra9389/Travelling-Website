const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

const mongo_url="mongodb://127.0.0.1:27017/wanderlust";
main().then((res)=>{
    console.log("connection succesful");
}).catch((err)=>{
    console.log(err);
});
async function main() {
    await mongoose.connect(mongo_url);
}
const initDB = async()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("data was intialized");
};

initDB();