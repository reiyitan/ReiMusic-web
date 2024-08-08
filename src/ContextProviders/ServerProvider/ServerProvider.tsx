import { createContext, useContext } from "react";
interface ServerContextInterface {
    createUser: (username: String, token: String) => void
}
const ServerContext = createContext<ServerContextInterface | undefined>(undefined);

interface ServerProviderProps {
    children: React.ReactNode
}
export const ServerProvider = ({ children }: ServerProviderProps) => {

    const createUser = (username: String, token: String): void => {
        fetch("http://127.0.0.1:3000/api/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                username: username
            })
        })
        .then(res => console.log(res))
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
        <ServerContext.Provider value={{createUser}}>
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