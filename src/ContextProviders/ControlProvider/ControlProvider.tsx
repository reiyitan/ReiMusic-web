import { createContext, useContext, useState, useEffect } from "react"; 
import { Dispatch, SetStateAction } from "react";
import { Howl, Howler } from "howler";
import { useServer } from "../ServerProvider";
import { useLayout } from "../LayoutProvider";
import { SongType } from "../../types";

interface ControlContextProps {
    currentHowl: Howl | null,
    setCurrentHowl: Dispatch<SetStateAction<Howl | null>>,
    playing: boolean,
    setPlaying: Dispatch<SetStateAction<boolean>>,
    volume: number,
    setVolume: Dispatch<SetStateAction<number>>,
    seek: number[],
    setSeek: Dispatch<SetStateAction<number[]>>,
    shuffle: boolean,
    setShuffle: Dispatch<SetStateAction<boolean>>,
    loop: boolean,
    setLoop: Dispatch<SetStateAction<boolean>>,
    playNewHowl: (s3_key: string, parentPlaylistId: string) => void,
    pauseHowl: () => void,
    resumeHowl: () => void
}
const ControlContext = createContext<ControlContextProps | null>(null); 

export const ControlProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentHowl, setCurrentHowl] = useState<Howl | null>(null);
    const [playing, setPlaying] = useState<boolean>(false);
    const [volume, setVolume] = useState<number>(0.5);
    const [queue, setQueue] = useState<SongType[]>([]);
    const [history, setHistory] = useState<SongType[]>([]);
    const [seek, setSeek ] = useState<number[]>([0]);
    const [shuffle, setShuffle] = useState<boolean>(false);
    const [loop, setLoop] = useState<boolean>(false);
    const { getFileFromURL } = useServer();
    const { currentPlaylist } = useLayout();

    useEffect(() => {
        Howler.volume(volume);
    }, [volume]); 

    const playNewHowl = async (url: string) => {
        currentHowl?.stop();
        currentHowl?.unload();
        setSeek([0]);
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

    const populateQueue = () => {
        
    }

    const rewind = () => {

    }

    const skip = () => {

    }


    return (
        <ControlContext.Provider value={{
            currentHowl, setCurrentHowl, 
            playing, setPlaying, 
            volume, setVolume, 
            seek, setSeek, 
            shuffle, setShuffle,
            loop, setLoop,
            playNewHowl, pauseHowl, resumeHowl
        }}>
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