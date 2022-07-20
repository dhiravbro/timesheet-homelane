const mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    email: {
        type: String,
        required: true,
        index: {
            unique: true,
        },
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    },
    employeeName: { type: String },
    employeeID: { type: String },
    employmentType: { type: String },
    isAdmin: { type: Boolean, default: false },
});

var userModel = mongoose.model("user", userSchema);
module.exports = userModel;
