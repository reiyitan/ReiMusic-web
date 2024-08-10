import { useState } from "react";
import "../LoginRegister.css";
import { AuthInput } from "../../components";
import { useFirebase, useServer } from "../../ContextProviders";
import { Link } from "react-router-dom";

export const RegisterPage = () => {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [pass, setPass] = useState<string>(""); 
    const [confPass, setConfPass] = useState<string>(""); 
    const [msg, setMsg] = useState<string>("");
    const { register } = useFirebase();
    const { createUser } = useServer();

    const handleRegister = () => {
        if (!username || !email || !pass || !confPass) {
            setMsg("Fill out all fields");
            return;
        }
        if (username.trim().length < 1 || username.trim().length > 16) {
            setMsg("Username must be 1-16 characters long");
            return;
        }
        if (pass !== confPass) {
            setMsg("Passwords do not match");
            return;
        }
        if (pass.length < 6) {
            setMsg("Password must be at least 6 characters long");
            return;
        }
        setMsg(""); 
        register(username, email, pass, setMsg, createUser);
    }

    return (
        <div className="auth-page">
            <h1 className="auth-page-header">Reidio</h1>
        <div className="auth-form-wrapper main-container shadow">
            <h2 className="auth-form-header">Create an account</h2>
            <AuthInput 
                    label="Username"
                    value={username} 
                    setValue={setUsername}
                    type="text"
                />
            <AuthInput 
                label="Email"
                value={email} 
                setValue={setEmail}
                type="text"
            />
            <AuthInput 
                label="Password"
                value={pass} 
                setValue={setPass}
                type="password"
            />
            <AuthInput 
                label="Confirm password"
                value={confPass} 
                setValue={setConfPass}
                type="password"
            />
            <p className="warning-msg">{msg}</p>
            <button
                className="auth-page-btn"
                onClick={handleRegister}
            >
                Sign up
            </button>
            <span className="auth-redirect-text">Already have an account?</span>
            <Link to="/login" className="auth-redirect-link">Sign in</Link>
        </div>
    </div>
    );
}