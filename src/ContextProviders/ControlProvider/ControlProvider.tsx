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
    mute: boolean,
    setMute: Dispatch<SetStateAction<boolean>>,
    volume: number[],
    setVolume: Dispatch<SetStateAction<number[]>>,
    seek: number[],
    setSeek: Dispatch<SetStateAction<number[]>>,
    shuffle: boolean,
    setShuffle: Dispatch<SetStateAction<boolean>>,
    loop: boolean,
    setLoop: Dispatch<SetStateAction<boolean>>,
    currentPlayingPlaylistRef: React.MutableRefObject<{playlistId: string, songs: SongType[]}>,
    historyRef: React.MutableRefObject<SongType[]>,
    playNewHowl: (url: string, samePlaylist: boolean, playingFromHistory: boolean) => void,
    pauseHowl: () => void,
    resumeHowl: () => void,
    populateQueue: (songId: string) => void,
    rewind: () => void,
    skip: () => void,
    cancelRef: React.MutableRefObject<boolean>
}
const ControlContext = createContext<ControlContextProps | null>(null); 

export const ControlProvider = ({ children }: { children: React.ReactNode }) => {
    const howlRef = useRef<Howl | null>(null);
    const [playing, setPlaying] = useState<boolean>(false);
    const [mute, setMute] = useState<boolean>(false);
    const [volume, setVolume] = useState<number[]>([0.5]);
    const queueRef = useRef<SongType[]>([]);
    const [seek, setSeek ] = useState<number[]>([0]);
    const [shuffle, setShuffle] = useState<boolean>(false);
    const shuffleRef = useRef<boolean>(shuffle);
    const [loop, setLoop] = useState<boolean>(false);
    const loopRef = useRef<boolean>(loop);
    const historyRef = useRef<SongType[]>([]);
    const currentPlayingPlaylistRef = useRef<{playlistId: string, songs: SongType[]}>({playlistId: "", songs: []});
    const { getSongURL, getFileFromURL } = useServer();
    const { currentSong, setCurrentSong } = useLayout();
    const currentSongRef = useRef<SongType | null>(currentSong);
    const cancelRef = useRef<boolean>(false);

    useEffect(() => {
        if (mute) {
            Howler.mute(true);
        }
        else {
            Howler.mute(false);
            Howler.volume(volume[0]);
        }
    }, [volume, mute]); 

    useEffect(() => {
        loopRef.current = loop;
        shuffleRef.current = shuffle;
        currentSongRef.current = currentSong;
    }, [loop, shuffle, currentSong]);

    const playNewHowl = async (url: string, samePlaylist: boolean, playingFromHistory: boolean) => {
        if (playingFromHistory) {
            if (currentSongRef.current) queueRef.current.unshift(currentSongRef.current);
        }
        else if (!samePlaylist) {
            historyRef.current = [];
        }
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
            if (cancelRef.current) return;
            sound.play();
            setPlaying(true);
        }
    }

    const handleSongEnd = async () => {
        if (currentSongRef.current) {
            historyRef.current.push(currentSongRef.current);
        }
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
            await playNewHowl(nextSongURL, true, false);
            setCurrentSong(nextSong);
        }
        else {
            setCurrentSong(null);
            setPlaying(false);
            howlRef.current = null;
            setSeek([0]);
        }
    }

    const generateQueue = (songId: string): SongType[] => {
        const songs = currentPlayingPlaylistRef.current.songs.slice();
        if (songs.length > 0) {
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
        if ((howlRef.current && howlRef.current.seek() > 5)) {
            setSeek([0]);
            howlRef.current.seek(0);
        }
        else if (howlRef.current && historyRef.current.length === 0) {
            setSeek([0]);
            howlRef.current.seek(0);
        }
        else if (historyRef.current.length > 0) {
            const prevSong = historyRef.current.pop();
            if (prevSong) {
                await playNewHowl(await getSongURL(prevSong.s3_key), true, true);
                setCurrentSong(prevSong);
            }
        }
    }

    const pauseHowl = () => {
        if (!howlRef.current) return;
        cancelRef.current = true;
        howlRef.current.pause();
        setPlaying(false);
    }

    const resumeHowl = () => {
        if (!howlRef.current) return;
        cancelRef.current = false;
        howlRef.current.play();
        setPlaying(true);
    }


    const skip = async () => {
        howlRef.current?.stop();
        howlRef.current?.unload();
        cancelRef.current = false;
        await handleSongEnd();
    }


    return (
        <ControlContext.Provider value={{
            howlRef,
            playing, setPlaying, 
            mute, setMute,
            volume, setVolume, 
            seek, setSeek, 
            shuffle, setShuffle,
            loop, setLoop,
            currentPlayingPlaylistRef,
            historyRef,
            playNewHowl, pauseHowl, resumeHowl,
            populateQueue,
            rewind, skip,
            cancelRef
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