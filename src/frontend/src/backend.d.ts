import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PhotoType {
    id: string;
    url: string;
    title: string;
    year: bigint;
    description: string;
}
export interface RelatedItem {
    relatedType: RelatedType;
}
export type Time = bigint;
export interface SongType {
    id: string;
    title: string;
    duration: bigint;
    album: string;
    lyrics: string;
    year: bigint;
    description: string;
}
export interface AlbumType {
    id: string;
    title: string;
    trackList: Array<string>;
    year: bigint;
    description: string;
}
export interface MemberType {
    id: string;
    bio: string;
    name: string;
    role: string;
    years: [bigint, bigint | null];
}
export interface PressType {
    id: string;
    url: string;
    title: string;
    date: Time;
    excerpt: string;
    publication: string;
}
export interface Related {
    id: string;
    relatedItems: Array<RelatedItem>;
    relatedType: RelatedType;
}
export interface VideoType {
    id: string;
    url: string;
    title: string;
    year: bigint;
    description: string;
}
export interface ShowType {
    id: string;
    title: string;
    setlist: Array<string>;
    venue: string;
    city: string;
    date: Time;
    description: string;
}
export type RelatedType = {
    __kind__: "members";
    members: Array<MemberType>;
} | {
    __kind__: "albums";
    albums: Array<AlbumType>;
} | {
    __kind__: "shows";
    shows: Array<ShowType>;
} | {
    __kind__: "songs";
    songs: Array<SongType>;
} | {
    __kind__: "press";
    press: Array<PressType>;
} | {
    __kind__: "videos";
    videos: Array<VideoType>;
} | {
    __kind__: "photos";
    photos: Array<PhotoType>;
};
export interface backendInterface {
    createAlbum(id: string, title: string, year: bigint, description: string, trackList: Array<string>): Promise<void>;
    createMember(id: string, name: string, role: string, bio: string, startYear: bigint, endYear: bigint | null): Promise<void>;
    createPhoto(id: string, title: string, url: string, description: string, year: bigint): Promise<void>;
    createPress(id: string, title: string, publication: string, date: Time, url: string, excerpt: string): Promise<void>;
    createShow(id: string, title: string, date: Time, venue: string, city: string, description: string, setlist: Array<string>): Promise<void>;
    createSong(id: string, title: string, album: string, year: bigint, duration: bigint, lyrics: string, description: string): Promise<void>;
    createVideo(id: string, title: string, url: string, description: string, year: bigint): Promise<void>;
    deleteAlbum(id: string): Promise<void>;
    deleteMember(id: string): Promise<void>;
    deletePhoto(id: string): Promise<void>;
    deletePress(id: string): Promise<void>;
    deleteShow(id: string): Promise<void>;
    deleteSong(id: string): Promise<void>;
    deleteVideo(id: string): Promise<void>;
    getAlbum(id: string): Promise<AlbumType>;
    getAllAlbums(): Promise<Array<AlbumType>>;
    getAllMembers(): Promise<Array<MemberType>>;
    getAllPhotos(): Promise<Array<PhotoType>>;
    getAllPress(): Promise<Array<PressType>>;
    getAllShows(): Promise<Array<ShowType>>;
    getAllSongs(): Promise<Array<SongType>>;
    getAllVideos(): Promise<Array<VideoType>>;
    getMember(id: string): Promise<MemberType>;
    getPhoto(id: string): Promise<PhotoType>;
    getPress(id: string): Promise<PressType>;
    getRelated(entityId: string): Promise<Related>;
    getShow(id: string): Promise<ShowType>;
    getSong(id: string): Promise<SongType>;
    getVideo(id: string): Promise<VideoType>;
    updateAlbum(id: string, title: string, year: bigint, description: string, trackList: Array<string>): Promise<void>;
    updateMember(id: string, name: string, role: string, bio: string, startYear: bigint, endYear: bigint | null): Promise<void>;
    updatePhoto(id: string, title: string, url: string, description: string, year: bigint): Promise<void>;
    updatePress(id: string, title: string, publication: string, date: Time, url: string, excerpt: string): Promise<void>;
    updateShow(id: string, title: string, date: Time, venue: string, city: string, description: string, setlist: Array<string>): Promise<void>;
    updateSong(id: string, title: string, album: string, year: bigint, duration: bigint, lyrics: string, description: string): Promise<void>;
    updateVideo(id: string, title: string, url: string, description: string, year: bigint): Promise<void>;
}
