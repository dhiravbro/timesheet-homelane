import AdminPage from "./AdminPage";
import { useState, useEffect } from "react";
import "./App.css";
import TimeSheetForm from "./TimeSheetForm";
import { Routes, Route } from "react-router-dom";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { BACKEND_URL, GOOGLE_CLIENT_ID } from "./backendURL";
function App() {
    const google = window.google;
    const [user, setUser] = useState({});
    const [token, setToken] = useState();
    const [showError, setShowError] = useState(false);
    const handleCallbackResponse = (response) => {
        var userObj = jwt_decode(response.credential);
        setToken(response.credential);
        getUserData(userObj.email, response.credential);
        document.getElementById("homepage").classList.add("invisible");
    };
    const getUserData = async (email, token) => {
        const url = `${BACKEND_URL}/get-user-details`;
        const config = {
            headers: {
                "Content-Type": "application/json",
                token: token,
            },
            params: {
                email: email,
            },
        };
        try {
            const res = await axios.get(url, config);
            setUser(res.data.data[0]);
        } catch (err) {
            setShowError(true);
            console.log(err);
        }
    };
    const handleSignOut = (event) => {
        setUser({});
        document.getElementById("homepage").classList.remove("invisible");
    };
    useEffect(() => {
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
                    {/* <div className="employee-details">
                        <p>Name : {user.employeeName}</p>
                        <p>Email : {user.email}</p>
                        <p>Employee ID : {user.employeeID}</p>
                        <p>Employment Type : {user.employmentType}</p>
                        <button onClick={handleSignOut}>Sign Out</button>
                    </div> */}

                    {/* <Link to="admin">Go to Admin Page</Link> */}
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <TimeSheetForm
                                    user={user}
                                    handleSignOut={handleSignOut}
                                    token={token}
                                />
                            }
                        />
                        {user.isAdmin && (
                            <Route
                                path="admin"
                                element={
                                    <AdminPage
                                        user={user}
                                        handleSignOut={handleSignOut}
                                        token={token}
                                    />
                                }
                            />
                        )}
                    </Routes>
                </>
            )}
            {showError && <h1>Access denied</h1>}
            <div id="homepage">
                <img src="/logo.jpg" alt="logo" />
                <h1>Time Sheet Application</h1>
                <div id="signInDiv"></div>
            </div>
        </div>
    );
}

export default App;
