import "./HomePage.css"; 
import { SongsPanel, PlaylistsPanel, BottomBarPanel } from "../../components";
import { useLayout } from "../../ContextProviders";

export const HomePage = () => {
    const { handleRootDivClick } = useLayout();

    return (
        <div
            id="homepage-wrapper"
            onClick={handleRootDivClick}
        >
            <div id="topbar">
                <h1 className="prevent-select shadow">Reidio</h1>
            </div>
            <div className="main-container shadow" id="sidebar-top"></div>
            <PlaylistsPanel />
            <SongsPanel />
            <BottomBarPanel />
        </div>
    );
}