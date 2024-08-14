import { createContext, useContext } from "react";
import { useAuth } from "../FirebaseProvider";
import { SidebarPlaylistType, MainPlaylistType, UserType, SongType } from "../../types";
interface ServerContextInterface {
    createUser: (username: string) => void,
    getUser: (uid: string) => Promise<UserType | undefined>,
    createPlaylist: () => Promise<SidebarPlaylistType | undefined>,
    getPlaylists: () => Promise<SidebarPlaylistType[] | undefined>,
    getPlaylist: (playlistId: string) => Promise<MainPlaylistType | undefined>,
    deletePlaylist: (playlistId: string) => Promise<number | void>,
    renamePlaylist: (playlistId: string, newName: string) => Promise<number | void>,
    uploadSong: (title: string, artist: string, duration: number, file: File, username: string) => Promise<SongType>
}
const ServerContext = createContext<ServerContextInterface | undefined>(undefined);
interface ServerProviderProps {
    children: React.ReactNode
}
export const ServerProvider = ({ children }: ServerProviderProps) => {
    const auth = useAuth();

    const createUser = async (username: string) => {
        fetch("http://127.0.0.1:3000/api/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${await auth.currentUser?.getIdToken(true)}`
            },
            body: JSON.stringify({
                username: username
            })
        })
            .catch(error => console.error(error));
    }

    const getUser = async (uid: string): Promise<UserType | undefined> => {
        return fetch(`http://127.0.0.1:3000/api/user/${uid}`, {
            method: "GET", 
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${await auth.currentUser?.getIdToken(true)}`
            }
        })
            .then(res => res.json()) 
            .then(userData => userData.user)
            .catch(error => console.error(error));
    }

    const createPlaylist = async (): Promise<SidebarPlaylistType | undefined> => {
        return fetch("http://127.0.0.1:3000/api/playlist", {
            method: "POST", 
            headers: {
                "Authorization": `Bearer ${await auth.currentUser?.getIdToken(true)}`
            },
            body: JSON.stringify({
                uid: auth.currentUser?.uid
            })
        })
            .then(res => res.json())
            .then(data => {
                const playlist = data.playlist;
                return {
                    _id: playlist._id,
                    name: playlist.name,
                    owner: playlist.owner,
                    songs: playlist.songs
                };
            })
            .catch(error => {
                console.error(error);
                return undefined;
            });
    }

    const getPlaylists = async (): Promise<SidebarPlaylistType[] | undefined> => {
        return fetch(`http://127.0.0.1:3000/api/playlist/${auth.currentUser?.uid}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${await auth.currentUser?.getIdToken(true)}`
            }
        })
            .then(res => res.json())
            .then(data => data.playlists)
            .catch(error => console.error(error));
    }

    const getPlaylist = async (playlistId: string): Promise<MainPlaylistType | undefined> => {
        return fetch(`http://127.0.0.1:3000/api/playlist/${auth.currentUser?.uid}/${playlistId}`, {
            method: "GET", 
            headers: {
                "Authorization": `Bearer ${await auth.currentUser?.getIdToken(true)}`
            }
        })
            .then(res => res.json())
            .then(data => data.playlist)
            .catch(error => console.error(error)); 
    }

    const deletePlaylist = async (playlistId: string): Promise<number | void> => {
        return fetch(`http://127.0.0.1:3000/api/playlist/${auth.currentUser?.uid}/${playlistId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${await auth.currentUser?.getIdToken(true)}`
            }
        })
            .then(res => res.status)
            .catch(error => console.error(error));
    }

    const renamePlaylist = async (playlistId: string, newName: string): Promise<number | void> => {
        return fetch(`http://127.0.0.1:3000/api/playlist/rename/${auth.currentUser?.uid}/${playlistId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${await auth.currentUser?.getIdToken(true)}`
            },
            body: JSON.stringify({newName: newName})
        })
            .then(res => res.status)
            .catch(error => console.error(error));
    }

    // const addToPlaylist = () => {

    // }

    // const removeFromPlaylist = () => {

    // }


    const uploadSong = async (title: string, artist: string, duration: number, file: File, username: string): Promise<SongType> => {    
        const formData = new FormData();
        formData.append("title", title); 
        formData.append("artist", artist); 
        formData.append("duration", duration.toString()); 
        formData.append("username", username);
        formData.append("file", file); 

        return fetch(`http://127.0.0.1:3000/api/song`, {
            method: "POST", 
            headers: {
                "Authorization": `Bearer ${await auth.currentUser?.getIdToken(true)}`
            },
            body: formData
        })
            .then(res => res.json()) 
            .then(data => data.song)
            .catch(error => console.error(error));
    }

    return (
        <ServerContext.Provider value={{createUser, getUser, createPlaylist, getPlaylists, getPlaylist, deletePlaylist, renamePlaylist, uploadSong}}>
            {children}
        </ServerContext.Provider>
    );
}

export const useServer = (): ServerContextInterface => {
    const serverContext = useContext(ServerContext);
    if (!serverContext) {
        throw new Error("useServer must be used within a ServerProvider");
    }
    return serverContext;
}   