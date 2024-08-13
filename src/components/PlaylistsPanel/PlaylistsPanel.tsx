import "./PlaylistsPanel.css";
import { useEffect, useRef } from "react"; 
import { MouseEventHandler, RefObject, MouseEvent } from "react";
import { useServer, useLayout } from "../../ContextProviders";

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

const DotsIcon = (handleClick: MouseEventHandler<SVGSVGElement>, dotsRef: RefObject<SVGSVGElement>) => (
    <svg 
        className="sidebar-playlist-dots-icon" 
        onClick={handleClick}
        ref={dotsRef}
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
        role="button"
    >
        <path d="M18 12H18.01M12 12H12.01M6 12H6.01M13 12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12ZM19 12C19 12.5523 18.5523 13 18 13C17.4477 13 17 12.5523 17 12C17 11.4477 17.4477 11 18 11C18.5523 11 19 11.4477 19 12ZM7 12C7 12.5523 6.55228 13 6 13C5.44772 13 5 12.5523 5 12C5 11.4477 5.44772 11 6 11C6.55228 11 7 11.4477 7 12Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)
interface PlaylistProps {
    name: string,
    playlistId: string
}
const Playlist = ({ name, playlistId }: PlaylistProps) => {
    const dotsRef = useRef<SVGSVGElement>(null);
    const thisPlaylistDivRef = useRef<HTMLDivElement>(null);
    const thisPlaylistSpanRef = useRef<HTMLSpanElement>(null);
    const { currentPlaylist, setCurrentPlaylist, setSongsPanelType, openPlaylistSettings} = useLayout();

    const handleOpenSettings: MouseEventHandler<SVGSVGElement> = (e) => {
        openPlaylistSettings(e, playlistId, name);
    }

    const handlePlaylistClick: MouseEventHandler<HTMLDivElement> = (e: MouseEvent<HTMLElement>) => {
        if (thisPlaylistDivRef.current && thisPlaylistSpanRef.current) {
            const clickedElement = e.target as HTMLElement;
            if (clickedElement !== thisPlaylistDivRef.current && clickedElement !== thisPlaylistSpanRef.current) return;
        }
        //TODO call setCurrentPlaylist with actual info from API
        if (currentPlaylist?._id === playlistId) return;
        setCurrentPlaylist({
            name: name,
            _id: playlistId,
            owner: "temp owner",
            songs: []
        });
        setSongsPanelType("playlist");
    }

    return (
        <div 
            className="playlist"
            ref={thisPlaylistDivRef}
            onClick={handlePlaylistClick}
        >
            <span ref={thisPlaylistSpanRef} className="sidebar-playlist-name prevent-select overflow-ellipsis">{name}</span>
            {DotsIcon(handleOpenSettings, dotsRef)}
        </div>
    );
}

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