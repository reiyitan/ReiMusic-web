import "./PlaylistsPanel.css";
import { useEffect } from "react"; 
import { MouseEventHandler } from "react";
import { useServer, useLayout } from "../../ContextProviders";
import { Playlist } from "../Playlist";

const PlusIcon = (handleClick: MouseEventHandler<SVGSVGElement>) => (
    <svg 
        id="playlists-controls-plus-icon" 
        role="button"
        onClick={handleClick}
        viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
    >
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g fill="#FFFFFF" transform="translate(65.929697, 65.929697)">
                <polygon points="211.189225 2.36847579e-14 211.189225 168.95138 380.140606 168.95138 380.140606 211.189225 211.189225 211.189225 211.189225 380.140606 168.95138 380.140606 168.95138 211.189225 -1.42108547e-14 211.189225 -1.42108547e-14 168.95138 168.95138 168.95138 168.95138 -1.42108547e-14">

                </polygon>
            </g>
        </g>
    </svg>
)

export const PlaylistsPanel = () => {
    const { createPlaylist, getPlaylists } = useServer();
    const { playlists, setPlaylists } = useLayout();

    useEffect(() => {
        getPlaylists()
            .then(playlists => {
                if (playlists) {  
                    setPlaylists(playlists);
                }
            });
    }, []); 
    
    const handleCreatePlaylist = () => {
        createPlaylist()
            .then(newPlaylist => {
                if (newPlaylist) {
                    setPlaylists(prevPlaylists => [newPlaylist, ...prevPlaylists]);
                }
            });
    }
    
    return (
        <div className="main-container shadow" id="playlists-panel">
            <div id="playlists-controls-container">
                <h1 className="prevent-select">Your Playlists</h1>
                {PlusIcon(handleCreatePlaylist)}
            </div>
            <div id="playlists-container" className="scroller">
                {
                    playlists.map((playlist) => (
                        <Playlist 
                            name={playlist.name} 
                            playlistId={playlist._id} 
                            key={playlist._id} 
                        />
                    ))
                }
            </div>
        </div>
    );
}