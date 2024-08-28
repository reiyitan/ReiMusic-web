import { useContext, createContext, useState, useRef } from "react";
import { Dispatch, SetStateAction, RefObject } from "react";
import { SongType, PlaylistType } from "../../types";

type Callback = (e: React.MouseEvent<HTMLDivElement>) => void;
interface CallbackObject {
    id: string,
    callback: Callback
}
interface LayoutContextInterface {
    songs: SongType[],
    setSongs: Dispatch<SetStateAction<SongType[]>>,
    currentSong: SongType | null, 
    setCurrentSong: Dispatch<SetStateAction<SongType | null>>,
    currentDisplayPlaylist: PlaylistType | null, 
    setCurrentDisplayPlaylist: Dispatch<SetStateAction<PlaylistType | null>>,
    playlists: PlaylistType[],
    setPlaylists: Dispatch<SetStateAction<PlaylistType[]>>,
    handleRootDivClick: (e: React.MouseEvent<HTMLDivElement>) => void,
    registerCallback: (id: string, callback: Callback) => void,
    songsPanelType: string,
    setSongsPanelType: Dispatch<SetStateAction<string>>,
    vanisherMsg: string, 
    setVanisherMsg: Dispatch<SetStateAction<string>>,
    playlistSettingsInfo: {playlistId: string, playlistName: string} | null,
    setPlaylistSettingsInfo: Dispatch<SetStateAction<{playlistId: string, playlistName: string} | null>>,
    settingsPanelPos: {left: number, top: number},
    setSettingsPanelPos: Dispatch<SetStateAction<{left: number, top: number}>>,
    settingsPanelRef: RefObject<HTMLDivElement>,
    openPlaylistSettings: (e: React.MouseEvent<SVGSVGElement | HTMLHeadingElement>, playlistId: string, playlistName: string) => void,
    songSettingsInfo: SongType | null,
    setSongSettingsInfo: Dispatch<SetStateAction<SongType | null>>,
    songSettingsPos: {left: number, top: number}, 
    setSongSettingsPos: Dispatch<SetStateAction<{left: number, top: number}>>,
    songSettingsRef: RefObject<HTMLDivElement>,
    openSongSettings: (
        e: React.MouseEvent<SVGSVGElement>, 
        _id: string, 
        title: string, 
        artist: string,
        duration: number,
        uploaderId: string,
        uploader: string,
        s3_key: string,
        parentPlaylistId: string
    ) => void,
    formatDuration: (duration: number) => string
}
const LayoutContext = createContext<LayoutContextInterface | undefined>(undefined);

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
    const [songs, setSongs] = useState<SongType[]>([]); //TODO change to SongType
    const [currentSong, setCurrentSong] = useState<SongType| null>(null); 
    const [currentDisplayPlaylist, setCurrentDisplayPlaylist] = useState<PlaylistType | null>(null);
    const [playlists, setPlaylists] = useState<PlaylistType[]>([]);
    const [callbacks, setCallbacks] = useState<CallbackObject[]>([]);
    const [songsPanelType, setSongsPanelType] = useState<string>("search");
    const [vanisherMsg, setVanisherMsg] = useState<string>("");

    //playlist settings panel
    const [playlistSettingsInfo, setPlaylistSettingsInfo] = useState<{playlistId: string, playlistName: string} | null>(null); 
    const [settingsPanelPos, setSettingsPanelPos] = useState<{left: number, top: number}>({left: 0, top: 0});
    const settingsPanelRef = useRef<HTMLDivElement>(null);
    const openPlaylistSettings = (e: React.MouseEvent<SVGSVGElement | HTMLHeadingElement>, playlistId: string, playlistName: string) => {
        setPlaylistSettingsInfo({playlistId: playlistId, playlistName: playlistName});
        if (settingsPanelRef.current) {
            const settingsRect = settingsPanelRef.current.getBoundingClientRect();
            setSettingsPanelPos({left: e.clientX - settingsRect.width - 3, top: e.clientY + 3})
        }
    }

    //song settings panel 
    const [songSettingsInfo, setSongSettingsInfo] = useState<SongType | null>(null);
    const [songSettingsPos, setSongSettingsPos] = useState<{left: number, top: number}>({left: 0, top: 0});
    const songSettingsRef = useRef<HTMLDivElement>(null);
    const openSongSettings = (
        e: React.MouseEvent<SVGSVGElement>, 
        _id: string, 
        title: string, 
        artist: string,
        duration: number,
        uploaderId: string,
        uploader: string,
        s3_key: string,
        parentPlaylistId: string
    ) => {
        setSongSettingsInfo({
            _id: _id,
            title: title,
            artist: artist,
            duration: duration,
            uploaderId: uploaderId,
            uploader: uploader,
            s3_key: s3_key,
            parentPlaylistId: parentPlaylistId
        });
        if (songSettingsRef.current) {
            const settingsRect = songSettingsRef.current.getBoundingClientRect(); 
            setSongSettingsPos({left: e.clientX - settingsRect.width - 3, top: e.clientY + 3});
        }
    }

    const registerCallback = (id: string, callback: Callback): void => {
        setCallbacks(prevCallbacks => {
            const filteredCallbacks = prevCallbacks.filter(prevCallback => prevCallback.id === id);
            if (filteredCallbacks.length === 0) {
                return [...prevCallbacks, {id: id, callback: callback}];
            }
            return prevCallbacks.map(prevCallback => {
                if (prevCallback.id === id) {
                    return { id: id, callback: callback };
                }
                else {
                    return prevCallback;
                }
            });
        });
    }

    const handleRootDivClick = (e: React.MouseEvent<HTMLDivElement>) => {
        callbacks.forEach(callback => {
            callback.callback(e);
        });
    }

    const formatDuration = (duration: number) => {
        const minutes = Math.floor(duration / 60);
        const seconds = Math.ceil(duration % 60).toString().padStart(2, "0");
        return `${minutes}:${seconds}`;
    }

    return (
        <LayoutContext.Provider value={{
            songs, setSongs, 
            currentSong, setCurrentSong, 
            currentDisplayPlaylist, setCurrentDisplayPlaylist, 
            playlists, setPlaylists, 
            handleRootDivClick, registerCallback,
            songsPanelType, setSongsPanelType,
            vanisherMsg, setVanisherMsg,
            playlistSettingsInfo, setPlaylistSettingsInfo,
            settingsPanelPos, setSettingsPanelPos,
            settingsPanelRef,
            openPlaylistSettings,
            songSettingsInfo, setSongSettingsInfo,
            songSettingsPos, setSongSettingsPos,
            songSettingsRef,
            openSongSettings,
            formatDuration
        }}>
            {children}
        </LayoutContext.Provider>
    );
}

export const useLayout = () => {
    const layoutContext = useContext(LayoutContext); 
    if (!layoutContext) {
        throw new Error("useLayout must be used within a LayoutProvider"); 
    }
    return layoutContext;
}