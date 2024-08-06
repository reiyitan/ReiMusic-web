import { createContext, useContext } from "react";

interface ServerContextInterface {

}
const ServerContext = createContext<ServerContextInterface | undefined>(undefined);

interface ServerProviderProps {
    children: React.ReactNode
}
export const ServerProvider = ({ children }: ServerProviderProps) => {

    const createUser = () => {

    }

    const createPlaylist = () => {

    }

    const deletePlaylist = () => {

    }

    const addToPlaylist = () => {

    }

    const removeFromPlaylist = () => {

    }


    const createSong = () => {

    }

    return (
        <ServerContext.Provider value={{createUser, createPlaylist, deletePlaylist, addToPlaylist, removeFromPlaylist, createSong}}>
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