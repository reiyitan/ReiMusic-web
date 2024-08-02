import "./HomePage.css"; 
import { SongList } from "../../components";

export const HomePage = () => {

    return (
        <div
            id="homepage-wrapper"
        >
            <div className="picto-container" id="topbar">
                <h1>Reidio</h1>
            </div>
            <div className="picto-container" id="sidebar-top"></div>
            <div className="picto-container" id="sidebar-bottom"></div>
            <SongList />
            <div className="picto-container" id="bottom-bar"></div>
        </div>
    );
}