import React from "react";
import "./DataPoint.css";
export default function DataPoint({ data, deleteData, id }) {
    return (
        <div className="data-box">
            <p>Project Name : {data.projectName}</p>
            <p>Project Type : {data.projectType}</p>
            <p>Time Spent : {data.timeSpent}</p>
            <button onClick={() => deleteData(id)}>Delete</button>
        </div>
    );
}
