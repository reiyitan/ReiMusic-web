import { createContext, useContext } from "react";
import { useAuth } from "../FirebaseProvider";

interface User {
    _id: String, 
    username: String, 
    playlists: [String], 
    uploadedSongs: [String]
}
interface ServerContextInterface {
    createUser: (username: String) => void,
    getUser: (uid: String) => Promise<User> | undefined
}
const ServerContext = createContext<ServerContextInterface | undefined>(undefined);
interface ServerProviderProps {
    children: React.ReactNode
}
export const ServerProvider = ({ children }: ServerProviderProps) => {
    const auth = useAuth();

    const createUser = (username: String): void => {
        auth.currentUser?.getIdToken(true)
        .then(token => {
            return fetch("http://127.0.0.1:3000/api/user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    username: username
                })
            })
        })
        .then(res => console.log(res))
        .catch(error => console.error(error));
    }

    const getUser = (uid: String): Promise<User> | undefined => {
        return auth.currentUser?.getIdToken(true)
        .then(token => {
            return fetch(`http://127.0.0.1:3000/api/user?uid=${uid}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json", 
                    "Authorization": `Bearer ${token}`
                }
            })
        })
        .then(res => res.json()) 
        .then(userData => {
            return userData
        })
        .catch(error => console.error(error));
    }

    // const createPlaylist = () => {

    // }

    // const deletePlaylist = () => {

    // }

    // const addToPlaylist = () => {

    // }

    // const removeFromPlaylist = () => {

    // }


    // const createSong = () => {

    // }

    return (
        <ServerContext.Provider value={{createUser, getUser}}>
            {children}
        </ServerContext.Provider>
    );
}

export const useServer = (): ServerContextInterface => {
    const serverContext = useContext(ServerContext);
    if (!serverContext) {
        throw new Error("useServer must be used within a ServerProvider");
    }
    return serverContext;
}   