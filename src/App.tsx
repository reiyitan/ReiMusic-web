import "./App.css"; 
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import { LoginPage, RegisterPage, HomePage } from "./pages";
import { PrivateRoute } from "./components";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} /> 
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/home" element={<PrivateRoute redirectPath="/login"><HomePage /></PrivateRoute>} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
