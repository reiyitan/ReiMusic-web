import { useRef } from "react";
import { MouseEventHandler, MouseEvent, RefObject } from "react";
import { useLayout, useServer, useControl } from "../../ContextProviders";
import "./Playlist.css";

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
export const Playlist = ({ name, playlistId }: PlaylistProps) => {
    const dotsRef = useRef<SVGSVGElement>(null);
    const thisPlaylistDivRef = useRef<HTMLDivElement>(null);
    const thisPlaylistSpanRef = useRef<HTMLSpanElement>(null);
    const { currentPlayingPlaylistRef } = useControl();
    const { currentDisplayPlaylist, setCurrentDisplayPlaylist, songsPanelType, setSongsPanelType, openPlaylistSettings, setSongs } = useLayout();
    const { getPlaylist } = useServer();

    const handleOpenSettings: MouseEventHandler<SVGSVGElement> = (e) => {
        openPlaylistSettings(e, playlistId, name);
    }

    const handlePlaylistClick: MouseEventHandler<HTMLDivElement> = (e: MouseEvent<HTMLElement>) => {
        if (thisPlaylistDivRef.current && thisPlaylistSpanRef.current) { //clicking on dots will not open playlist
            const clickedElement = e.target as HTMLElement;
            if (clickedElement !== thisPlaylistDivRef.current && clickedElement !== thisPlaylistSpanRef.current) return;
        }

        if (currentDisplayPlaylist?._id === playlistId) return;
        getPlaylist(playlistId)
            .then(playlist => {
                if (!playlist) {
                    setCurrentDisplayPlaylist(null);
                    return
                }
                if (playlist.songs) currentPlayingPlaylistRef.current = playlist.songs.slice();
                setCurrentDisplayPlaylist({
                    name: playlist.name,
                    _id: playlist._id,
                    songs: playlist.songs
                });
                if (playlist.songs) setSongs(playlist.songs);
                setSongsPanelType("playlist");
            })
    }

    return (
        <div 
            className={(playlistId === currentDisplayPlaylist?._id && songsPanelType === "playlist") ? "playlist-active clickable" : "playlist clickable"}
            ref={thisPlaylistDivRef}
            onClick={handlePlaylistClick}
        >
            <span ref={thisPlaylistSpanRef} className="sidebar-playlist-name prevent-select overflow-ellipsis">{name}</span>
            {DotsIcon(handleOpenSettings, dotsRef)}
        </div>
    );
}