import "./HomePage.css"; 
import { SongsPanel, PlaylistsPanel, BottomBarPanel, TopPanel, PlaylistSettings, SongSettings, UploadSearchPanel, Vanisher } from "../../components";
import { useLayout } from "../../ContextProviders";

export const HomePage = () => {
    const { handleRootDivClick, vanisherMsg, setVanisherMsg, windowRef } = useLayout();

    return (
        <div
            id="homepage-wrapper"
            onClick={handleRootDivClick}
            ref={windowRef}
        >
            <TopPanel />
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