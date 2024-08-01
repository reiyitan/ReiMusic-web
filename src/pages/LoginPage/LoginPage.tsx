import { useState } from "react";
import "../LoginRegister.css";
import { AuthInput } from "../../components";
import { Link } from "react-router-dom";

export const LoginPage = () => {
    const [email, setEmail] = useState<string>("");
    const [pass, setPass] = useState<string>("");
    return (
        <div className="auth-page">
            <div className="auth-form-wrapper picto-container">
                <h1 className="auth-form-header">Login</h1>
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
                <button
                    className="auth-page-btn"
                >
                    Login
                </button>
                <span className="auth-redirect-text">Don't have an account?</span>
                <Link to="/register" className="auth-redirect-link">Sign up</Link>
            </div>
        </div>
    );
}