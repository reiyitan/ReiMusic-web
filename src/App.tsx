import "./App.css"; 
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import { LoginPage, RegisterPage, HomePage } from "./pages";
import { PrivateRoute } from "./components";
import { FirebaseProvider } from "./ContextProviders";

function App() {
    return (
            <BrowserRouter>
                <FirebaseProvider>
                    <Routes>
                        <Route path="/" element={<LoginPage />} />
                        <Route path="/login" element={<LoginPage />} /> 
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/home" element={<PrivateRoute redirectPath="/login"><HomePage /></PrivateRoute>} />
                    </Routes>
                </FirebaseProvider>
            </BrowserRouter>
    )
}

export default App
