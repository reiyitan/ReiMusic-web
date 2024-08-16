import { createContext, useContext, useState, useEffect, useRef } from "react"; 
import { Dispatch, SetStateAction } from "react";
import { Howl, Howler } from "howler";
import { useServer } from "../ServerProvider";
import { useLayout } from "../LayoutProvider";
import { SongType } from "../../types";
import { shuffle as shuffleArray } from "lodash";

interface ControlContextProps {
    howlRef: React.RefObject<Howl | null>,
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
    currentPlayingPlaylistRef: React.MutableRefObject<SongType[]>,
    playNewHowl: (url: string, samePlaylist: boolean) => void,
    pauseHowl: () => void,
    resumeHowl: () => void,
    populateQueue: (songId: string) => void,
    rewind: () => void,
    skip: () => void
}
const ControlContext = createContext<ControlContextProps | null>(null); 

export const ControlProvider = ({ children }: { children: React.ReactNode }) => {
    const howlRef = useRef<Howl | null>(null);
    const [playing, setPlaying] = useState<boolean>(false);
    const [volume, setVolume] = useState<number>(0.5);
    const queueRef = useRef<SongType[]>([]);
    const [seek, setSeek ] = useState<number[]>([0]);
    const [shuffle, setShuffle] = useState<boolean>(false);
    const shuffleRef = useRef<boolean>(shuffle);
    const [loop, setLoop] = useState<boolean>(false);
    const loopRef = useRef<boolean>(loop);
    const historyRef = useRef<SongType[]>([]);
    const currentPlayingPlaylistRef = useRef<SongType[]>([]);
    const { getSongURL, getFileFromURL } = useServer();
    const { currentSong, setCurrentSong } = useLayout();
    const currentSongRef = useRef<SongType | null>(currentSong);
    const handlingSkip = useRef<boolean>(false);

    useEffect(() => {
        Howler.volume(volume);
    }, [volume]); 

    useEffect(() => {
        loopRef.current = loop;
        shuffleRef.current = shuffle;
        currentSongRef.current = currentSong;
    }, [loop, shuffle, currentSong]);

    const playNewHowl = async (url: string, samePlaylist: boolean) => {
        if (currentSongRef.current && samePlaylist) historyRef.current.push(currentSongRef.current);
        else if (!samePlaylist) historyRef.current = [];
        setSeek([0]);
        const file = await getFileFromURL(url);
        if (file) {
            const blobUrl = URL.createObjectURL(file);
            const sound = new Howl({
                src: [blobUrl],
                format: ["mp3"],
                onend: handleSongEnd
            });
            howlRef.current?.stop();
            howlRef.current?.unload();
            howlRef.current = sound;
            sound.play();
            setPlaying(true);
        }
    }

    const handleSongEnd = async () => {
        let nextSong;
        if (queueRef.current.length > 0) {
            nextSong = queueRef.current.shift();
        }
        else if (loopRef.current && currentSongRef.current) {
            const newQueue = generateQueue(currentSongRef.current._id);
            nextSong = newQueue[0];
            queueRef.current = newQueue.slice(1);
        }

        if (nextSong) {
            const nextSongURL = await getSongURL(nextSong.s3_key);
            await playNewHowl(nextSongURL, true);
            setCurrentSong(nextSong);
        }
        else {
            setCurrentSong(null);
            setPlaying(false);
            howlRef.current = null;
        }
    }

    const generateQueue = (songId: string): SongType[] => {
        const songs = currentPlayingPlaylistRef.current;
        if (songs) {
            if (!shuffle) {
                let songIndex: number | undefined;
                for (let i = 0; i < songs.length; i++) {
                    if (songs[i]._id === songId) {
                        songIndex = i;
                        break;
                    }
                }
                if (!songIndex && songIndex !== 0) return [];
                if (loopRef.current && songIndex === songs.length - 1) {
                    return songs;
                }
                else {
                    return songs.slice(songIndex + 1)
                }
            }
            else {
                const filteredSongs = songs.filter(song => song._id !== songId); 
                return shuffleArray(filteredSongs);
            }
        }
        return [];
    }

    const populateQueue = (songId: string) => {
        queueRef.current = generateQueue(songId);
    }

    useEffect(() => {
        if (!currentSong) return;
        populateQueue(currentSong._id);
    }, [shuffle, loop]);

    const rewind = async () => {

    }

    const pauseHowl = () => {
        if (!howlRef.current) return;
        howlRef.current.pause();
        setPlaying(false);
    }

    const resumeHowl = () => {
        if (!howlRef.current) return;
        howlRef.current.play();
        setPlaying(true);
    }


    const skip = async () => {
        if (handlingSkip.current) return;
        handlingSkip.current = true;
        howlRef.current?.stop();
        howlRef.current?.unload();
        await handleSongEnd();
        handlingSkip.current = false;
    }


    return (
        <ControlContext.Provider value={{
            howlRef,
            playing, setPlaying, 
            volume, setVolume, 
            seek, setSeek, 
            shuffle, setShuffle,
            loop, setLoop,
            currentPlayingPlaylistRef,
            playNewHowl, pauseHowl, resumeHowl,
            populateQueue,
            rewind, skip
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