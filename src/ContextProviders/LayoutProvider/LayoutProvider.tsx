import { useContext, createContext, useState, useEffect, useRef } from "react";
import { Dispatch, SetStateAction, RefObject, MouseEventHandler } from "react";
import { SongType, SidebarPlaylistType, MainPlaylistType } from "../../types";
import { PlaylistSettings } from "../../components";
import { tempsongs } from "./tempdata";

type Callback = (e: React.MouseEvent<HTMLDivElement>) => void;
interface CallbackObject {
    id: string,
    callback: Callback
}

interface TempSongType {
    title: string,
    artist: string,
    duration: string,
    uploader: string
}
interface LayoutContextInterface {
    songs: TempSongType[],
    setSongs: Dispatch<SetStateAction<TempSongType[]>>,
    currentSong: SongType | null, 
    setCurrentSong: Dispatch<SetStateAction<SongType | null>>,
    currentPlaylist: MainPlaylistType | null, 
    setCurrentPlaylist: Dispatch<SetStateAction<MainPlaylistType | null>>,
    playlists: SidebarPlaylistType[],
    setPlaylists: Dispatch<SetStateAction<SidebarPlaylistType[]>>,
    handleRootDivClick: (e: React.MouseEvent<HTMLDivElement>) => void,
    registerCallback: (id: string, callback: Callback) => void,
    songsPanelType: string | null,
    setSongsPanelType: Dispatch<SetStateAction<string | null>>,
    playlistSettingsInfo: {playlistId: string, playlistName: string} | null,
    setPlaylistSettingsInfo: Dispatch<SetStateAction<{playlistId: string, playlistName: string} | null>>,
    settingsPanelPos: {left: number, top: number},
    setSettingsPanelPos: Dispatch<SetStateAction<{left: number, top: number}>>,
    settingsPanelRef: RefObject<HTMLDivElement>,
    openPlaylistSettings: (e: React.MouseEvent<SVGSVGElement | HTMLHeadingElement>, playlistId: string, playlistName: string) => void
}
const LayoutContext = createContext<LayoutContextInterface | undefined>(undefined);

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
    const [songs, setSongs] = useState<TempSongType[]>([]); //TODO change to SongType
    const [currentSong, setCurrentSong] = useState<SongType| null>(null); 
    const [currentPlaylist, setCurrentPlaylist] = useState<MainPlaylistType | null>(null);
    const [playlists, setPlaylists] = useState<SidebarPlaylistType[]>([]);
    const [callbacks, setCallbacks] = useState<CallbackObject[]>([]);
    const [songsPanelType, setSongsPanelType] = useState<string | null>(null);

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

    return (
        <LayoutContext.Provider value={{
            songs, setSongs, 
            currentSong, setCurrentSong, 
            currentPlaylist, setCurrentPlaylist, 
            playlists, setPlaylists, 
            handleRootDivClick, registerCallback,
            songsPanelType, setSongsPanelType,
            playlistSettingsInfo, setPlaylistSettingsInfo,
            settingsPanelPos, setSettingsPanelPos,
            settingsPanelRef,
            openPlaylistSettings
        }}>
            <PlaylistSettings

            />
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