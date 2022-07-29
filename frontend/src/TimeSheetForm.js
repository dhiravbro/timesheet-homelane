import React, { useState } from "react";
import DataPoint from "./DataPoint";
import axios from "axios";
import projects from "./Projects";
import projectTypes from "./ProjectTypes";
import employmentTypes from "./EmploymentTypes";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "./backendURL";
import EmployeeDetails from "./EmployeeDetails";
export default function TimeSheetForm({ user, token, handleSignOut }) {
    const [totWorkingHours, setTotWorkingHours] = useState(0);
    const [showSubmitted, setShowSubmitted] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const defFormData = {
        employeeName: user.employeeName,
        employeeID: user.employeeID,
        employmentType: user.employmentType,
        start: "",
        end: "",
        workData: [],
    };
    const [weekLength, setWeekLength] = useState(4);
    const changeWeekLength = (val) => {
        setWeekLength(val);
    };
    const [formData, setFormData] = useState(defFormData);
    const defWorkData = {
        projectName: "",
        projectType: "",
        timeSpent: 0.25,
    };
    const [workData, setWorkData] = useState(defWorkData);
    const formDataChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        if (name === "start") {
            const dateObj = new Date(value);
            dateObj.setDate(dateObj.getDate() + weekLength);
            let y = dateObj.getFullYear();
            let m =
                dateObj.getMonth() < 10
                    ? "0" + (dateObj.getMonth() + 1).toString()
                    : (dateObj.getMonth() + 1).toString();
            let d =
                dateObj.getDate() < 10
                    ? "0" + dateObj.getDate().toString()
                    : dateObj.getDate().toString();
            let newString = y + "-" + m + "-" + d;
            setFormData((prevVal) => {
                return {
                    ...prevVal,
                    end: newString,
                };
            });
        }
        setFormData((prevVal) => {
            return {
                ...prevVal,
                [name]: value,
            };
        });
    };
    const workDataChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setWorkData((prevVal) => {
            return {
                ...prevVal,
                [name]: value,
            };
        });
    };
    const addWorkData = () => {
        const val = workData;
        setTotWorkingHours(
            parseFloat(totWorkingHours) + parseFloat(workData.timeSpent)
        );
        setFormData((prevVal) => {
            return {
                ...prevVal,
                workData: [...formData.workData, val],
            };
        });
    };
    const deleteWorkData = (id) => {
        let newWorkData = [
            ...formData.workData.slice(0, id),
            ...formData.workData.slice(id + 1),
        ];
        let timeDeleted = formData.workData[id].timeSpent;
        setTotWorkingHours(
            parseFloat(totWorkingHours) - parseFloat(timeDeleted)
        );
        setFormData((prevVal) => {
            return {
                ...prevVal,
                workData: newWorkData,
            };
        });
    };
    const submitData = async () => {
        const url = `${BACKEND_URL}/work`;
        const config = {
            headers: {
                "Content-Type": "application/json",
                token: token,
            },
            params: {
                token: token,
            },
        };
        if (
            totWorkingHours > 0 &&
            formData.start !== "" &&
            formData.end !== ""
        ) {
            try {
                const res = await axios.post(url, formData, config);
                if (res.status === 200) {
                    setFormData(defFormData);
                    setWorkData(defWorkData);
                    setTotWorkingHours(0);
                    setShowSubmitted(true);
                    setTimeout(() => setShowSubmitted(false), 3000);
                }
            } catch (err) {
                console.log(err);
            }
        }
    };
    const timeValue = [
        0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.25, 2.5, 2.75, 3.0, 3.25,
        3.5, 3.75, 4.0, 4.25, 4.5, 4.75, 5.0,
    ];
    return (
        <>
            {user.isAdmin && <Link to="/admin">To Admin Page</Link>}
            <div className="timesheet-area">
                <div className="add-work-area">
                    <EmployeeDetails
                        user={user}
                        handleSignOut={handleSignOut}
                    />
                    <div className="work-area">
                        <p>Add you work</p>
                        <div>
                            <p>Project Name</p>
                            <select
                                name="projectName"
                                value={workData.projectName}
                                onChange={workDataChangeHandler}
                            >
                                <option value="">Select</option>
                                {projects.map((p) => (
                                    <option value={p}>{p}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <p>Project Type</p>
                            <select
                                name="projectType"
                                value={workData.projectType}
                                onChange={workDataChangeHandler}
                            >
                                <option value="">Select</option>
                                {projectTypes.map((p) => (
                                    <option value={p}>{p}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <p>Time spent</p>
                            <select
                                name="timeSpent"
                                value={workData.timeSpent}
                                onChange={workDataChangeHandler}
                            >
                                {timeValue.map((d) => (
                                    <option value={d}>{d}</option>
                                ))}
                            </select>
                        </div>
                        <button onClick={addWorkData}>Add Work</button>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="submit-button"
                    >
                        Submit
                    </button>
                </div>
                <div>
                    <div className="timesheet-details">
                        <p>Time Sheet details</p>
                        <div>
                            <button
                                className={weekLength === 4 ? "active" : ""}
                                onClick={() => changeWeekLength(4)}
                            >
                                +5
                            </button>
                            <button
                                className={weekLength === 6 ? "active" : ""}
                                onClick={() => changeWeekLength(6)}
                            >
                                +7
                            </button>
                        </div>
                        <div>
                            <p> Start date</p>
                            <input
                                name="start"
                                type="date"
                                value={formData.start}
                                onChange={formDataChangeHandler}
                            />
                        </div>

                        <div>
                            <p> End date</p>
                            <input
                                id="end"
                                name="end"
                                type="date"
                                // step={weekLength}
                                value={formData.end}
                                onChange={formDataChangeHandler}
                            />
                        </div>
                    </div>
                    <div className="display-area">
                        <p>Added work</p>
                        <p>Total working days : {totWorkingHours}</p>
                        {formData.workData.map((d, index) => {
                            return (
                                <DataPoint
                                    data={d}
                                    key={index}
                                    id={index}
                                    deleteData={deleteWorkData}
                                />
                            );
                        })}
                    </div>

                    {showSubmitted && (
                        <p style={{ color: "red" }}>
                            TimeSheet was successfuly submitted{" "}
                        </p>
                    )}
                </div>

                {showModal && (
                    <>
                        <div className="modal">
                            Confirm submission
                            <div>
                                <button
                                    onClick={() => {
                                        submitData();
                                        setShowModal(false);
                                    }}
                                >
                                    Yes
                                </button>
                                <button onClick={() => setShowModal(false)}>
                                    No
                                </button>
                            </div>
                        </div>
                        <div
                            className="backdrop"
                            onClick={() => setShowModal(false)}
                        ></div>
                    </>
                )}
            </div>
        </>
    );
}
