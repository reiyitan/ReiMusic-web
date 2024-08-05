import { createContext, useContext } from "react";

interface ServerContextInterface {

}
const ServerContext = createContext<ServerContextInterface | undefined>(undefined);

interface ServerProviderProps {
    children: React.ReactNode
}
export const ServerProvider = ({ children }: ServerProviderProps) => {
    return (
        <ServerContext.Provider value={{}}>
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