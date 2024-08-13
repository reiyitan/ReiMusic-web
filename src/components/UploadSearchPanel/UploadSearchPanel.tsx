import { useState } from "react";
import { Modal } from "../Modal";
import { TextInput } from "../TextInput";
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
    const [title, setTitle] = useState<string>(""); 
    const [artist, setArtist] = useState<string>(""); 

    const [searchValue, setSearchValue] = useState<string>(""); 

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (e.target.value.length <= 30) setSearchValue(e.target.value);
    }

    const closeUploadMenu = () => {
        setUploadMenuOpen(false);
        setTitle(""); 
        setArtist("");
    }

    const handleOpen: React.MouseEventHandler<HTMLDivElement> = (e) => {
        const clickedElement = e.target as HTMLElement; 
        if (clickedElement.tagName === "BUTTON") return;
        setUploadMenuOpen(true); 
    }

    const handleUploadSong = () => {
        //remember to trim the input
    }

    const handleTitleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (e.target.value.length <= 30) setTitle(e.target.value); 
    }

    const handleArtistChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (e.target.value.length <= 30) setArtist(e.target.value);
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
                    />
                    <button id="upload-confirm-button" onClick={handleUploadSong}>Upload</button>
                    <button id="upload-cancel-button" onClick={closeUploadMenu}>Cancel</button>
                </Modal>
            </div>
            <div id="search-container" className="upload-search-panel-control">
                {SearchIcon()}
                <input 
                    onChange={handleChange}
                    value={searchValue}
                    spellCheck={false}
                    placeholder="Search for songs"
                />
            </div>
        </div>
    );
}