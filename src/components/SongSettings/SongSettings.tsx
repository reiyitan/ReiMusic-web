import { useEffect, useState, useLayoutEffect } from "react";
import { useLayout, useServer, useControl } from "../../ContextProviders";
import "./SongSettings.css";

const PlusIcon = () => (
    <svg 
        id="song-settings-plus-icon" 
        className="song-settings-control-icon"
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

const TrashIcon = () => (
    <svg 
        id="song-settings-trash-icon"
        className="song-settings-control-icon"
        viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M5 6.77273H9.2M19 6.77273H14.8M9.2 6.77273V5.5C9.2 4.94772 9.64772 4.5 10.2 4.5H13.8C14.3523 4.5 14.8 4.94772 14.8 5.5V6.77273M9.2 6.77273H14.8M6.4 8.59091V15.8636C6.4 17.5778 6.4 18.4349 6.94673 18.9675C7.49347 19.5 8.37342 19.5 10.1333 19.5H13.8667C15.6266 19.5 16.5065 19.5 17.0533 18.9675C17.6 18.4349 17.6 17.5778 17.6 15.8636V8.59091M9.2 10.4091V15.8636M12 10.4091V15.8636M14.8 10.4091V15.8636" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)

const ArrowIcon = () => (
    <svg 
        id="song-settings-arrow-icon"
        className="song-settings-control-icon"
        viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M6 11L6 4L10.5 7.5L6 11Z" />
    </svg>
)

const PlaylistOverlay = ({ isVisible }: { isVisible: boolean}) => {
    const { playlists, songSettingsInfo, setVanisherMsg, windowRef, songSettingsRef, songSettingsPos } = useLayout(); 
    const { addToPlaylist } = useServer();
    const { currentPlayingPlaylistRef, populateQueue } = useControl();
    const [overlayPos, setOverlayPos] = useState<{right: number, top: number}>({right: 0, top: 0});

    const updatePos = () => {
        if (windowRef.current && songSettingsRef.current) {
            const windowRect = windowRef.current.getBoundingClientRect(); 
            const containerRect = songSettingsRef.current.getBoundingClientRect(); 
            const rightEdge = containerRect.right + containerRect.width; 
            const rightPos = windowRect.right - rightEdge; 
            if (rightPos <= 0) {
                setOverlayPos({right: windowRect.right - containerRect.left, top: containerRect.top});
            }
            else {
                setOverlayPos({right: rightPos, top: containerRect.top});
            }
        }
    }

    useLayoutEffect(() => {
        updatePos();
    }, [isVisible, songSettingsPos]);

    const handleAddToPlaylist = (playlistId: string, playlistName: string) => {
        if (!songSettingsInfo) return;
        addToPlaylist(playlistId, songSettingsInfo._id)
            .then(status => {
                if (status === 403) {
                    setVanisherMsg("Song already in playlist");
                }
                else if (status === 204) {
                    if (playlistId === currentPlayingPlaylistRef.current.playlistId) {
                        currentPlayingPlaylistRef.current.songs.push({
                            _id: songSettingsInfo._id,
                            title: songSettingsInfo.title,
                            artist: songSettingsInfo.artist,
                            duration: songSettingsInfo.duration,
                            uploaderId: songSettingsInfo.uploaderId,
                            uploader: songSettingsInfo.uploader,
                            s3_key: songSettingsInfo.s3_key,
                            parentPlaylistId: playlistId
                        });
                        populateQueue(songSettingsInfo._id);
                    }
                    setVanisherMsg(`Added ${songSettingsInfo.title} to ${playlistName}`);
                }
            });
    }

    return isVisible && (
        <div 
            id="playlist-overlay" 
            className="shadow" 
            style={{
                right: overlayPos.right,
                top: overlayPos.top
            }}
        >
            <h1>
                Choose a playlist:
            </h1>
            <div id="playlist-overlay-playlists" className="scroller">
                {
                    playlists.filter(playlist => playlist._id !== songSettingsInfo?.parentPlaylistId).map(
                        playlist => (
                            <div
                                className="playlist-overlay-playlist prevent-select overflow-ellipsis"
                                role="button"
                                onClick={() => handleAddToPlaylist(playlist._id, playlist.name)}
                                key={playlist._id}
                            > 
                                {playlist.name}
                            </div>
                        )
                    )
                }
            </div>
        </div>
    );
}

export const SongSettings = () => {
    const { songSettingsInfo, setSongSettingsInfo, songSettingsRef, songSettingsPos, registerCallback, setSongs } = useLayout(); 
    const { currentPlayingPlaylistRef, populateQueue } = useControl();
    const [overlayVisible, setOverlayVisible] = useState<boolean>(false);
    const { removeFromPlaylist } = useServer();

    const handlePageClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (songSettingsRef.current) {
            const targetAsSVG = e.target as SVGElement;
            const targetAsHTML = e.target as HTMLElement; 
            if (
                !songSettingsRef.current.contains(e.target as Node) 
                && !targetAsSVG.classList.contains("song-dots-icon") 
                && !targetAsHTML.classList.contains("song-dots-path")
            ) {
                setSongSettingsInfo(null);
                setOverlayVisible(false);
            }
        }
    }

    const handleDeleteFromPlaylist = (songId: string, parentPlaylistId: string) => {
        if (songId.length === 0 || parentPlaylistId.length === 0) return; 
        removeFromPlaylist(parentPlaylistId, songId)
            .then(status => {
                if (status === 204) {
                    setSongSettingsInfo(null);
                    currentPlayingPlaylistRef.current.songs = currentPlayingPlaylistRef.current.songs.filter(song => song._id !== songId);
                    populateQueue(songId);
                    setSongs(prevSongs => {
                        return prevSongs.filter(song => song._id !== songId);
                    });
                }
            });
    }

    useEffect(() => {
        registerCallback("song-settings", handlePageClick);
    }, [songSettingsInfo]); 

    return (
        <div
            id="song-settings-menu"
            className={songSettingsInfo ? "visible shadow" : "hidden"}
            style={{
                left: songSettingsPos.left,
                top: songSettingsPos.top
            }}
            ref={songSettingsRef}
        >
            <div 
                className="settings-control"
                onMouseEnter={() => setOverlayVisible(true)}
            >
                {PlusIcon()}
                <p className="settings-control-add-to-playlist prevent-select">Add to a playlist</p>
                {ArrowIcon()}
                <PlaylistOverlay isVisible={overlayVisible} />
            </div>
            {
                songSettingsInfo?.parentPlaylistId !== "search" && 
                <div className="settings-control" 
                    onClick={() => handleDeleteFromPlaylist(songSettingsInfo?._id || "", songSettingsInfo?.parentPlaylistId || "")}
                    onMouseEnter={() => setOverlayVisible(false)}
                >
                    {TrashIcon()}
                    <p className="settings-control-text prevent-select">Remove from this playlist</p>
                </div>
            }
        </div>
    );
}