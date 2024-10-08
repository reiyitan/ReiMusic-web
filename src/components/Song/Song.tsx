import { MouseEventHandler, RefObject } from "react";
import { useRef } from "react";
import { useLayout, useServer, useControl } from "../../ContextProviders";
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

const PauseIcon = (handleClick: MouseEventHandler<SVGSVGElement>) => (
    <svg 
        className="song-pause-icon"
        onClick={handleClick} 
        role="button"
        viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M8 5V19M16 5V19" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
        <path className="song-dots-path" d="M18 12H18.01M12 12H12.01M6 12H6.01M13 12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12ZM19 12C19 12.5523 18.5523 13 18 13C17.4477 13 17 12.5523 17 12C17 11.4477 17.4477 11 18 11C18.5523 11 19 11.4477 19 12ZM7 12C7 12.5523 6.55228 13 6 13C5.44772 13 5 12.5523 5 12C5 11.4477 5.44772 11 6 11C6.55228 11 7 11.4477 7 12Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)
interface SongProps {
    songId: string,
    title: string,
    artist: string,
    duration: number,
    uploaderId: string,
    uploader: string,
    s3_key: string,
    parentPlaylistId: string
}
export const Song = ({ songId, title, artist, duration, uploaderId, uploader, s3_key, parentPlaylistId }: SongProps) => {
    const dotsRef = useRef<SVGSVGElement>(null);
    const { getSongURL, getPlaylist } = useServer();
    const { currentSong, setCurrentSong, formatDuration, openSongSettings, songs, setPlaylistSettingsInfo } = useLayout();
    const { playing, playNewHowl, resumeHowl, pauseHowl, populateQueue, historyRef, cancelRef, currentPlayingPlaylistRef } = useControl();
    const songDivRef = useRef<HTMLDivElement>(null);

    const handlePlaySong = async (e: React.MouseEvent) => {
        if (songDivRef.current) {
            const target = e.target as HTMLElement;
            if (target.classList.contains("song-dots-icon") || target.classList.contains("song-dots-path")) {
                return; 
            }
        }
        
        if (!currentSong || currentSong?._id !== songId || currentSong.parentPlaylistId !== parentPlaylistId) { //no song playing or song change or playlist change
            if (currentSong) historyRef.current.push(currentSong);
            if (parentPlaylistId === "search") {
                currentPlayingPlaylistRef.current = {
                    playlistId: "search", 
                    songs: songs.slice().map(song => ({ ...song, parentPlaylistId: "search" }))
                };
            }
            else {
                const playlist = await getPlaylist(parentPlaylistId);
                if (playlist && playlist.songs) {
                    currentPlayingPlaylistRef.current = {playlistId: parentPlaylistId, songs: playlist.songs.slice()};
                }
            }
            const songURL = await getSongURL(s3_key);
            if (songURL) {
                setCurrentSong({
                    _id: songId,
                    title: title,
                    artist: artist,
                    duration: duration,
                    uploaderId: uploaderId,
                    uploader: uploader,
                    s3_key: s3_key,
                    parentPlaylistId: parentPlaylistId
                });
                populateQueue(songId);
                cancelRef.current = false;
                if (!currentSong || currentSong.parentPlaylistId !== parentPlaylistId) {
                    playNewHowl(songURL, false, false);
                }
                else {
                    playNewHowl(songURL, true, false);
                }
            }
        } else {
            resumeHowl();
        }
    }

    const handlePauseSong = (e: React.MouseEvent) => {
        if (songDivRef.current) {
            const target = e.target as HTMLElement;
            if (target.classList.contains("song-dots-icon") || target.classList.contains("song-dots-path")) {
                return; 
            }
        }
        pauseHowl();
    }

    const handleOpenSongSettings = (e: React.MouseEvent<SVGSVGElement | HTMLDivElement>) => {
        openSongSettings(e, songId, title, artist, duration, uploaderId, uploader, s3_key, parentPlaylistId);
    }

    const handleSongClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        setPlaylistSettingsInfo(null);
        handleOpenSongSettings(e);

    }

    return (
        <div 
            className={currentSong?._id === songId && currentSong.parentPlaylistId === parentPlaylistId ? "song playing clickable" : "song not-playing clickable"}
            onDoubleClick={currentSong?._id === songId && currentSong.parentPlaylistId === parentPlaylistId && playing ? handlePauseSong : handlePlaySong}
            ref={songDivRef}
            onContextMenu={handleSongClick}
        >
            {
                currentSong?._id === songId && currentSong.parentPlaylistId === parentPlaylistId && playing 
                    ? PauseIcon(handlePauseSong)
                    : PlayIcon(handlePlaySong)
                
            }
            <span className="song-field song-title prevent-select overflow-ellipsis">{title}</span>
            <span className="song-field song-artist prevent-select overflow-ellipsis">{artist}</span>
            <span className="song-field song-duration prevent-select overflow-ellipsis">{`${formatDuration(duration)}`}</span>
            <span className="song-field song-uploader prevent-select overflow-ellipsis">{uploader}</span>
            {DotsIcon(handleOpenSongSettings, dotsRef)}
        </div>
    );
}