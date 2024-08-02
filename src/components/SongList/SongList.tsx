import "./SongList.css";
import { useState, useRef, useLayoutEffect } from "react";
import { tempsongs } from "./tempdata";
import { Song } from "../Song";

interface Song {
    title: string,
    artist: string,
    duration: string,
    uploader: string
}

export const SongList = () => {
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
        <div className="picto-container" id="song-list-container">
                <h1>Playlist Title</h1>
                <div id="song-list-categories-container">
                    <div 
                        id="song-list-categories"
                        style={{
                            width: categoriesWidth
                        }}
                    >
                        <span id="song-list-category-title" className="song-list-category">Title</span>
                        <span id="song-list-category-artist" className="song-list-category">Artist</span>
                        <span id="song-list-category-duration" className="song-list-category">Duration</span>
                        <span id="song-list-category-uploader" className="song-list-category">Uploader</span>
                    </div>
                    <span id="song-list-category-filler" className="song-list-category"></span>
                </div>
                <div id="song-list" ref={songListRef}>
                    {
                        songs.map(song => (
                            <Song 
                                title={song.title}
                                artist={song.artist}
                                duration={song.duration}
                                uploader={song.uploader}
                            />
                        ))
                    }
                </div>
            </div>
    );

}