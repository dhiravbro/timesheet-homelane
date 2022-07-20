var express = require("express");
var app = express();
const bodyParser = require("body-parser");
var server = require("http").Server(app);
const axios = require("axios");
const { v4 } = require("uuid");
const connectDB = require("./config/connectdb");
const cors = require("cors");
// const passport = require("passport");
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
connectDB();
let timeSheetModel = require("./timeSheetDataModel");
let userModel = require("./userModel");
const PORT = process.env.PORT || 5001;
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5001";

const auth = async (req, res, next) => {
    const token = req.query.token;
    const url = "https://oauth2.googleapis.com/tokeninfo";
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
        params: {
            id_token: token,
        },
    };
    try {
        const response = await axios.get(url, config);
        const data = response.data;
        if (data.hd === "homelane.com" && data.email_verified === "true")
            next();
        else res.status(401).send({ mssg: "email unauthorized" });
    } catch (err) {
        console.log(err);
        res.status(401).send({ mssg: err.mssg });
    }
};
app.get("/get-user-details", auth, async (req, res) => {
    // console.log("api hit hua");
    let email = req.query.email;
    try {
        let userData = await userModel.find({ email: email });
        res.status(200).json({ data: userData });
        // console.log(userData);
    } catch (err) {
        console.log(err);
    }
});

app.post("/work", auth, async (req, res) => {
    let { employeeName, employeeID, start, end, employmentType, workData } =
        req.body;
    try {
        let timeSheetDetails = new timeSheetModel({
            employeeName,
            employeeID,
            start,
            end,
            employmentType,
            workData,
        });
        timeSheetDetails.save();
        console.log("TimeSheet Details submitted");
        res.status(200).json({ msg: "Details submitted" });
    } catch (err) {
        res.status(400).json({ msg: err.msg });
    }
});

app.get("/get-data", auth, async (req, res) => {
    let start = req.query.start;
    let end = req.query.end;
    // console.log(start, end);
    try {
        let data = await timeSheetModel
            .find({
                //query between any 2 dates
                start: {
                    $gte: new Date(start), // start date
                    $lt: new Date(end), // end date
                },
            })
            .sort({ start: 1 });
        // console.log(data);
        res.status(200).json({ data: data });
    } catch (err) {
        console.log(err);
    }
});
const getEmployeeData = async (start, end, token) => {
    const url1 = `${BACKEND_URL}/get-data`;
    // console.log(url1);
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
        params: {
            start: start,
            end: end,
            token: token,
        },
    };
    let timeSheetData;
    try {
        const response = await axios.get(url1, config);
        timeSheetData = response.data.data;
        // console.log(timeSheetData);
        return timeSheetData;
    } catch (err) {
        return timeSheetData;
    }
};
app.get("/get-timesheet-unfilled", auth, async (req, res) => {
    const start = req.query.start;
    const end = req.query.end;
    const token = req.query.token;
    const timeSheetData = await getEmployeeData(start, end, token);
    console.log(timeSheetData);
    if (!timeSheetData)
        res.status(401).send({ mssg: "Can't access employee data" });
    let employeeData;
    let notFilled = [];
    try {
        employeeData = await userModel.find();
        let hash_map = {};
        for (let i = 0; i < timeSheetData.length; i++) {
            hash_map[timeSheetData[i].employeeID] = 1;
        }
        for (let i = 0; i < employeeData.length; i++) {
            if (!hash_map[employeeData[i].employeeID]) {
                notFilled.push(employeeData[i]);
            }
        }
    } catch (err) {
        console.log(err);
    }
    res.status(200).json({ data: notFilled });
});

if (process.env.NODE_ENV === "production") {
    app.use(express.static("frontend/build"));
    const path = require("path");
    app.get("*", (req, res) => {
        res.sendFile(
            path.resolve(__dirname, "frontend", "build", "index.html")
        );
    });
}
server.listen(PORT, function () {
    console.log("server started on port 5001");
});
