import "./TopPanel.css"; 
import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { Dispatch, SetStateAction } from "react";
import { useFirebase, useLayout, useServer } from "../../ContextProviders";
import { Modal } from "../Modal";
import { SongType } from "../../types";

const ProfileIcon = () => (
    <svg id="profile-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 12C22 6.49 17.51 2 12 2C6.49 2 2 6.49 2 12C2 14.9 3.25 17.51 5.23 19.34C5.23 19.35 5.23 19.35 5.22 19.36C5.32 19.46 5.44 19.54 5.54 19.63C5.6 19.68 5.65 19.73 5.71 19.77C5.89 19.92 6.09 20.06 6.28 20.2C6.35 20.25 6.41 20.29 6.48 20.34C6.67 20.47 6.87 20.59 7.08 20.7C7.15 20.74 7.23 20.79 7.3 20.83C7.5 20.94 7.71 21.04 7.93 21.13C8.01 21.17 8.09 21.21 8.17 21.24C8.39 21.33 8.61 21.41 8.83 21.48C8.91 21.51 8.99 21.54 9.07 21.56C9.31 21.63 9.55 21.69 9.79 21.75C9.86 21.77 9.93 21.79 10.01 21.8C10.29 21.86 10.57 21.9 10.86 21.93C10.9 21.93 10.94 21.94 10.98 21.95C11.32 21.98 11.66 22 12 22C12.34 22 12.68 21.98 13.01 21.95C13.05 21.95 13.09 21.94 13.13 21.93C13.42 21.9 13.7 21.86 13.98 21.8C14.05 21.79 14.12 21.76 14.2 21.75C14.44 21.69 14.69 21.64 14.92 21.56C15 21.53 15.08 21.5 15.16 21.48C15.38 21.4 15.61 21.33 15.82 21.24C15.9 21.21 15.98 21.17 16.06 21.13C16.27 21.04 16.48 20.94 16.69 20.83C16.77 20.79 16.84 20.74 16.91 20.7C17.11 20.58 17.31 20.47 17.51 20.34C17.58 20.3 17.64 20.25 17.71 20.2C17.91 20.06 18.1 19.92 18.28 19.77C18.34 19.72 18.39 19.67 18.45 19.63C18.56 19.54 18.67 19.45 18.77 19.36C18.77 19.35 18.77 19.35 18.76 19.34C20.75 17.51 22 14.9 22 12ZM16.94 16.97C14.23 15.15 9.79 15.15 7.06 16.97C6.62 17.26 6.26 17.6 5.96 17.97C4.44 16.43 3.5 14.32 3.5 12C3.5 7.31 7.31 3.5 12 3.5C16.69 3.5 20.5 7.31 20.5 12C20.5 14.32 19.56 16.43 18.04 17.97C17.75 17.6 17.38 17.26 16.94 16.97Z" fill="#FFFFFF"/>
        <path d="M12 6.92969C9.93 6.92969 8.25 8.60969 8.25 10.6797C8.25 12.7097 9.84 14.3597 11.95 14.4197C11.98 14.4197 12.02 14.4197 12.04 14.4197C12.06 14.4197 12.09 14.4197 12.11 14.4197C12.12 14.4197 12.13 14.4197 12.13 14.4197C14.15 14.3497 15.74 12.7097 15.75 10.6797C15.75 8.60969 14.07 6.92969 12 6.92969Z" fill="#FFFFFF"/>
    </svg>
)

const TrashIcon = (handleClick: React.MouseEventHandler<SVGSVGElement>) => (
    <svg 
        className="song-manager-trash-icon"
        viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
        onClick={handleClick}
        role="button"
    >
        <path d="M5 6.77273H9.2M19 6.77273H14.8M9.2 6.77273V5.5C9.2 4.94772 9.64772 4.5 10.2 4.5H13.8C14.3523 4.5 14.8 4.94772 14.8 5.5V6.77273M9.2 6.77273H14.8M6.4 8.59091V15.8636C6.4 17.5778 6.4 18.4349 6.94673 18.9675C7.49347 19.5 8.37342 19.5 10.1333 19.5H13.8667C15.6266 19.5 16.5065 19.5 17.0533 18.9675C17.6 18.4349 17.6 17.5778 17.6 15.8636V8.59091M9.2 10.4091V15.8636M12 10.4091V15.8636M14.8 10.4091V15.8636" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)

const UserSong = ({ songId, s3_key, title, artist, setUserSongs }: { songId: string, s3_key: string, title: string, artist: string, setUserSongs: Dispatch<SetStateAction<SongType[]>>}) => {
    const { deleteSong } = useServer();

    const handleDelete: React.EventHandler<React.MouseEvent<SVGSVGElement>> = () => {
        deleteSong(songId, s3_key)
            .then(res => {
                if (res === 204) {
                    setUserSongs(prevSongs => {
                        return prevSongs.filter(song => song._id !== songId);
                    });
                }
            });
    }

    return (
        <div className="user-song">
            <span className="overflow-ellipsis prevent-select">{title}</span>
            <span className="user-song-artist overflow-ellipsis prevent-select">{artist}</span>
            {TrashIcon(handleDelete)}
        </div>
    );
}

export const TopPanel = () => {
    const { username, logout } = useFirebase(); 
    const { getUserSongs } = useServer();
    const menuOpenRef = useRef<boolean>(false);
    const [menuPos, setMenuPos] = useState<{right: number, top: number}>({right: 0, top: 0});
    const containerRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const { windowRef, registerCallback, profileMenuOpen, setProfileMenuOpen } = useLayout();
    const [songManagerOpen, setSongManagerOpen] = useState<boolean>(false);
    const songManagerOpenRef = useRef<boolean>(songManagerOpen);
    const [userSongs, setUserSongs] = useState<SongType[]>([]);

    useEffect(() => {
        songManagerOpenRef.current = songManagerOpen;
        if (songManagerOpen) {
            getUserSongs()
                .then(newSongs => {
                    setUserSongs(newSongs)
                })
        }
    }, [songManagerOpen]);

    useEffect(() => {
        menuOpenRef.current = profileMenuOpen;
    }, [profileMenuOpen]);

    const updateMenuPos = () => {
        if (containerRef.current && windowRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect(); 
            const windowRect = windowRef.current.getBoundingClientRect(); 
            setMenuPos({right: windowRect.right - containerRect.right, top: containerRect.top + containerRect.height + 1});
        }
    }

    useLayoutEffect(() => {
        updateMenuPos();
    }, [profileMenuOpen]);

    const handlePageClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (songManagerOpenRef.current) return;
        if (menuRef.current && menuOpenRef.current) {
            if (!menuRef.current.contains(e.target as Node)) {
                setProfileMenuOpen(false);
            }
        }
    }

    useEffect(() => {
        registerCallback("profile-menu", handlePageClick);
    }, []);

    const closeSongManager = () => {
        setSongManagerOpen(false);
        setProfileMenuOpen(false);
    }

    return (
        <div id="top-panel">
            <div id="top-panel-center">
                <h1 className="prevent-select shadow">Reidio</h1>
            </div>
            <div id="top-panel-right"> 
                <div 
                    onClick={() => setProfileMenuOpen(true)}
                    id="profile" className="shadow prevent-select"
                    ref={containerRef}
                >
                    {ProfileIcon()}
                    <span id="profile-username" className="overflow-ellipsis">{username}</span>
                </div>
                <div 
                    id="profile-menu" className={profileMenuOpen ? "visible shadow" : "hidden"}
                    style={{
                        right: menuPos.right,
                        top: menuPos.top
                    }}
                    ref={menuRef}
                >
                    <div 
                        className="profile-menu-button prevent-select"
                        onClick={() => setSongManagerOpen(true)}
                    >
                        Manage uploaded songs
                    </div>
                    <div className="profile-menu-button prevent-select" onClick={logout}>Log out</div>
                </div>
            </div>
            <Modal isVisible={songManagerOpen} header="Your songs:">
                <div id="user-songs-container" className="scroller">
                    {
                        userSongs.map(song => {
                            return <UserSong 
                                songId={song._id}
                                s3_key={song.s3_key}
                                title={song.title}
                                artist={song.artist}
                                key={song._id}
                                setUserSongs={setUserSongs}
                            />
                        })
                    }
                </div>
                <button id="song-manager-btn" className="prevent-select" onClick={closeSongManager}>Close</button>
            </Modal>
        </div>
    );
}