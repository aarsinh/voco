const mongoose = require("mongoose");
const db = process.env.DB_LINK;
mongoose.set("strictQuery", true, "useNewUrlParser", true);

const connectDB = async() => {
    try{
        await mongoose.connect(db);
        console.log('Mongodb connected...');
    } catch(err){
        console.log(err.message);
        process.exit(1);
    }
};
module.exports = connectDB;