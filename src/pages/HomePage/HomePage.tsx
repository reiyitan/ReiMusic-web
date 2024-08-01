import React from "react"; 
import "./HomePage.css"; 

export const HomePage = () => {
    return (
        <div
            id="homepage-wrapper"
        >
            <div className="picto-container" id="sidebar-top"></div>
            <div className="picto-container" id="sidebar-bottom"></div>
            <div className="picto-container" id="song-list"></div>
            <div className="picto-container" id="bottom-bar"></div>
        </div>
    );
}