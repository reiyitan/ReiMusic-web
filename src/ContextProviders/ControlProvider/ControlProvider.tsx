import { createContext, useContext, useState } from "react"; 
import { Dispatch, SetStateAction } from "react";

interface ControlContextProps {
    volume: number,
    setVolume: Dispatch<SetStateAction<number>>
}
const ControlContext = createContext<ControlContextProps | null>(null); 

export const ControlProvider = ({ children }: { children: React.ReactNode }) => {
    const [volume, setVolume] = useState<number>(0.5);

    return (
        <ControlContext.Provider value={{volume, setVolume}}>
            {children}
        </ControlContext.Provider>
    );
}

export const useControl = () => {
    const controlContext = useContext(ControlContext);
    if (!controlContext) {
        throw new Error("useControl must be used within a ControlProvider");
    }
    return controlContext;
}