import "./PlaylistSettings.css";
import { useState, useEffect } from "react";
import { MouseEventHandler, ChangeEventHandler, MouseEvent } from "react";
import { Modal } from "../Modal";
import { TextInput } from "../TextInput";
import { useServer, useLayout, useControl } from "../../ContextProviders";
import { PlaylistType } from "../../types";

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

export const PlaylistSettings = () => {
    const [newName, setNewName] = useState<string>("");
    const { deletePlaylist, renamePlaylist, getSongs } = useServer();
    const { 
        setPlaylists, 
        currentDisplayPlaylist, 
        setCurrentDisplayPlaylist, 
        setSongsPanelType, 
        playlistSettingsInfo, setPlaylistSettingsInfo,
        settingsPanelPos,
        settingsPanelRef,
        registerCallback,
        setSongs
    } = useLayout();
    const { currentPlayingPlaylistRef } = useControl();
    const [renameModalVisible, setRenameModalVisible] = useState<boolean>(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);

    const handlePageClick = (e: MouseEvent<HTMLDivElement>) => {
        if (deleteModalVisible || renameModalVisible) return;
        if (settingsPanelRef.current) {
            const targetAsSVG = e.target as SVGElement;
            const targetAsHeading = e.target as HTMLHeadingElement;
            const targetAsHTML = e.target as HTMLElement; 
            if (!settingsPanelRef.current.contains(e.target as Node) 
                && !targetAsSVG.classList.contains("sidebar-playlist-dots-icon") 
                && targetAsHeading.id !== "songs-panel-header-playlist"
                && !targetAsHTML.parentElement?.classList.contains("sidebar-playlist-dots-icon")
            ) {
                setPlaylistSettingsInfo(null);
            }
        }
    }

    useEffect(() => {
        registerCallback("playlist-settings", handlePageClick);
    }, [playlistSettingsInfo, renameModalVisible, deleteModalVisible]); 

    const closePanel = () => {
        setDeleteModalVisible(false);
        setRenameModalVisible(false);
        setPlaylistSettingsInfo(null);
        setNewName("");
    }

    const handleDelete = () => {
        if (!playlistSettingsInfo) return;
        deletePlaylist(playlistSettingsInfo.playlistId)
            .then(async status => {
                if (status && status === 204) {
                    setPlaylists(prevPlaylists => {
                        const newPlaylists = prevPlaylists.filter(playlist => playlist._id !== playlistSettingsInfo.playlistId); 
                        return newPlaylists;
                    });
                    setSongsPanelType("search");
                    const newSongs = await getSongs(); 
                    setSongs(newSongs); 
                    currentPlayingPlaylistRef.current = newSongs.slice();
                    closePanel();
                }
            })
    }

    const handleInput: ChangeEventHandler<HTMLInputElement> = (e) => {
        if (e.target.value.length <= 30) setNewName(e.target.value);
    }

    const handleRename: MouseEventHandler<HTMLButtonElement> = () => {
        if (newName.trim().length === 0 || !playlistSettingsInfo) return;
        renamePlaylist(playlistSettingsInfo.playlistId, newName)
            .then(status => {
                if (status === 204) {
                    setPlaylists(oldPlaylists => {
                        const newPlaylists = oldPlaylists.map(playlist => (
                            playlist._id === playlistSettingsInfo.playlistId ? { ...playlist, name: newName } : playlist
                        ));
                        return newPlaylists;
                    });
                    if (currentDisplayPlaylist?._id === playlistSettingsInfo.playlistId) {
                        setCurrentDisplayPlaylist(prev => {
                            if (prev) {
                                return ({ ...prev, name: newName })
                            }
                            else return null;
                        });
                    }
                    closePanel();
                }
            });
    }

    return (
        <div 
            className={playlistSettingsInfo ? "playlist-settings-menu shadow visible" : "playlist-settings-menu shadow hidden"}
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
            <Modal isVisible={renameModalVisible} header="Rename playlist">
                <TextInput 
                    label={undefined}
                    value={newName}
                    handleInput={handleInput}
                    type="text"
                    placeholder={playlistSettingsInfo?.playlistName}
                />
                <button onClick={handleRename} className="rename-button-confirm">Confirm</button>
                <button onClick={closePanel} className="cancel-button">Cancel</button>
            </Modal>
            <Modal isVisible={deleteModalVisible} header={`Delete ${playlistSettingsInfo?.playlistName}`}>
                <button onClick={handleDelete} className="delete-button-confirm">Delete</button>
                <button onClick={closePanel} className="cancel-button">Cancel</button>
            </Modal>
        </div>
    );
}
