import { createContext, useContext, useEffect, useState } from "react";
import { Dispatch, SetStateAction } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, setPersistence, browserLocalPersistence, onAuthStateChanged, signOut, Auth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";
import { Howler } from "howler";

const SERVER_ADDR = import.meta.env.VITE_SERVER_ADDR;

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};
const fbApp = initializeApp(firebaseConfig);
const auth = getAuth(fbApp);
const fsDb = getFirestore(fbApp);

interface FirebaseContextInterface {
    login: (email: string, pass: string, setMsg: Dispatch<SetStateAction<string>>) => void,
    logout: () => void,
    register: (username: string, email: string, pass: string, setMsg: Dispatch<SetStateAction<string>>, createUser: Function) => void,
    username: string,
}
const FirebaseContext = createContext<FirebaseContextInterface | undefined>(undefined);
interface FirebaseProviderProps {
    children: React.ReactNode
}
export const FirebaseProvider = ({ children }: FirebaseProviderProps) => {
    const navigate = useNavigate(); 
    const location = useLocation();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [username, setUsername] = useState<string>("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async user => {
            if (user) {
                fetch(`https://${SERVER_ADDR}/api/user/${user.uid}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json", 
                        "Authorization": `Bearer ${await user.getIdToken(true)}`
                    }
                })
                .then(res => res.json())
                .then(data => {
                    if (data.user) {
                        setUsername(data.user.username);
                        navigate("/home");
                    }
                })
            }
            else if (location.pathname !== "/login" && location.pathname !== "/register") {
                navigate("/login");
            }
            setIsLoading(false);
            return unsubscribe;
        });
    }, []);

    const login = (email: string, pass: string, setMsg: Dispatch<SetStateAction<string>>): void => {
        setPersistence(auth, browserLocalPersistence)
        .then(() => signInWithEmailAndPassword(auth, email, pass))
        .catch(error => {
            switch (error.code) {
                case "auth/invalid-email":
                    setMsg("Invalid email");
                    break;
                case "auth/invalid-credential":
                    setMsg("Incorrect email or password");
                    break;
                default:
                    setMsg("An unexpected error occurred while signing in");
                    break;
            }
        });
    }

    const logout = () => {
        signOut(auth)
            .then(_ => Howler.unload())
            .catch(error => console.error(error));
    }

    const register = async (username: string, email: string, pass: string, setMsg: Dispatch<SetStateAction<string>>, createUser: Function): Promise<void> => {
        const docRef = doc(fsDb, "usernames", username);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setMsg("Username taken");
            return;
        }

        setPersistence(auth, browserLocalPersistence)
        .then(() => createUserWithEmailAndPassword(auth, email, pass))
        .then(async () => {
            setDoc(doc(fsDb, "usernames", username), {});
            await createUser(username);
            navigate("/home");
        })
        .catch(error => {
            switch(error.code) {
                case "auth/email-already-in-use":
                    setMsg("Email already in use");
                    break;
                case "auth/invalid-email":
                    setMsg("Enter a valid email");
                    break;
                case "auth/weak-password":
                    setMsg("Password must be at least 6 characters long");
                    break;
                default:
                    setMsg("An unexpected error occurred while signing up");
                    break;
            }
        });
    }

    return (
        <FirebaseContext.Provider value={{login, logout, register, username}}>
            {!isLoading && children}
        </FirebaseContext.Provider>
    );
}

export const useFirebase = (): FirebaseContextInterface => {
    const fbContext = useContext(FirebaseContext); 
    if (!fbContext) {
        throw new Error("useFirebase must be used within a FirebaseProvider");
    }
    return fbContext;
}
export const useAuth = (): Auth => auth;