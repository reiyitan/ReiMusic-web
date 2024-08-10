import { useState } from "react";
import "../LoginRegister.css";
import { AuthInput } from "../../components";
import { Link } from "react-router-dom";
import { useFirebase } from "../../ContextProviders";

export const LoginPage = () => {
    const [email, setEmail] = useState<string>("");
    const [pass, setPass] = useState<string>("");
    const [msg, setMsg] = useState<string>(""); 
    const { login } = useFirebase();

    const handleLogin = (): void => {
        if (!email || !pass) {
            setMsg("Fill out all fields");
            return;
        }
        setMsg("");
        login(email, pass, setMsg);
    }

    return (
        <div className="auth-page">
            <h1 className="auth-page-header">Reidio</h1>
            <div className="auth-form-wrapper main-container shadow">
                <h2 className="auth-form-header">Login</h2>
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
                <p className="warning-msg">{msg}</p>
                <button
                    className="auth-page-btn"
                    onClick={handleLogin}
                >
                    Login
                </button>
                <span className="auth-redirect-text">Don't have an account?</span>
                <Link to="/register" className="auth-redirect-link">Sign up</Link>
            </div>
        </div>
    );
}