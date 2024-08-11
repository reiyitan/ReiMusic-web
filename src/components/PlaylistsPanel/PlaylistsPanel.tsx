import "./PlaylistsPanel.css";
import { useState, useEffect, useLayoutEffect, useRef } from "react"; 
import { ChangeEventHandler } from "react";
import { MouseEventHandler, RefObject } from "react";
import { Dispatch, SetStateAction } from "react";
import { useServer } from "../../ContextProviders";
import { Modal } from "../Modal";

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

const MinusIcon = () => (
    <svg 
        className="sidebar-playlist-control-icon sidebar-playlist-minus-icon"
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M6 12L18 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)

const RenameIcon = () => (
    <svg 
        className="sidebar-playlist-control-icon sidebar-playlist-rename-icon"
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
    >
        <path fillRule="evenodd" clipRule="evenodd" d="M8.56078 20.2501L20.5608 8.25011L15.7501 3.43945L3.75012 15.4395V20.2501H8.56078ZM15.7501 5.56077L18.4395 8.25011L16.5001 10.1895L13.8108 7.50013L15.7501 5.56077ZM12.7501 8.56079L15.4395 11.2501L7.93946 18.7501H5.25012L5.25012 16.0608L12.7501 8.56079Z" />
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
    playlistId: string,
    setPlaylists: Dispatch<SetStateAction<Playlist[]>>
}
const Playlist = ({ name, playlistId, setPlaylists }: PlaylistProps) => {
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
    const settingsPanelRef = useRef<HTMLDivElement>(null); 
    const [settingsPanelPos, setSettingsPanelPos] = useState<{left: number, top: number}>({left: 0, top: 0});
    const dotsRef = useRef<SVGSVGElement>(null);
    const { deletePlaylist, renamePlaylist } = useServer();
    const [renameModalVisible, setRenameModalVisible] = useState<boolean>(false);
    const [newName, setNewName] = useState<string>("");
    const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);

    const openSettings: MouseEventHandler<SVGSVGElement> = (e) => {
        setSettingsOpen(true);
        if (settingsPanelRef.current) {
            const settingsRect = settingsPanelRef.current.getBoundingClientRect();
            setSettingsPanelPos({left: e.clientX - settingsRect.width - 3, top: e.clientY + 3})
        }
    }

    const handleClick = (e: MouseEvent) => {
        if (settingsPanelRef.current && dotsRef.current) {
            if (!settingsPanelRef.current.contains(e.target as Node) && !dotsRef.current.contains(e.target as Node)) {
                setSettingsOpen(false);
            }
        }
    }
    useLayoutEffect(() => {
        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, []); 

    const handleDelete = () => {
        deletePlaylist(playlistId)
            .then(status => {
                if (status && status === 204) {
                    setPlaylists(prevPlaylists => {
                        const newPlaylists = prevPlaylists.filter(playlist => playlist._id !== playlistId); 
                        return newPlaylists;
                    });
                }
            })
    }

    const handleCancelDelete: MouseEventHandler<HTMLButtonElement> = () => {
        setDeleteModalVisible(false);
    }

    const handleInput: ChangeEventHandler<HTMLInputElement> = (e) => {
        if (newName.length === 30) {
            return;
        }
        setNewName(e.target.value);
    }

    const handleRename: MouseEventHandler<HTMLButtonElement> = () => {
        if (newName.trim().length === 0) return;
        renamePlaylist(playlistId, newName)
            .then(status => {
                if (status === 204) {
                    setPlaylists(oldPlaylists => {
                        const newPlaylists = oldPlaylists.map(playlist => (
                            playlist._id === playlistId ? { ...playlist, name: newName } : playlist
                        ));
                        return newPlaylists;
                    });
                    setRenameModalVisible(false);
                    setNewName("");
                }
            });
    }
    
    const handleCancelRename: MouseEventHandler<HTMLButtonElement> = () => {
        setRenameModalVisible(false);
        setNewName("");
    }

    return (
        <div 
            className="playlist"
        >
            <span className="sidebar-playlist-name prevent-select">{name}</span>
            {DotsIcon(openSettings, dotsRef)}
            <div 
                className={settingsOpen ? "sidebar-playlist-settings-menu shadow visible" : "sidebar-playlist-settings-menu hidden"}
                style={{
                    left: settingsPanelPos.left,
                    top: settingsPanelPos.top
                }}
                ref={settingsPanelRef}
            >
                <div className="settings-control" onClick={() => setRenameModalVisible(true)}>
                    {RenameIcon()}
                    <p className="settings-control-text prevent-select">Rename playlist</p>
                </div>
                <div className="settings-control" onClick={() => setDeleteModalVisible(true)}>
                    {MinusIcon()}
                    <p className="settings-control-text prevent-select">Delete playlist</p>
                </div>
            </div>
            <Modal isVisible={renameModalVisible} header="Rename playlist">
                <input 
                    type="text"
                    onChange={handleInput}
                    value={newName}
                    placeholder="Enter new name"
                    autoCorrect="none"
                />
                <button onClick={handleRename} className="rename-button-confirm">Confirm</button>
                <button onClick={handleCancelRename} className="cancel-button">Cancel</button>
            </Modal>
            <Modal isVisible={deleteModalVisible} header="Delete playlist">
                <button onClick={handleDelete} className="delete-button-confirm">Delete</button>
                <button onClick={handleCancelDelete} className="cancel-button">Cancel</button>
            </Modal>
        </div>
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
                <h1>Your Playlists</h1>
                {PlusIcon(handleCreatePlaylist)}
            </div>
            <div id="playlists-container" className="scroller">
                {
                    playlists.map((playlist) => (
                        <Playlist 
                            name={playlist.name} 
                            playlistId={playlist._id} 
                            key={playlist._id} 
                            setPlaylists={setPlaylists}
                        />
                    ))
                }
            </div>
        </div>
    );
}