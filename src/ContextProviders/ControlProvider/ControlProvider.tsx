import { createContext, useContext, useState, useEffect } from "react"; 
import { Dispatch, SetStateAction } from "react";
import { Howl, Howler } from "howler";
import { useServer } from "../ServerProvider";

interface ControlContextProps {
    playing: boolean,
    setPlaying: Dispatch<SetStateAction<boolean>>,
    volume: number,
    setVolume: Dispatch<SetStateAction<number>>,
    playNewHowl: (s3_key: string, parentPlaylistId: string) => void,
    pauseHowl: () => void,
    resumeHowl: () => void
}
const ControlContext = createContext<ControlContextProps | null>(null); 

export const ControlProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentHowl, setCurrentHowl] = useState<Howl | null>(null);
    const [playing, setPlaying] = useState<boolean>(false);
    const [volume, setVolume] = useState<number>(0.5);
    const { getFileFromURL } = useServer();

    useEffect(() => {
        Howler.volume(volume);
    }, [volume]); 

    const playNewHowl = async (url: string) => {
        currentHowl?.stop();
        currentHowl?.unload();
        const file = await getFileFromURL(url);
        if (file) {
            const blobUrl = URL.createObjectURL(file);
            const sound = new Howl({
                src: [blobUrl],
                format: ["mp3"]
            });
            setCurrentHowl(sound);
            sound.play();
            setPlaying(true);
        }
    }

    const pauseHowl = () => {
        if (!currentHowl) return;
        currentHowl.pause();
        setPlaying(false);
    }

    const resumeHowl = () => {
        if (!currentHowl) return;
        currentHowl.play();
        setPlaying(true);
    }


    return (
        <ControlContext.Provider value={{playing, setPlaying, volume, setVolume, playNewHowl, pauseHowl, resumeHowl}}>
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