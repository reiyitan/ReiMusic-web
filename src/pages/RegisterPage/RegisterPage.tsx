import { useState } from "react";
import "../LoginRegister.css";
import { AuthInput } from "../../components";
import { Link } from "react-router-dom";

export const RegisterPage = () => {
    const [email, setEmail] = useState<string>("");
    const [pass, setPass] = useState<string>(""); 
    const [confPass, setConfPass] = useState<string>(""); 

    return (
        <div className="auth-page">
        <div className="auth-form-wrapper picto-container">
            <h1 className="auth-form-header">Create an account</h1>
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
            <button
                className="auth-page-btn"
            >
                Sign up
            </button>
            <span className="auth-redirect-text">Already have an account?</span>
            <Link to="/login" className="auth-redirect-link">Sign in</Link>
        </div>
    </div>
    );
}