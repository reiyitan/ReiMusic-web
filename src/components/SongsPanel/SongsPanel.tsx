import "./SongsPanel.css";
import { useState, useRef, useLayoutEffect } from "react";
import { MouseEventHandler } from "react";
import { Song } from "../Song";
import { useLayout } from "../../ContextProviders";

export const SongsPanel = () => {
    const { songs } = useLayout();
    const songListRef = useRef<HTMLDivElement | null>(null);
    const [categoriesWidth, setCategoriesWidth] = useState<number>(0);
    const { songsPanelType, currentDisplayPlaylist, openPlaylistSettings } = useLayout();

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
        if (!currentDisplayPlaylist) return;
        openPlaylistSettings(e, currentDisplayPlaylist._id, currentDisplayPlaylist.name);
    }

    return (
        <div className="main-container shadow" id="songs-panel">
                {
                    (!songsPanelType || songsPanelType === "search")
                    && <>
                        <h1 className="prevent-select" id="songs-panel-header-nonplaylist">
                            Search for songs
                        </h1>
                    </>
                }
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
                            {currentDisplayPlaylist?.name}
                        </h1>
                    </>
                }
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
                <div id="song-list" className="scroller" ref={songListRef}>
                    {
                        songs.map(song => (
                            <Song 
                                songId={song._id}
                                title={song.title}
                                artist={song.artist}
                                duration={song.duration}
                                uploaderId={song.uploaderId}
                                uploader={song.uploader}
                                s3_key={song.s3_key}
                                parentPlaylistId={song.parentPlaylistId}
                                key={song._id}
                            />
                        ))
                    }
                </div>
            </div>
    );
}