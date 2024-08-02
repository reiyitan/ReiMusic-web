import "./Song.css";

interface SongProps {
    title: string,
    artist: string,
    duration: string,
    uploader: string
}

export const Song = ({ title, artist, duration, uploader }: SongProps) => {
    return (
        <div className="song">
            <span className="song-field song-title">{title}</span>
            <span className="song-field song-artist">{artist}</span>
            <span className="song-field song-duration">{duration}</span>
            <span className="song-field song-uploader">{uploader}</span>
        </div>
    );
}