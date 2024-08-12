import "./SongsPanel.css";
import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { MouseEventHandler, MouseEvent } from "react";
import { Song } from "../Song";
import { PlaylistSettings } from "../PlaylistSettings";
import { useLayout } from "../../ContextProviders";
import { SongType } from "../../types";

export const SongsPanel = () => {
    const { songs } = useLayout();
    const songListRef = useRef<HTMLDivElement | null>(null);
    const [categoriesWidth, setCategoriesWidth] = useState<number>(0);
    const { songsPanelType, currentPlaylist, registerCallback } = useLayout();

    const updateCategoriesWidth = () => {
        if (songListRef.current) {
            const container = songListRef.current;
            setCategoriesWidth(container.clientWidth);
        }
    }

    useLayoutEffect(() => {
        updateCategoriesWidth();

        window.addEventListener("resize", updateCategoriesWidth);
        return () => window.removeEventListener("resize", updateCategoriesWidth);
    }, []);

    const [playlistSettingsOpen, setPlaylistSettingsOpen] = useState<boolean>(false);
    const settingsPanelRef = useRef<HTMLDivElement>(null); 
    const songsPanelHeaderRef = useRef<HTMLHeadingElement>(null);
    const [settingsPanelPos, setSettingsPanelPos] = useState<{left: number, top: number}>({left: 0, top: 0});
    const [renameModalVisible, setRenameModalVisible] = useState<boolean>(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
    const openPlaylistSettings: MouseEventHandler<HTMLHeadingElement> = (e) => {
        setPlaylistSettingsOpen(true);
        if (settingsPanelRef.current) {
            const settingsRect = settingsPanelRef.current.getBoundingClientRect();
            setSettingsPanelPos({left: e.clientX - settingsRect.width - 3, top: e.clientY + 3})
        }
    }

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
        if (deleteModalVisible || renameModalVisible) return;
        if (settingsPanelRef.current && songsPanelHeaderRef.current) {
            if (!settingsPanelRef.current.contains(e.target as Node) && !songsPanelHeaderRef.current.contains(e.target as Node)) {
                setPlaylistSettingsOpen(false);
            }
        }
    }

    useEffect(() => {
        if (currentPlaylist) {
            registerCallback(`${currentPlaylist._id}-songslist`, handleClick);
        }
    }, [playlistSettingsOpen, renameModalVisible, deleteModalVisible]); 

    return (
        <div className="main-container shadow" id="songs-panel">
                {!songsPanelType && <h1 className="prevent-select" id="songs-panel-header-nonplaylist">Open a playlist or search for some songs!</h1>}
                {songsPanelType === "search" && <h1 className="prevent-select" id="songs-panel-header-nonplaylist">Search results</h1>}
                {
                    songsPanelType === "playlist" && 
                    <>
                        <h1 
                            className="prevent-select" 
                            id="songs-panel-header-playlist"
                            onClick={openPlaylistSettings}
                            role="button"
                            ref={songsPanelHeaderRef}
                        >
                            {currentPlaylist?.name}
                        </h1>
                        <PlaylistSettings 
                            name={currentPlaylist?.name}
                            playlistId={currentPlaylist?._id}
                            settingsOpen={playlistSettingsOpen}
                            setSettingsOpen={setPlaylistSettingsOpen}
                            renameModalVisible={renameModalVisible}
                            setRenameModalVisible={setRenameModalVisible}
                            deleteModalVisible={deleteModalVisible}
                            setDeleteModalVisible={setDeleteModalVisible}
                            settingsPanelPos={settingsPanelPos}
                            settingsPanelRef={settingsPanelRef}
                        />
                    </>
                }
                {
                    (songsPanelType === "playlist" || songsPanelType === "search") &&
                    <div id="song-list-categories-container">
                        <div 
                            id="song-list-categories"
                            style={{
                                width: categoriesWidth
                            }}
                        >
                            <span id="song-list-category-title" className="song-list-category prevent-select">Title</span>
                            <span id="song-list-category-artist" className="song-list-category prevent-select">Artist</span>
                            <span id="song-list-category-duration" className="song-list-category prevent-select">Duration</span>
                            <span id="song-list-category-uploader" className="song-list-category prevent-select">Uploader</span>
                            <span id="song-list-category-settings-filler"></span>
                        </div>
                        <span id="song-list-category-filler" className="song-list-category"></span>
                    </div>
                }
                <div id="song-list" className="scroller" ref={songListRef}>
                    {
                        songs.map(song => (
                            <Song 
                                title={song.title}
                                artist={song.artist}
                                duration={song.duration}
                                uploader={song.uploader}
                                key={song.title}
                            />
                        ))
                    }
                </div>
            </div>
    );
}