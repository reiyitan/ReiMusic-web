import { useContext, createContext, useState, MouseEvent } from "react";
import { Dispatch, SetStateAction } from "react";
import { SongType, SidebarPlaylistType, MainPlaylistType } from "../../types";

type Callback = (e: MouseEvent<HTMLDivElement>) => void;
interface CallbackObject {
    id: string,
    callback: Callback
}

interface LayoutContextInterface {
    songs: SongType[],
    setSongs: Dispatch<SetStateAction<SongType[]>>,
    currentSong: SongType | null, 
    setCurrentSong: Dispatch<SetStateAction<SongType | null>>,
    currentPlaylist: MainPlaylistType | null, 
    setCurrentPlaylist: Dispatch<SetStateAction<MainPlaylistType | null>>,
    playlists: SidebarPlaylistType[],
    setPlaylists: Dispatch<SetStateAction<SidebarPlaylistType[]>>,
    handleRootDivClick: (e: MouseEvent<HTMLDivElement>) => void,
    registerCallback: (id: string, callback: Callback) => void
}
const LayoutContext = createContext<LayoutContextInterface | undefined>(undefined);

interface LayoutProviderProps {
    children: React.ReactNode
}
export const LayoutProvider = ({ children }: LayoutProviderProps) => {
    const [songs, setSongs] = useState<SongType[]>([]);
    const [currentSong, setCurrentSong] = useState<SongType| null>(null); 
    const [currentPlaylist, setCurrentPlaylist] = useState<MainPlaylistType | null>(null);
    const [playlists, setPlaylists] = useState<SidebarPlaylistType[]>([]);
    const [callbacks, setCallbacks] = useState<CallbackObject[]>([]);

    const registerCallback = (id: string, callback: Callback): void => {
        setCallbacks(prevCallbacks => {
            const filteredCallbacks = prevCallbacks.filter(prevCallback => prevCallback.id === id);
            if (filteredCallbacks.length === 0) {
                return [{id: id, callback: callback}];
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

    const handleRootDivClick = (e: MouseEvent<HTMLDivElement>) => {
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
            handleRootDivClick, registerCallback
        }}>
            {children}
        </LayoutContext.Provider>
    );
}

export const useLayout = () => {
    const layoutContext = useContext(LayoutContext); 
    if (!layoutContext) {
        throw new Error("layoutContext must be used within a LayoutProvider"); 
    }
    return layoutContext;
}