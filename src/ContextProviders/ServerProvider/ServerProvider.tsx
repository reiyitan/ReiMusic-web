import { createContext, useContext } from "react";
import { useAuth } from "../FirebaseProvider";
import { PlaylistType, UserType, SongType } from "../../types";
interface ServerContextInterface {
    createUser: (username: string) => void,
    getUser: (uid: string) => Promise<UserType | undefined>,
    createPlaylist: () => Promise<PlaylistType | undefined>,
    getPlaylists: () => Promise<PlaylistType[] | undefined>,
    getPlaylist: (playlistId: string) => Promise<PlaylistType | undefined>,
    deletePlaylist: (playlistId: string) => Promise<number | void>,
    renamePlaylist: (playlistId: string, newName: string) => Promise<number | void>,
    addToPlaylist: (playlistId: string, songId: string) => Promise<number | void>,
    removeFromPlaylist: (playlistId: string, songId: string) => Promise<number | void>,
    uploadSong: (title: string, artist: string, duration: number, file: File, username: string) => Promise<SongType>,
    deleteSong: (songId: string, s3_key: string) => Promise<number | void>,
    getSongs: (query?: string) => Promise<SongType[]>,
    getUserSongs: () => Promise<SongType[]>,
    getSongURL: (s3_key: string) => Promise<string>,
    getFileFromURL: (url: string) => Promise<File | void>
}
const ServerContext = createContext<ServerContextInterface | undefined>(undefined);

const SERVER_IP = import.meta.env.VITE_SERVER_IP;
interface ServerProviderProps {
    children: React.ReactNode
}
export const ServerProvider = ({ children }: ServerProviderProps) => {
    const auth = useAuth();

    const createUser = async (username: string) => {
        fetch(`http://${SERVER_IP}:3000/api/user`, {
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
        return fetch(`http://${SERVER_IP}:3000/api/user/${uid}`, {
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

    const createPlaylist = async (): Promise<PlaylistType | undefined> => {
        return fetch(`http://${SERVER_IP}:3000/api/playlist`, {
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

    const getPlaylists = async (): Promise<PlaylistType[] | undefined> => {
        return fetch(`http://${SERVER_IP}:3000/api/playlist/${auth.currentUser?.uid}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${await auth.currentUser?.getIdToken(true)}`
            }
        })
            .then(res => res.json())
            .then(data => data.playlists)
            .catch(error => console.error(error));
    }

    const getPlaylist = async (playlistId: string): Promise<PlaylistType | undefined> => {
        return fetch(`http://${SERVER_IP}:3000/api/playlist/${auth.currentUser?.uid}/${playlistId}`, {
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
        return fetch(`http://${SERVER_IP}:3000/api/playlist/${auth.currentUser?.uid}/${playlistId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${await auth.currentUser?.getIdToken(true)}`
            }
        })
            .then(res => res.status)
            .catch(error => console.error(error));
    }

    const renamePlaylist = async (playlistId: string, newName: string): Promise<number | void> => {
        return fetch(`http://${SERVER_IP}:3000/api/playlist/rename/${auth.currentUser?.uid}/${playlistId}`, {
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

    const addToPlaylist = async (playlistId: string, songId: string): Promise<number | void> => {
        return fetch(`http://${SERVER_IP}:3000/api/playlist/add/${auth.currentUser?.uid}/${playlistId}`, {
            method: "PATCH", 
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${await auth.currentUser?.getIdToken(true)}`
            },
            body: JSON.stringify({
                songId: songId
            })
        })
            .then(res => {
                return res.status;
            })
            .catch(error => console.error(error));
    }

    const removeFromPlaylist = async (playlistId: string, songId: string): Promise<number | void> => {
        return fetch(`http://${SERVER_IP}:3000/api/playlist/remove/${auth.currentUser?.uid}/${playlistId}`, {
            method: "PATCH", 
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${await auth.currentUser?.getIdToken(true)}`
            },
            body: JSON.stringify({songId: songId})
        })
            .then(res => {
                if (res.status === 204) {
                    return res.status;
                }
                else {
                    throw new Error("Error removing from playlist");
                }
            })
            .catch(error => console.error(error));
    }

    const getSongs = async (query?: string): Promise<SongType[]> => {
        return fetch(`http://${SERVER_IP}:3000/api/song?q=${query ? query.trim() : ""}`, {
            method: "GET", 
            headers: {
                "Authorization": `Bearer ${await auth.currentUser?.getIdToken(true)}`
            }
        })
            .then(res => res.json()) 
            .then(data => data.songs.toReversed())
            .catch(error => console.error(error));
    }

    const getUserSongs = async (): Promise<SongType[]> => {
        return fetch(`http://${SERVER_IP}:3000/api/song/userSongs/${auth?.currentUser?.uid}`, {
            method: "GET", 
            headers: {
                "Authorization": `Bearer ${await auth.currentUser?.getIdToken(true)}`
            }
        })
            .then(res => res.json())
            .then(data => data.songs) 
            .catch(error => console.error(error));
    }

    const uploadSong = async (title: string, artist: string, duration: number, file: File, username: string): Promise<SongType> => {    
        const formData = new FormData();
        formData.append("title", title); 
        formData.append("artist", artist); 
        formData.append("duration", duration.toString()); 
        formData.append("username", username);
        formData.append("file", file); 

        return fetch(`http://${SERVER_IP}:3000/api/song`, {
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
    
    const deleteSong = async (songId: string, s3_key: string): Promise<number | void> => {
        return fetch(`http://${SERVER_IP}:3000/api/song/delete/${auth.currentUser?.uid}/${songId}`, {
            method: "POST", 
            headers: {
                "Authorization": `Bearer ${await auth.currentUser?.getIdToken(true)}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({s3_key: s3_key})
        })
            .then(res => {
                if (res.status === 204) {
                    return res.status;
                }
                else {
                    throw new Error("Error deleting song");
                }
            })
            .catch(error => console.error(error));
    }

    const getSongURL = async (s3_key: string): Promise<string> => {
        return fetch(`http://${SERVER_IP}:3000/api/song/${s3_key}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${await auth.currentUser?.getIdToken(true)}`
            }
        })
            .then(res => res.json())
            .then(data => data.url)
            .catch(error => console.error(error));
    }

    const getFileFromURL = async (url: string) => {
        return fetch(url)
            .then(res => {
                if (!res.ok) {
                    throw new Error("Error fetching file from URL");
                }
                return res.blob();
            })
            .then(blob => {
                const file = new File([blob], "song");
                return file;
            })
            .catch(error => console.error(error));
    }

    return (
        <ServerContext.Provider value={{
                createUser, getUser, 
                createPlaylist, getPlaylists, getPlaylist, deletePlaylist, renamePlaylist, addToPlaylist, removeFromPlaylist,
                getSongs, getUserSongs, uploadSong, deleteSong, getSongURL, getFileFromURL 
            }}>
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