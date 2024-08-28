import "./HomePage.css"; 
import { SongsPanel, PlaylistsPanel, BottomBarPanel, PlaylistSettings, SongSettings, UploadSearchPanel, Vanisher } from "../../components";
import { useLayout } from "../../ContextProviders";

export const HomePage = () => {
    const { handleRootDivClick, vanisherMsg, setVanisherMsg } = useLayout();

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
            <SongSettings />
            <Vanisher msg={vanisherMsg} setMsg={setVanisherMsg} />
        </div>
    );
}