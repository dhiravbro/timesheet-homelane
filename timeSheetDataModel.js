const mongoose = require("mongoose");

var timeSheetSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    employeeName: { type: String },
    employeeID: { type: String },
    employmentType: { type: String },
    start: { type: Date },
    end: { type: Date },
    workData: [
        {
            projectName: { type: String },
            projectType: { type: String },
            timeSpent: { type: Number },
        },
    ],
});

var timeSheetModel = mongoose.model("timeSheet", timeSheetSchema);
module.exports = timeSheetModel;
