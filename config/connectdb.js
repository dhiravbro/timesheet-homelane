const mongoose = require("mongoose");
const MONGO_URI =
    process.env.MONGO_URI ||
    "mongodb+srv://dhirav:Dhirav1234@cluster0.8xsxi.mongodb.net/?retryWrites=true&w=majority";

if (MONGO_URI === undefined) {
    console.log("MONGO_URI needs to be set");
    process.exit();
}
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Mongo Db connected..");
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};
module.exports = connectDB;
