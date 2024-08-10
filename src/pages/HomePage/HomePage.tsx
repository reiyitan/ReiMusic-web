import "./HomePage.css"; 
import { SongsPanel, PlaylistsPanel, BottomBarPanel } from "../../components";

export const HomePage = () => {

    return (
        <div
            id="homepage-wrapper"
        >
            <div id="topbar">
                <h1>Reidio</h1>
            </div>
            <div className="main-container shadow" id="sidebar-top"></div>
            <PlaylistsPanel />
            <SongsPanel />
            <BottomBarPanel />
        </div>
    );
}