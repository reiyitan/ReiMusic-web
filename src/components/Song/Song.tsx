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
            <span className="song-field song-title prevent-select">{title}</span>
            <span className="song-field song-artist prevent-select">{artist}</span>
            <span className="song-field song-duration prevent-select">{duration}</span>
            <span className="song-field song-uploader prevent-select">{uploader}</span>
        </div>
    );
}