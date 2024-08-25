import { useState, useRef, useEffect } from "react";
import { Modal } from "../Modal";
import { TextInput } from "../TextInput";
import { useServer, useAuth, useLayout, useControl } from "../../ContextProviders";
import "./UploadSearchPanel.css"; 

const UploadIcon = () => (
    <svg 
        id="upload-icon" 
        className="upload-search-icon"
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

const SearchIcon = () => (
    <svg 
        id="search-icon"
        className="upload-search-icon"
        fill="none"
        viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)

export const UploadSearchPanel = () => {
    const [uploadMenuOpen, setUploadMenuOpen] = useState<boolean>(false);
    const [title, setTitle] = useState<string | undefined>(undefined); 
    const [artist, setArtist] = useState<string | undefined>(undefined); 
    const [file, setFile] = useState<File | undefined>(undefined);
    const [duration, setDuration] = useState<number | undefined>(undefined);
    const [msg, setMsg] = useState<string>("");
    const [searchValue, setSearchValue] = useState<string>(""); 
    const [showSearch, setShowSearch] = useState<boolean>(false);
    const searchRef = useRef<HTMLInputElement>(null);
    const searchDivRef = useRef<HTMLDivElement>(null);
    const { uploadSong, getUser, getSongs } = useServer();
    const { songsPanelType, setSongsPanelType, setSongs, registerCallback, setCurrentDisplayPlaylist } = useLayout();
    const { currentPlayingPlaylistRef } = useControl();
    const auth = useAuth();
    const [waiting, setWaiting] = useState<boolean>(false);

    const checkSearchClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (searchDivRef.current) {
            if (!searchDivRef.current.contains(e.target as Node)) {
                setShowSearch(false);
            }
        }
    }

    useEffect(() => {
        registerCallback("check-search-click", checkSearchClick);
    }, []);

    useEffect(() => {
        if (searchRef.current && showSearch) {
            searchRef.current.focus();
        }
    }, [showSearch]);

    const handleShowSearch = async () => {
        if (!showSearch) {
            setShowSearch(true);
        }
        if (songsPanelType !== "search") {
            setCurrentDisplayPlaylist(null);
            setSongsPanelType("search");
            setSearchValue("");
            const allSongs = (await getSongs()).map(song => {
                return { ...song, parentPlaylistId: "search" };
            })
            setSongs(allSongs);
            currentPlayingPlaylistRef.current = allSongs.slice();
        }
    }

    const handleSearchChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (e.target.value.length <= 50) setSearchValue(e.target.value);
    }

    const handleSearchKeydown = async (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            const newSongs = await getSongs(searchValue);
            if (newSongs) {
                setSongs(newSongs);
            }
        }
    }

    const closeUploadMenu = () => {
        setUploadMenuOpen(false);
        setTitle(""); 
        setArtist("");
        setMsg("");
    }

    const handleOpen: React.MouseEventHandler<HTMLDivElement> = (e) => {
        const clickedElement = e.target as HTMLElement; 
        if (clickedElement.tagName === "BUTTON") return;
        setUploadMenuOpen(true); 
    }

    const handleAddFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (!e.target.files) return;
        const selectedFile = e.target.files[0]
        const audioObject = new Audio(URL.createObjectURL(selectedFile));
        if (!audioObject) {
            setMsg("Error loading the file");
            return;
        }
        setMsg("");
        audioObject.onloadedmetadata = () => {
            setDuration(audioObject.duration);
        }
        setFile(selectedFile);
    }

    const handleUploadSong = async () => {
        if (!title || !artist) {
            setMsg("Fill out title and artist fields");
            return;
        }
        if (!file) {
            setMsg("Upload an .mp3 file");
            return;
        }
        if (file.type !== "audio/mpeg") {
            setMsg("Only .mp3 file type is supported");
            return;
        }
        if (file.size / (1024 * 1024) > 8) {
            setMsg("Files are limited to 8MB");
            return;
        }
        if (!duration || !auth.currentUser) {
            setMsg("There was an error uploading the file");
            return;
        }
        const user = await getUser(auth.currentUser.uid);
        if (!user) {
            setMsg("There was an error uploading the file"); 
            return;
        }
        setWaiting(true);
        uploadSong(title, artist, duration, file, user.username)
            .then(song => {
                console.log(song);
                setWaiting(false);
                closeUploadMenu();
            });
        //TODO create loading component and display while waiting
    }

    const handleTitleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (e.target.value.length <= 50) setTitle(e.target.value); 
    }

    const handleArtistChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (e.target.value.length <= 50) setArtist(e.target.value);
    }

    return (
        <div className="main-container shadow" id="upload-search-panel">
            <div 
                id="upload-container" 
                className="upload-search-panel-control"
                role="button"
                onClick={handleOpen}
            >
                {UploadIcon()}
                <p className="prevent-select">Upload</p>
                <Modal
                    isVisible={uploadMenuOpen}
                    header="Upload a song"
                >
                    <TextInput label="Title" value={title} handleInput={handleTitleChange} type="text" placeholder={undefined} />
                    <TextInput label="Artist" value={artist} handleInput={handleArtistChange} type="text" placeholder={undefined} />
                    <input 
                        id="upload-song-file-input"
                        type="file"
                        onChange={handleAddFile}
                    />
                    <p className="warning-msg" style={{marginBottom: "10px"}}>{msg}</p>
                    <button id={waiting ? "upload-button-waiting" : "upload-confirm-button"} onClick={handleUploadSong} disabled={waiting}>{waiting ? "Uploading..." : "Upload"}</button>
                    <button id={waiting ? "cancel-button-waiting" : "upload-cancel-button"} onClick={closeUploadMenu} disabled={waiting}>Cancel</button>
                </Modal>
            </div>
            <div 
                id="search-container" 
                className={showSearch ? "search-panel-selected" : "upload-search-panel-control"}
                role="button" 
                onClick={handleShowSearch}
                ref={searchDivRef}
            >
                {SearchIcon()}
                {
                    showSearch 
                    ? <input 
                        onChange={handleSearchChange}
                        onKeyDown={handleSearchKeydown}
                        ref={searchRef}
                        value={searchValue}
                        spellCheck={false}
                        placeholder="Search for songs"
                    />
                    : <p className="prevent-select">Search</p>
                }
            </div>
        </div>
    );
}