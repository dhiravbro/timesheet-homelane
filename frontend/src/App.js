import AdminPage from "./AdminPage";
import { useState, useEffect } from "react";
import "./App.css";
import TimeSheetForm from "./TimeSheetForm";
import { Routes, Route } from "react-router-dom";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { BACKEND_URL, GOOGLE_CLIENT_ID } from "./backendURL";
function App() {
    const [user, setUser] = useState({});
    const [token, setToken] = useState();
    const handleCallbackResponse = (response) => {
        console.log("JWT token", response.credential);
        var userObj = jwt_decode(response.credential);
        setToken(response.credential);
        console.log(userObj);
        getUserData(userObj.email, response.credential);
        document.getElementById("signInDiv").hidden = true;
    };
    const getUserData = async (email, token) => {
        const url = `${BACKEND_URL}/get-user-details`;
        console.log(url);
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            params: {
                email: email,
                token: token,
            },
        };
        try {
            const res = await axios.get(url, config);
            setUser(res.data.data[0]);
            console.log(res.data);
        } catch (err) {
            console.log(err);
        }
    };
    const handleSignOut = (event) => {
        setUser({});
        document.getElementById("signInDiv").hidden = false;
    };
    useEffect(() => {
        /* global google */
        google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCallbackResponse,
        });
        google.accounts.id.renderButton(document.getElementById("signInDiv"), {
            theme: "outline",
            size: "large",
        });
        google.accounts.id.prompt();
    }, []);
    return (
        <div className="App">
            {Object.keys(user).length !== 0 && (
                <>
                    <div>
                        {/* <img src={user.picture} alt="profile" /> */}
                        <p>Name : {user.employeeName}</p>
                        <p>Email : {user.email}</p>
                        <p>Employee ID : {user.employeeID}</p>
                        <p>Employment Type : {user.employmentType}</p>
                        <button onClick={handleSignOut}>Sign Out</button>
                    </div>

                    {/* <Link to="admin">Go to Admin Page</Link> */}
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <TimeSheetForm user={user} token={token} />
                            }
                        />
                        {user.isAdmin && (
                            <Route
                                path="admin"
                                element={<AdminPage token={token} />}
                            />
                        )}
                    </Routes>
                </>
            )}
            <div id="signInDiv"></div>
        </div>
    );
}

export default App;
