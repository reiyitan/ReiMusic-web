import React from "react"; 
import "./HomePage.css"; 

export const HomePage = () => {
    return (
        <div
            id="homepage-wrapper"
        >
            <div className="grid-element octagon" id="sidebar-top"></div>
            <div className="grid-element" id="sidebar-bottom"></div>
            <div className="grid-element" id="song-list"></div>
            <div className="grid-element" id="bottom-bar"></div>
        </div>
    );
}