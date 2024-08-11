export interface UserType {
    _id: string,
    username: string, 
    playlists: string[], 
    uploadedSongs: string[]
}

export interface SongType {
    _id: string,
    title: string,
    artist: string,
    duration: number,
    uploaderId: string, 
    uploader: string, 
    s3_key: string
}

export interface SidebarPlaylistType {
    _id: string,
    name: string
}

export interface MainPlaylistType {
    _id: string,
    name: string
    owner: string,
    songs: SongType[]
}