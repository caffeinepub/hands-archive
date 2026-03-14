export type Song = {
  id: string;
  title: string;
  album: string;
  year: number;
  duration: number;
  description: string;
  type: "song";
};

export type Album = {
  id: string;
  title: string;
  year: number;
  description: string;
  trackList: string[];
  type: "album";
};

export type Member = {
  id: string;
  name: string;
  role: string;
  bio: string;
  years: [number, number | null];
  type: "member";
};

export type Show = {
  id: string;
  title: string;
  date: string;
  venue: string;
  city: string;
  description: string;
  type: "show";
};

export type ArchiveItem = Song | Album | Member | Show;

export const SONGS: Song[] = [
  {
    id: "s1",
    title: "Palmistry",
    album: "Synesthesia",
    year: 2011,
    duration: 245,
    description: "Opener off Synesthesia. Shimmering guitar textures.",
    type: "song",
  },
  {
    id: "s2",
    title: "Gold Teeth",
    album: "Synesthesia",
    year: 2011,
    duration: 198,
    description: "Sparse and haunting.",
    type: "song",
  },
  {
    id: "s3",
    title: "Fractures",
    album: "Wildly Idle",
    year: 2013,
    duration: 312,
    description: "A long-form exploration.",
    type: "song",
  },
  {
    id: "s4",
    title: "Portrait",
    album: "Wildly Idle",
    year: 2013,
    duration: 267,
    description: "Intimate and close.",
    type: "song",
  },
  {
    id: "s5",
    title: "Lions",
    album: "Cavalo",
    year: 2016,
    duration: 289,
    description: "Driving rhythms.",
    type: "song",
  },
  {
    id: "s6",
    title: "Tall Glass",
    album: "Cavalo",
    year: 2016,
    duration: 234,
    description: "Sparse and hypnotic.",
    type: "song",
  },
];

export const ALBUMS: Album[] = [
  {
    id: "a1",
    title: "Synesthesia",
    year: 2011,
    description: "Debut album exploring sound and sensation.",
    trackList: ["s1", "s2"],
    type: "album",
  },
  {
    id: "a2",
    title: "Wildly Idle (Humble Before the Void)",
    year: 2013,
    description: "Second full-length, expansive and abstract.",
    trackList: ["s3", "s4"],
    type: "album",
  },
  {
    id: "a3",
    title: "Cavalo",
    year: 2016,
    description: "Third album, more rhythmic and physical.",
    trackList: ["s5", "s6"],
    type: "album",
  },
];

export const MEMBERS: Member[] = [
  {
    id: "m1",
    name: "Chris Conway",
    role: "Vocals / Guitar",
    bio: "Founding member, primary songwriter.",
    years: [2008, null],
    type: "member",
  },
  {
    id: "m2",
    name: "Andrew Black",
    role: "Bass",
    bio: "Founding member, textural bassist.",
    years: [2008, null],
    type: "member",
  },
  {
    id: "m3",
    name: "Owen Zozula",
    role: "Drums",
    bio: "Founding member, rhythmic anchor.",
    years: [2008, null],
    type: "member",
  },
];

export const SHOWS: Show[] = [
  {
    id: "sh1",
    title: "ATP Iceland 2012",
    date: "2012-07-14",
    venue: "Stracta Hotel",
    city: "Iceland",
    description: "Curated ATP festival set.",
    type: "show",
  },
  {
    id: "sh2",
    title: "Primavera Sound 2014",
    date: "2014-05-30",
    venue: "Parc del Fòrum",
    city: "Barcelona",
    description: "Festival appearance.",
    type: "show",
  },
  {
    id: "sh3",
    title: "UK Tour 2016",
    date: "2016-09-15",
    venue: "Scala",
    city: "London",
    description: "Headline show on UK tour.",
    type: "show",
  },
];

export const ALL_ITEMS: ArchiveItem[] = [
  ...SONGS,
  ...ALBUMS,
  ...MEMBERS,
  ...SHOWS,
];

export function getItemById(id: string): ArchiveItem | undefined {
  return ALL_ITEMS.find((item) => item.id === id);
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function getRelatedItems(item: ArchiveItem): ArchiveItem[] {
  if (item.type === "song") {
    const album = ALBUMS.find((a) => a.title === item.album);
    const sameSongs = SONGS.filter(
      (s) => s.album === item.album && s.id !== item.id,
    );
    return [...(album ? [album] : []), ...sameSongs].slice(0, 4);
  }
  if (item.type === "album") {
    const tracks = item.trackList
      .map((id) => SONGS.find((s) => s.id === id))
      .filter(Boolean) as Song[];
    return tracks;
  }
  if (item.type === "member") {
    return ALBUMS;
  }
  if (item.type === "show") {
    return SHOWS.filter((s) => s.id !== item.id).slice(0, 3);
  }
  return [];
}
