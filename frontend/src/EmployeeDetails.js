import React from "react";

export default function EmployeeDetails({ user, handleSignOut }) {
    return (
        <div className="employee-details">
            {/* <img src={user.picture} alt="profile" /> */}
            <p>Name : {user.employeeName}</p>
            <p>Email : {user.email}</p>
            <p>Employee ID : {user.employeeID}</p>
            <p>Employment Type : {user.employmentType}</p>
            <button onClick={handleSignOut}>Sign Out</button>
        </div>
    );
}
