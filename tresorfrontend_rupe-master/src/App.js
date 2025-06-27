import './App.css';
import './css/mvp.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Users from "./pages/user/Users";
import LoginUser from "./pages/user/LoginUser";
import NoPage from "./pages/NoPage";
import Secrets from "./pages/secret/Secrets";
import NewCredential from "./pages/secret/NewCredential";
import NewCreditCard from "./pages/secret/NewCreditCard";
import NewNote from "./pages/secret/NewNote";
import RegisterUser from './pages/user/RegisterUser';

/**
 * App
 * @author Peter Rutschmann
 */
function App() {
    const [loginValues, setLoginValues] = useState({ email: '', token: '' });

    useEffect(() => {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');
        if (token && email) {
            setLoginValues({ email: email, token: token });
        }
    }, []);

    const handleLogin = (email, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('email', email);
        setLoginValues({ email: email, token: token });
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        setLoginValues({ email: '', token: '' });
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout loginValues={loginValues} handleLogout={handleLogout} />}>
                    <Route index element={<Home />} />
                    <Route path="user/users" element={<Users />} />
                    <Route path="user/login" element={<LoginUser handleLogin={handleLogin} />} />
                    <Route path="user/register" element={<RegisterUser />} />
                    <Route path="secret/secrets" element={<Secrets />} />
                    <Route path="secret/newcredential" element={<NewCredential />} />
                    <Route path="secret/newcreditcard" element={<NewCreditCard />} />
                    <Route path="secret/newnote" element={<NewNote />} />
                    <Route path="*" element={<NoPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;