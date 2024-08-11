import { useContext, createContext, useState, useRef } from "react";
import { Dispatch, SetStateAction } from "react";

interface Song {
    _id: string,
    title: string,
    artist: string,
    duration: number,
    uploader: string,
    s3_key: string
}

interface Playlist {
    _id: string,
    name: string, 
    owner: string, 
    songs: Song[]
}
interface LayoutContextInterface {
    songs: Song[],
    setSongs: Dispatch<SetStateAction<Song[]>>
}
const LayoutContext = createContext<LayoutContextInterface | undefined>(undefined);

interface LayoutProviderProps {
    children: React.ReactNode
}
export const LayoutProvider = ({ children }: LayoutProviderProps) => {
    const [songs, setSongs] = useState<Song[]>([]);
    const [currentSong, setCurrentSong] = useState<Song | null>(null); 
    const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
    return (
        <LayoutContext.Provider value={{songs, setSongs}}>
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