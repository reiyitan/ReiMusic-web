import "./SongsPanel.css";
import { useState, useRef, useLayoutEffect } from "react";
import { MouseEventHandler } from "react";
import { Song } from "../Song";
import { useLayout } from "../../ContextProviders";
import { SongType } from "../../types";

export const SongsPanel = () => {
    const { songs } = useLayout();
    const songListRef = useRef<HTMLDivElement | null>(null);
    const [categoriesWidth, setCategoriesWidth] = useState<number>(0);
    const { songsPanelType, currentPlaylist, openPlaylistSettings } = useLayout();

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

    const songsPanelHeaderRef = useRef<HTMLHeadingElement>(null);

    const handleOpenPlaylistSettings: MouseEventHandler<HTMLHeadingElement> = (e) => {
        if (!currentPlaylist) return;
        openPlaylistSettings(e, currentPlaylist._id, currentPlaylist.name);
    }

    return (
        <div className="main-container shadow" id="songs-panel">
                {!songsPanelType && <h1 className="prevent-select" id="songs-panel-header-nonplaylist">Open a playlist or search for some songs!</h1>}
                {songsPanelType === "search" && <h1 className="prevent-select" id="songs-panel-header-nonplaylist">Search results</h1>}
                {
                    songsPanelType === "playlist" && 
                    <>
                        <h1 
                            className="prevent-select clickable" 
                            id="songs-panel-header-playlist"
                            onClick={handleOpenPlaylistSettings}
                            role="button"
                            ref={songsPanelHeaderRef}
                        >
                            {currentPlaylist?.name}
                        </h1>
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