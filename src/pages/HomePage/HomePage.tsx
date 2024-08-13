import "./HomePage.css"; 
import { SongsPanel, PlaylistsPanel, BottomBarPanel, PlaylistSettings, UploadSearchPanel } from "../../components";
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
            <UploadSearchPanel />
            <PlaylistsPanel />
            <SongsPanel />
            <BottomBarPanel />
            <PlaylistSettings />
        </div>
    );
}