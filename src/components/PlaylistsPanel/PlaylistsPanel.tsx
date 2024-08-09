import "./PlaylistsPanel.css";
import { useState, useEffect } from "react"; 
import { MouseEventHandler } from "react";
import { useServer } from "../../ContextProviders";

const PlusIcon = (handleClick: MouseEventHandler<SVGElement>) => (
    <svg 
        id="playlists-controls-plus-icon" 
        viewBox="0 0 24 24" fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        role="button"
        onClick={handleClick}
    >
        <path d="M11 13V20H13V13H20V11H13V4H11V11H4V13H11Z"/>
    </svg>
)

interface Playlist {
    _id: string,
    name: string,
    owner: string,
    songs: string[]
}

interface PlaylistProps {
    name: string,
    id: string
}
const Playlist = ({ name, id }: PlaylistProps) => {
    return (
        <div className="playlist">{name}</div>
    );
}

export const PlaylistsPanel = () => {
    const { createPlaylist, getPlaylists } = useServer();
    const [playlists, setPlaylists] = useState<Playlist[]>([]);

    useEffect(() => {
        getPlaylists()
            .then(playlists => {
                if (playlists) {  
                    setPlaylists(playlists);
                }
            });
    }, []); 
    
    const handleCreatePlaylist = async () => {
        createPlaylist()
            .then(newPlaylist => {
                console.log(newPlaylist);
            });
    }
    
    return (
        <div className="picto-container" id="playlists-panel">
            <div id="playlists-controls-container">
                {PlusIcon(handleCreatePlaylist)}
            </div>
            <div id="playlists-container">
                {
                    playlists.map((playlist) => (
                        <Playlist name={playlist.name} id={playlist._id} key={playlist._id} />
                    ))
                }
            </div>
        </div>
    );
}