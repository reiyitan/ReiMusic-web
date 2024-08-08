import "./PlaylistsPanel.css";
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

export const PlaylistsPanel = () => {
    const handleCreatePlaylist = () => {

    }
    
    return (
        <div className="picto-container" id="playlists-panel">
            <div id="playlists-controls-container">
                {PlusIcon(handleCreatePlaylist)}
            </div>
            <div id="playlists-container">

            </div>
        </div>
    );
}