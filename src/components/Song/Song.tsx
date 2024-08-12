import { MouseEventHandler, RefObject } from "react";
import { useRef } from "react";
import "./Song.css";

const PlayIcon = (handleClick: MouseEventHandler<SVGSVGElement>) => (
    <svg 
        className="song-play-icon" 
        onClick={handleClick}
        role="button"
        viewBox="0 0 32 32" 
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M10.968 23V9l12.762 7-12.762 7z"/>
    </svg>
)

const DotsIcon = (handleClick: MouseEventHandler<SVGSVGElement>, dotsRef: RefObject<SVGSVGElement>) => (
    <svg 
        className="song-dots-icon" 
        onClick={handleClick}
        ref={dotsRef}
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
        role="button"
    >
        <path d="M18 12H18.01M12 12H12.01M6 12H6.01M13 12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12ZM19 12C19 12.5523 18.5523 13 18 13C17.4477 13 17 12.5523 17 12C17 11.4477 17.4477 11 18 11C18.5523 11 19 11.4477 19 12ZM7 12C7 12.5523 6.55228 13 6 13C5.44772 13 5 12.5523 5 12C5 11.4477 5.44772 11 6 11C6.55228 11 7 11.4477 7 12Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)
interface SongProps {
    title: string,
    artist: string,
    duration: string,
    uploader: string
}
export const Song = ({ title, artist, duration, uploader }: SongProps) => {
    const dotsRef = useRef<SVGSVGElement>(null);
    const handlePlaySong = () => {

    }

    const handleOpenSongSettings = () => {

    }

    return (
        <div className="song">
            {PlayIcon(handlePlaySong)}
            <span className="song-field song-title prevent-select overflow-ellipsis">{title}</span>
            <span className="song-field song-artist prevent-select overflow-ellipsis">{artist}</span>
            <span className="song-field song-duration prevent-select overflow-ellipsis">{duration}</span>
            <span className="song-field song-uploader prevent-select overflow-ellipsis">{uploader}</span>
            {DotsIcon(handleOpenSongSettings, dotsRef)}
        </div>
    );
}