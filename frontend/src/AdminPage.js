import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "./backendURL";
export default function AdminPage({ token }) {
    const [downloadDetails, setDownloadDetails] = useState({
        start: "",
        end: "",
    });
    const [timeSheetData, setTimeSheetData] = useState([]);
    const changeDownloadDetails = (event) => {
        setDownloadDetails((prevVal) => {
            return {
                ...prevVal,
                [event.target.name]: event.target.value,
            };
        });
    };
    const getEmployeeData = async () => {
        if (downloadDetails.start !== "" && downloadDetails.end !== "") {
            try {
                const url = `${BACKEND_URL}/get-timesheet-unfilled`;
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    params: { ...downloadDetails, token },
                };
                const response = await axios.get(url, config);
                console.log(response.data);
                setTimeSheetData(response.data.data);
            } catch (err) {
                console.log(err);
            }
        }
    };
    const downloadData = async () => {
        console.log(downloadDetails);
        if (downloadDetails.start !== "" && downloadDetails.end !== "") {
            try {
                const url = `${BACKEND_URL}/get-data`;
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    params: { ...downloadDetails, token },
                };
                const res = await axios.get(url, config);
                // setTimeSheetData(res.data.data);
                const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
                    JSON.stringify(res.data.data)
                )}`;
                const link = document.createElement("a");
                link.href = jsonString;
                link.download = "data.json";
                link.click();
                console.log(res.data);
            } catch (err) {
                console.log(err);
            }
        }
    };
    return (
        <div className="download-work-area">
            <Link to="/">Go to form page</Link>
            <p>Download work done in time period</p>
            <div>
                <p> Start Date</p>
                <input
                    name="start"
                    type="date"
                    value={downloadDetails.start}
                    onChange={changeDownloadDetails}
                />
            </div>

            <div>
                <p> End Date</p>
                <input
                    name="end"
                    type="date"
                    value={downloadDetails.end}
                    onChange={changeDownloadDetails}
                />
            </div>
            <button onClick={downloadData}>Download Data</button>
            <button onClick={getEmployeeData}>Show absent employees</button>
            {timeSheetData.map((d) => {
                return <p>{d.employeeName}</p>;
            })}
        </div>
    );
}
