import { createContext, useContext, useState, useEffect, useRef } from "react"; 
import { Dispatch, SetStateAction } from "react";
import { Howl, Howler } from "howler";
import { useServer } from "../ServerProvider";
import { useLayout } from "../LayoutProvider";
import { SongType, PlaylistType } from "../../types";
import { shuffle as shuffleArray } from "lodash";

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
    currentPlayingPlaylist: SongType[] | null,
    setCurrentPlayingPlaylist: Dispatch<SetStateAction<SongType[] | null>>,
    playNewHowl: (s3_key: string, parentPlaylistId: string) => void,
    pauseHowl: () => void,
    resumeHowl: () => void,
    populateQueue: (songId: string) => void,
    rewind: () => void,
    skip: () => void
}
const ControlContext = createContext<ControlContextProps | null>(null); 

export const ControlProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentHowl, setCurrentHowl] = useState<Howl | null>(null);
    const [playing, setPlaying] = useState<boolean>(false);
    const [volume, setVolume] = useState<number>(0.5);
    const [queue, setQueue] = useState<SongType[]>([]);
    const queueRef = useRef<SongType[]>(queue);
    const [history, setHistory] = useState<SongType[]>([]);
    const [seek, setSeek ] = useState<number[]>([0]);
    const [shuffle, setShuffle] = useState<boolean>(false);
    const [loop, setLoop] = useState<boolean>(false);
    const loopRef = useRef<boolean>(loop);
    const [currentPlayingPlaylist, setCurrentPlayingPlaylist] = useState<SongType[]| null>(null);
    const currentPlayingPlaylistRef = useRef<SongType[] | null>(currentPlayingPlaylist);
    const { getSongURL, getFileFromURL } = useServer();
    const { currentSong, setCurrentSong } = useLayout();
    const currentSongRef = useRef<SongType | null>(currentSong);

    useEffect(() => {
        Howler.volume(volume);
    }, [volume]); 

    useEffect(() => {
        queueRef.current = queue;
        loopRef.current = loop;
        currentSongRef.current = currentSong;
        currentPlayingPlaylistRef.current = currentPlayingPlaylist
    }, [queue, loop, currentSong, currentPlayingPlaylist]);

    const playNewHowl = async (url: string) => {
        currentHowl?.stop();
        currentHowl?.unload();
        setSeek([0]);
        const file = await getFileFromURL(url);
        if (file) {
            const blobUrl = URL.createObjectURL(file);
            const sound = new Howl({
                src: [blobUrl],
                format: ["mp3"],
                onend: handleSongEnd
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

    const handleSongEnd = async () => {
        currentHowl?.unload();
        setHistory(prevHistory => {
            const newHistory = prevHistory; 
            if (currentSongRef.current) newHistory.push(currentSongRef.current); 
            return newHistory
        })
        let nextSong;
        const currentQueue = queueRef.current;
        console.log(currentQueue);
        if (currentQueue.length > 0) {
            nextSong = currentQueue[0];
            setQueue(prevQueue => prevQueue.slice(1));
        }
        else if (loopRef.current && currentSongRef.current) {
            const newQueue = generateQueue(currentSongRef.current._id);
            nextSong = newQueue[0];
            setQueue(newQueue.slice(1));
        }

        if (nextSong) {
            const nextSongURL = await getSongURL(nextSong.s3_key);
            playNewHowl(nextSongURL);
            setCurrentSong(nextSong);
        }
        else {
            setCurrentSong(null);
            setPlaying(false);
        }
    }

    const generateQueue = (songId: string): SongType[] => {
        if (!currentPlayingPlaylistRef.current) {
            return [];
        }
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
        setQueue(generateQueue(songId));
    }

    useEffect(() => {
        if (!currentSong) return;
        populateQueue(currentSong._id);
    }, [shuffle, loop]);

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
            currentPlayingPlaylist, setCurrentPlayingPlaylist,
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