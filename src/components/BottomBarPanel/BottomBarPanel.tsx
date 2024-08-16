import "./BottomBarPanel.css"; 
import { useEffect, useState } from "react";
import { MouseEventHandler } from "react";
import { useControl, useLayout } from "../../ContextProviders";
import { Range, getTrackBackground } from "react-range";

const PlayIcon = (handleClick: MouseEventHandler<SVGSVGElement>) => (
    <svg 
        id="bottom-bar-play-icon" 
        onClick={handleClick}
        role="button"
        viewBox="0 0 32 32" 
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M10.968 23V9l12.762 7-12.762 7z"/>
    </svg>
)

const PauseIcon = (handleClick: MouseEventHandler<SVGSVGElement>) => (
    <svg 
        id="bottom-bar-pause-icon"
        onClick={handleClick} 
        role="button"
        viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M8 5V19M16 5V19" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)

const BackIcon = (handleClick: MouseEventHandler<SVGSVGElement>) => (
    <svg 
        id="bottom-bar-back-icon"
        onClick={handleClick} 
        role="button"
        viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
    >
        <path fillRule="evenodd" clipRule="evenodd" d="M12.0476 13.5826L4.5 17.9402C3.83333 18.3251 3 17.844 3 17.0742V8.00152C3 7.23171 3.83333 6.75059 4.5 7.13549L12.0476 11.4931V8.00151C12.0476 7.23171 12.881 6.75058 13.5476 7.13548L21.4048 11.6718C22.0714 12.0567 22.0714 13.019 21.4048 13.4039L13.5476 17.9402C12.881 18.3251 12.0476 17.844 12.0476 17.0742V13.5826Z"/>
    </svg>
)

const SkipIcon = (handleClick: MouseEventHandler<SVGSVGElement>) => (
    <svg 
        id="bottom-bar-skip-icon"
        onClick={handleClick} 
        role="button"
        viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
    >
        <path fillRule="evenodd" clipRule="evenodd" d="M12.0476 13.5826L4.5 17.9402C3.83333 18.3251 3 17.844 3 17.0742V8.00152C3 7.23171 3.83333 6.75059 4.5 7.13549L12.0476 11.4931V8.00151C12.0476 7.23171 12.881 6.75058 13.5476 7.13548L21.4048 11.6718C22.0714 12.0567 22.0714 13.019 21.4048 13.4039L13.5476 17.9402C12.881 18.3251 12.0476 17.844 12.0476 17.0742V13.5826Z"/>
    </svg>
)

const LoopIcon = (handleClick: MouseEventHandler<SVGSVGElement>, loop: boolean) => (
    <svg 
        id={loop ? "bottom-bar-loop-icon-active" : "bottom-bar-loop-icon-inactive"}
        onClick={handleClick}
        role="button"
        viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M18 4L21 7M21 7L18 10M21 7H7C4.79086 7 3 8.79086 3 11M6 20L3 17M3 17L6 14M3 17H17C19.2091 17 21 15.2091 21 13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)

const ShuffleIcon = (handleClick: MouseEventHandler<SVGSVGElement>, shuffle: boolean) => (
    <svg 
        id={shuffle ? "bottom-bar-shuffle-icon-active" : "bottom-bar-shuffle-icon-inactive"}
        onClick={handleClick} 
        role="button"
        viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M16.4697 9.46967C16.1768 9.76256 16.1768 10.2374 16.4697 10.5303C16.7626 10.8232 17.2374 10.8232 17.5303 10.5303L16.4697 9.46967ZM19.5303 8.53033C19.8232 8.23744 19.8232 7.76256 19.5303 7.46967C19.2374 7.17678 18.7626 7.17678 18.4697 7.46967L19.5303 8.53033ZM18.4697 8.53033C18.7626 8.82322 19.2374 8.82322 19.5303 8.53033C19.8232 8.23744 19.8232 7.76256 19.5303 7.46967L18.4697 8.53033ZM17.5303 5.46967C17.2374 5.17678 16.7626 5.17678 16.4697 5.46967C16.1768 5.76256 16.1768 6.23744 16.4697 6.53033L17.5303 5.46967ZM19 8.75C19.4142 8.75 19.75 8.41421 19.75 8C19.75 7.58579 19.4142 7.25 19 7.25V8.75ZM16.7 8L16.6993 8.75H16.7V8ZM12.518 10.252L13.1446 10.6642L13.1446 10.6642L12.518 10.252ZM10.7414 11.5878C10.5138 11.9338 10.6097 12.3989 10.9558 12.6266C11.3018 12.8542 11.7669 12.7583 11.9946 12.4122L10.7414 11.5878ZM11.9946 12.4122C12.2222 12.0662 12.1263 11.6011 11.7802 11.3734C11.4342 11.1458 10.9691 11.2417 10.7414 11.5878L11.9946 12.4122ZM10.218 13.748L9.59144 13.3358L9.59143 13.3358L10.218 13.748ZM6.041 16V16.75H6.04102L6.041 16ZM5 15.25C4.58579 15.25 4.25 15.5858 4.25 16C4.25 16.4142 4.58579 16.75 5 16.75V15.25ZM11.9946 11.5878C11.7669 11.2417 11.3018 11.1458 10.9558 11.3734C10.6097 11.6011 10.5138 12.0662 10.7414 12.4122L11.9946 11.5878ZM12.518 13.748L13.1446 13.3358L13.1446 13.3358L12.518 13.748ZM16.7 16V15.25H16.6993L16.7 16ZM19 16.75C19.4142 16.75 19.75 16.4142 19.75 16C19.75 15.5858 19.4142 15.25 19 15.25V16.75ZM10.7414 12.4122C10.9691 12.7583 11.4342 12.8542 11.7802 12.6266C12.1263 12.3989 12.2222 11.9338 11.9946 11.5878L10.7414 12.4122ZM10.218 10.252L9.59143 10.6642L9.59144 10.6642L10.218 10.252ZM6.041 8L6.04102 7.25H6.041V8ZM5 7.25C4.58579 7.25 4.25 7.58579 4.25 8C4.25 8.41421 4.58579 8.75 5 8.75V7.25ZM17.5303 13.4697C17.2374 13.1768 16.7626 13.1768 16.4697 13.4697C16.1768 13.7626 16.1768 14.2374 16.4697 14.5303L17.5303 13.4697ZM18.4697 16.5303C18.7626 16.8232 19.2374 16.8232 19.5303 16.5303C19.8232 16.2374 19.8232 15.7626 19.5303 15.4697L18.4697 16.5303ZM19.5303 16.5303C19.8232 16.2374 19.8232 15.7626 19.5303 15.4697C19.2374 15.1768 18.7626 15.1768 18.4697 15.4697L19.5303 16.5303ZM16.4697 17.4697C16.1768 17.7626 16.1768 18.2374 16.4697 18.5303C16.7626 18.8232 17.2374 18.8232 17.5303 18.5303L16.4697 17.4697ZM17.5303 10.5303L19.5303 8.53033L18.4697 7.46967L16.4697 9.46967L17.5303 10.5303ZM19.5303 7.46967L17.5303 5.46967L16.4697 6.53033L18.4697 8.53033L19.5303 7.46967ZM19 7.25H16.7V8.75H19V7.25ZM16.7007 7.25C14.7638 7.24812 12.956 8.22159 11.8914 9.8398L13.1446 10.6642C13.9314 9.46813 15.2676 8.74861 16.6993 8.75L16.7007 7.25ZM11.8914 9.83979L10.7414 11.5878L11.9946 12.4122L13.1446 10.6642L11.8914 9.83979ZM10.7414 11.5878L9.59144 13.3358L10.8446 14.1602L11.9946 12.4122L10.7414 11.5878ZM9.59143 13.3358C8.80541 14.5306 7.47115 15.25 6.04098 15.25L6.04102 16.75C7.97596 16.7499 9.78113 15.7767 10.8446 14.1602L9.59143 13.3358ZM6.041 15.25H5V16.75H6.041V15.25ZM10.7414 12.4122L11.8914 14.1602L13.1446 13.3358L11.9946 11.5878L10.7414 12.4122ZM11.8914 14.1602C12.956 15.7784 14.7638 16.7519 16.7007 16.75L16.6993 15.25C15.2676 15.2514 13.9314 14.5319 13.1446 13.3358L11.8914 14.1602ZM16.7 16.75H19V15.25H16.7V16.75ZM11.9946 11.5878L10.8446 9.83979L9.59144 10.6642L10.7414 12.4122L11.9946 11.5878ZM10.8446 9.8398C9.78113 8.2233 7.97596 7.25005 6.04102 7.25L6.04098 8.75C7.47115 8.75004 8.80541 9.46939 9.59143 10.6642L10.8446 9.8398ZM6.041 7.25H5V8.75H6.041V7.25ZM16.4697 14.5303L18.4697 16.5303L19.5303 15.4697L17.5303 13.4697L16.4697 14.5303ZM18.4697 15.4697L16.4697 17.4697L17.5303 18.5303L19.5303 16.5303L18.4697 15.4697Z"/>
    </svg>
)

const MuteIcon = (handleClick: MouseEventHandler<SVGSVGElement>) => (
    <svg 
        onClick={handleClick}
        role="button"
        className="volume-icon"
        viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M16 9.50009L21 14.5001M21 9.50009L16 14.5001M4.6 9.00009H5.5012C6.05213 9.00009 6.32759 9.00009 6.58285 8.93141C6.80903 8.87056 7.02275 8.77046 7.21429 8.63566C7.43047 8.48353 7.60681 8.27191 7.95951 7.84868L10.5854 4.69758C11.0211 4.17476 11.2389 3.91335 11.4292 3.88614C11.594 3.86258 11.7597 3.92258 11.8712 4.04617C12 4.18889 12 4.52917 12 5.20973V18.7904C12 19.471 12 19.8113 11.8712 19.954C11.7597 20.0776 11.594 20.1376 11.4292 20.114C11.239 20.0868 11.0211 19.8254 10.5854 19.3026L7.95951 16.1515C7.60681 15.7283 7.43047 15.5166 7.21429 15.3645C7.02275 15.2297 6.80903 15.1296 6.58285 15.0688C6.32759 15.0001 6.05213 15.0001 5.5012 15.0001H4.6C4.03995 15.0001 3.75992 15.0001 3.54601 14.8911C3.35785 14.7952 3.20487 14.6422 3.10899 14.4541C3 14.2402 3 13.9601 3 13.4001V10.6001C3 10.04 3 9.76001 3.10899 9.54609C3.20487 9.35793 3.35785 9.20495 3.54601 9.10908C3.75992 9.00009 4.03995 9.00009 4.6 9.00009Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)
const MidVolumeIcon = (handleClick: MouseEventHandler<SVGSVGElement>) => (
    <svg 
        onClick={handleClick}
        role="button"
        className="volume-icon"
        viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M18 9.00009C18.6277 9.83575 18.9996 10.8745 18.9996 12.0001C18.9996 13.1257 18.6277 14.1644 18 15.0001M6.6 9.00009H7.5012C8.05213 9.00009 8.32759 9.00009 8.58285 8.93141C8.80903 8.87056 9.02275 8.77046 9.21429 8.63566C9.43047 8.48353 9.60681 8.27191 9.95951 7.84868L12.5854 4.69758C13.0211 4.17476 13.2389 3.91335 13.4292 3.88614C13.594 3.86258 13.7597 3.92258 13.8712 4.04617C14 4.18889 14 4.52917 14 5.20973V18.7904C14 19.471 14 19.8113 13.8712 19.954C13.7597 20.0776 13.594 20.1376 13.4292 20.114C13.239 20.0868 13.0211 19.8254 12.5854 19.3026L9.95951 16.1515C9.60681 15.7283 9.43047 15.5166 9.21429 15.3645C9.02275 15.2297 8.80903 15.1296 8.58285 15.0688C8.32759 15.0001 8.05213 15.0001 7.5012 15.0001H6.6C6.03995 15.0001 5.75992 15.0001 5.54601 14.8911C5.35785 14.7952 5.20487 14.6422 5.10899 14.4541C5 14.2402 5 13.9601 5 13.4001V10.6001C5 10.04 5 9.76001 5.10899 9.54609C5.20487 9.35793 5.35785 9.20495 5.54601 9.10908C5.75992 9.00009 6.03995 9.00009 6.6 9.00009Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)

const HighVolumeIcon = (handleClick: MouseEventHandler<SVGSVGElement>) => (
    <svg 
        onClick={handleClick}
        role="button"
        className="volume-icon"
        viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M16.0004 9.00009C16.6281 9.83575 17 10.8745 17 12.0001C17 13.1257 16.6281 14.1644 16.0004 15.0001M18 5.29177C19.8412 6.93973 21 9.33459 21 12.0001C21 14.6656 19.8412 17.0604 18 18.7084M4.6 9.00009H5.5012C6.05213 9.00009 6.32759 9.00009 6.58285 8.93141C6.80903 8.87056 7.02275 8.77046 7.21429 8.63566C7.43047 8.48353 7.60681 8.27191 7.95951 7.84868L10.5854 4.69758C11.0211 4.17476 11.2389 3.91335 11.4292 3.88614C11.594 3.86258 11.7597 3.92258 11.8712 4.04617C12 4.18889 12 4.52917 12 5.20973V18.7904C12 19.471 12 19.8113 11.8712 19.954C11.7597 20.0776 11.594 20.1376 11.4292 20.114C11.239 20.0868 11.0211 19.8254 10.5854 19.3026L7.95951 16.1515C7.60681 15.7283 7.43047 15.5166 7.21429 15.3645C7.02275 15.2297 6.80903 15.1296 6.58285 15.0688C6.32759 15.0001 6.05213 15.0001 5.5012 15.0001H4.6C4.03995 15.0001 3.75992 15.0001 3.54601 14.8911C3.35785 14.7952 3.20487 14.6422 3.10899 14.4541C3 14.2402 3 13.9601 3 13.4001V10.6001C3 10.04 3 9.76001 3.10899 9.54609C3.20487 9.35793 3.35785 9.20495 3.54601 9.10908C3.75992 9.00009 4.03995 9.00009 4.6 9.00009Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)


export const BottomBarPanel = () => {
    const { howlRef, mute, setMute, volume, setVolume, seek, setSeek, playing, shuffle, setShuffle, loop, setLoop, rewind, skip, pauseHowl, resumeHowl } = useControl();
    const { currentSong, formatDuration } = useLayout(); 
    const [isSeeking, setIsSeeking] = useState<boolean>(false);
    const [changingVolume, setChangingVolume] = useState<boolean>(false);

    useEffect(() => {
        let interval: NodeJS.Timeout; 
        if (playing && howlRef.current && !isSeeking) {
            interval = setInterval(() => {
                if (howlRef.current) setSeek([howlRef.current.seek()]);
            }, 100);
        }

        return () => clearInterval(interval);
    }, [playing, isSeeking]); 

    const handleSeekChange = (values: number[]) => {
        setIsSeeking(true);
        if (howlRef.current) howlRef.current.mute(true);
        setSeek(values);
    }

    const handleFinalSeekChange = (values: number[]) => {
        setSeek(values); 
        if (howlRef.current) {
            howlRef.current.seek(values[0]); 
            howlRef.current.mute(false);
        }
        setIsSeeking(false);
    }

    const handleVolumeChange = (values: number[]) => {
        setMute(false);
        setVolume(values);
        setChangingVolume(true);
    }

    const handleFinalVolumeChange = (values: number[]) => {
        setMute(false);
        setVolume(values);
        setChangingVolume(false);
    }

    const handleMute: MouseEventHandler<SVGSVGElement> = () => {
        setMute(prevMute => !prevMute);
    }

    return (
        <div className="main-container shadow" id="bottom-bar-panel">
            <div id="song-info-container">
                <span id="bottom-bar-title" className="overflow-ellipsis">{currentSong?.title}</span>
                <span className="overflow-ellipsis">{currentSong?.artist}</span>
            </div>
            <div id="bottom-bar-center-container">
                <div id="bottom-bar-center-controls">
                    {ShuffleIcon(() => setShuffle(prevShuffle => !prevShuffle), shuffle)}
                    {BackIcon(rewind)}
                    {playing ? PauseIcon(pauseHowl) : PlayIcon(resumeHowl)}
                    {SkipIcon(skip)}
                    {LoopIcon(() => setLoop(prevLoop => !prevLoop), loop)}
                </div>
                <div id="bottom-bar-seek-container">
                    <span className="bottom-bar-timestamp prevent-select">{formatDuration(seek[0])}</span>
                    <Range
                        min={0}
                        max={currentSong ? currentSong.duration : 1}
                        disabled={!currentSong}
                        step={1}
                        values={currentSong ? seek : [0]}
                        onChange={handleSeekChange}
                        onFinalChange={handleFinalSeekChange}
                        renderTrack={({ props, children }) => (
                            <div
                                {...props}
                                id="seek-track"
                                className="bottom-bar-range clickable"
                                style={{
                                    background: getTrackBackground({
                                        values: seek,
                                        colors: ["#FFFFFF", "#969696"],
                                        min: 0,
                                        max: currentSong ? currentSong.duration : 1
                                    })
                                }}
                            >
                                {children}
                            </div>
                        )}
                        renderThumb={({ props }) => (
                            <div
                                {...props}
                                id={isSeeking ? "seek-thumb-seeking" : "seek-thumb"}
                                key={props.key}
                                style={{cursor: "pointer"}}
                            />
                        )}
                    />
                    <span className="bottom-bar-timestamp prevent-select">{formatDuration(currentSong ? currentSong.duration : 0)}</span>
                </div>
            </div>
            <div id="bottom-bar-right-container">
                <div id="bottom-bar-volume-container">
                    {volume[0] === 0 || mute ? MuteIcon(handleMute) : volume[0] < 0.65 ? MidVolumeIcon(handleMute) : HighVolumeIcon(handleMute)}
                    <Range 
                        min={0}
                        max={1}
                        step={0.01}
                        values={mute ? [0] : volume}
                        onChange={handleVolumeChange}
                        onFinalChange={handleFinalVolumeChange}
                        renderTrack={({ props, children }) => (
                            <div
                                {...props}
                                id="volume-track"
                                className="bottom-bar-range clickable"
                                style={{
                                    background: getTrackBackground({
                                        values: mute ? [0] : volume,
                                        colors: ["#FFFFFF", "#969696"],
                                        min: 0,
                                        max: 1
                                    })
                                }}
                            >
                                {children}
                            </div>
                        )}
                        renderThumb={({ props }) => (
                            <div
                                {...props}
                                id={changingVolume ? "volume-thumb-changing" : "volume-thumb"}
                                key={props.key}
                                style={{cursor: "pointer"}}
                            />
                        )}
                    />
                </div>
            </div>
        </div>
    );
}