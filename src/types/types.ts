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

export interface PlaylistType {
    _id: string,
    name: string,
    songs: SongType[] | void
}