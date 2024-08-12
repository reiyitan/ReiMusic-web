import "./PlaylistSettings.css";
import { useState } from "react";
import { RefObject, Dispatch, SetStateAction, MouseEventHandler, ChangeEventHandler, MouseEvent } from "react";
import { Modal } from "../Modal";
import { useServer, useLayout } from "../../ContextProviders";

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

interface PositionInterface {
    left: number,
    top: number
}

interface PlaylistSettingsProps {
    name: string | undefined,
    playlistId: string | undefined,
    settingsOpen: boolean,
    setSettingsOpen: Dispatch<SetStateAction<boolean>>,
    renameModalVisible: boolean,
    setRenameModalVisible: Dispatch<SetStateAction<boolean>>,
    deleteModalVisible: boolean,
    setDeleteModalVisible: Dispatch<SetStateAction<boolean>>,
    settingsPanelPos: PositionInterface,
    settingsPanelRef: RefObject<HTMLDivElement>
}
export const PlaylistSettings = ({ 
    name, 
    playlistId, 
    settingsOpen, setSettingsOpen, 
    renameModalVisible, setRenameModalVisible,
    deleteModalVisible, setDeleteModalVisible,
    settingsPanelPos, 
    settingsPanelRef 
}: PlaylistSettingsProps) => {
    const [newName, setNewName] = useState<string>("");
    const { deletePlaylist, renamePlaylist } = useServer();
    const { setPlaylists } = useLayout();

    const handleDelete = () => {
        if (!playlistId) return;
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
        setSettingsOpen(false);
    }

    const handleInput: ChangeEventHandler<HTMLInputElement> = (e) => {
        if (newName.length === 30) {
            return;
        }
        setNewName(e.target.value);
    }

    const handleRename: MouseEventHandler<HTMLButtonElement> = () => {
        if (newName.trim().length === 0) return;
        if (!playlistId) return;
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
                    setSettingsOpen(false);
                    setNewName("");
                }
            });
    }

    const handleCancelRename: MouseEventHandler<HTMLButtonElement> = () => {
        setRenameModalVisible(false);
        setNewName("");
        setSettingsOpen(false);
    }

    return (
        <div 
            className={settingsOpen ? "playlist-settings-menu shadow visible" : "playlist-settings-menu hidden"}
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
                <input 
                    type="text"
                    onChange={handleInput}
                    value={newName}
                    placeholder={name}
                    autoCorrect="none"
                    spellCheck={false}
                />
                <button onClick={handleRename} className="rename-button-confirm">Confirm</button>
                <button onClick={handleCancelRename} className="cancel-button">Cancel</button>
            </Modal>
            <Modal isVisible={deleteModalVisible} header={`Delete ${name}`}>
                <button onClick={handleDelete} className="delete-button-confirm">Delete</button>
                <button onClick={handleCancelDelete} className="cancel-button">Cancel</button>
            </Modal>
        </div>
    );
}
