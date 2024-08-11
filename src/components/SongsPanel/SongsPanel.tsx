import "./SongsPanel.css";
import { useState, useRef, useLayoutEffect } from "react";
import { tempsongs } from "./tempdata";
import { Song } from "../Song";
interface Song {
    title: string,
    artist: string,
    duration: string,
    uploader: string
}

export const SongsPanel = () => {
    const [songs, setSongs] = useState<Song[]>(tempsongs);
    const songListRef = useRef<HTMLDivElement | null>(null);
    const [categoriesWidth, setCategoriesWidth] = useState<number>(0);

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

    return (
        <div className="main-container shadow" id="songs-panel">
                <h1 className="prevent-select">Playlist Title</h1>
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