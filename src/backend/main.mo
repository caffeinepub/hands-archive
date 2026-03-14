import Iter "mo:core/Iter";
import Set "mo:core/Set";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import List "mo:core/List";

actor {
  module Song {
    public type SongType = {
      id : Text;
      title : Text;
      album : Text;
      year : Nat;
      duration : Nat;
      lyrics : Text;
      description : Text;
    };

    public func compareByYear(a : SongType, b : SongType) : Order.Order {
      Nat.compare(a.year, b.year);
    };
  };

  module Show {
    public type ShowType = {
      id : Text;
      title : Text;
      date : Time.Time;
      venue : Text;
      city : Text;
      description : Text;
      setlist : [Text];
    };

    public func compareByDate(a : ShowType, b : ShowType) : Order.Order {
      Int.compare(a.date, b.date);
    };

    public func compareByCity(a : ShowType, b : ShowType) : Order.Order {
      Text.compare(a.city, b.city);
    };
  };

  module Member {
    public type MemberType = {
      id : Text;
      name : Text;
      role : Text;
      bio : Text;
      years : (Nat, ?Nat);
    };

    public func compareByStartYear(a : MemberType, b : MemberType) : Order.Order {
      Nat.compare(a.years.0, b.years.0);
    };
  };

  module Video {
    public type VideoType = {
      id : Text;
      title : Text;
      url : Text;
      description : Text;
      year : Nat;
    };

    public func compareByYear(a : VideoType, b : VideoType) : Order.Order {
      Nat.compare(a.year, b.year);
    };
  };

  module Photo {
    public type PhotoType = {
      id : Text;
      title : Text;
      url : Text;
      description : Text;
      year : Nat;
    };

    public func compareByYear(a : PhotoType, b : PhotoType) : Order.Order {
      Nat.compare(a.year, b.year);
    };
  };

  module Press {
    public type PressType = {
      id : Text;
      title : Text;
      publication : Text;
      date : Time.Time;
      url : Text;
      excerpt : Text;
    };

    public func compareByDate(a : PressType, b : PressType) : Order.Order {
      Int.compare(a.date, b.date);
    };
  };

  module Album {
    public type AlbumType = {
      id : Text;
      title : Text;
      year : Nat;
      description : Text;
      trackList : [Text];
    };

    public func compareByYear(a : AlbumType, b : AlbumType) : Order.Order {
      Nat.compare(a.year, b.year);
    };
  };

  type RelatedType = {
    #songs : [Song.SongType];
    #shows : [Show.ShowType];
    #members : [Member.MemberType];
    #videos : [Video.VideoType];
    #photos : [Photo.PhotoType];
    #press : [Press.PressType];
    #albums : [Album.AlbumType];
  };

  type RelatedItem = {
    relatedType : RelatedType;
  };

  type Related = {
    id : Text;
    relatedType : RelatedType;
    relatedItems : [RelatedItem];
  };

  // Storage
  let songs = Map.empty<Text, Song.SongType>();
  let shows = Map.empty<Text, Show.ShowType>();
  let members = Map.empty<Text, Member.MemberType>();
  let videos = Map.empty<Text, Video.VideoType>();
  let photos = Map.empty<Text, Photo.PhotoType>();
  let press = Map.empty<Text, Press.PressType>();
  let albums = Map.empty<Text, Album.AlbumType>();

  // Utility functions
  func getCurrentTime() : Time.Time {
    Time.now();
  };

  public shared ({ caller }) func createSong(id : Text, title : Text, album : Text, year : Nat, duration : Nat, lyrics : Text, description : Text) : async () {
    let song : Song.SongType = {
      id;
      title;
      album;
      year;
      duration;
      lyrics;
      description;
    };
    songs.add(id, song);
  };

  public shared ({ caller }) func updateSong(id : Text, title : Text, album : Text, year : Nat, duration : Nat, lyrics : Text, description : Text) : async () {
    let song : Song.SongType = {
      id;
      title;
      album;
      year;
      duration;
      lyrics;
      description;
    };
    songs.add(id, song);
  };

  public shared ({ caller }) func deleteSong(id : Text) : async () {
    songs.remove(id);
  };

  public query ({ caller }) func getSong(id : Text) : async Song.SongType {
    switch (songs.get(id)) {
      case (null) { Runtime.trap("Song not found") };
      case (?song) { song };
    };
  };

  public query ({ caller }) func getAllSongs() : async [Song.SongType] {
    songs.values().toArray().sort(Song.compareByYear);
  };

  public shared ({ caller }) func createShow(id : Text, title : Text, date : Time.Time, venue : Text, city : Text, description : Text, setlist : [Text]) : async () {
    let show : Show.ShowType = {
      id;
      title;
      date;
      venue;
      city;
      description;
      setlist;
    };
    shows.add(id, show);
  };

  public shared ({ caller }) func updateShow(id : Text, title : Text, date : Time.Time, venue : Text, city : Text, description : Text, setlist : [Text]) : async () {
    let show : Show.ShowType = {
      id;
      title;
      date;
      venue;
      city;
      description;
      setlist;
    };
    shows.add(id, show);
  };

  public shared ({ caller }) func deleteShow(id : Text) : async () {
    shows.remove(id);
  };

  public query ({ caller }) func getShow(id : Text) : async Show.ShowType {
    switch (shows.get(id)) {
      case (null) { Runtime.trap("Show not found") };
      case (?show) { show };
    };
  };

  public query ({ caller }) func getAllShows() : async [Show.ShowType] {
    shows.values().toArray().sort(Show.compareByDate);
  };

  public shared ({ caller }) func createMember(id : Text, name : Text, role : Text, bio : Text, startYear : Nat, endYear : ?Nat) : async () {
    let member : Member.MemberType = {
      id;
      name;
      role;
      bio;
      years = (startYear, endYear);
    };
    members.add(id, member);
  };

  public shared ({ caller }) func updateMember(id : Text, name : Text, role : Text, bio : Text, startYear : Nat, endYear : ?Nat) : async () {
    let member : Member.MemberType = {
      id;
      name;
      role;
      bio;
      years = (startYear, endYear);
    };
    members.add(id, member);
  };

  public shared ({ caller }) func deleteMember(id : Text) : async () {
    members.remove(id);
  };

  public query ({ caller }) func getMember(id : Text) : async Member.MemberType {
    switch (members.get(id)) {
      case (null) { Runtime.trap("Member not found") };
      case (?member) { member };
    };
  };

  public query ({ caller }) func getAllMembers() : async [Member.MemberType] {
    members.values().toArray().sort(Member.compareByStartYear);
  };

  public shared ({ caller }) func createVideo(id : Text, title : Text, url : Text, description : Text, year : Nat) : async () {
    let video : Video.VideoType = {
      id;
      title;
      url;
      description;
      year;
    };
    videos.add(id, video);
  };

  public shared ({ caller }) func updateVideo(id : Text, title : Text, url : Text, description : Text, year : Nat) : async () {
    let video : Video.VideoType = {
      id;
      title;
      url;
      description;
      year;
    };
    videos.add(id, video);
  };

  public shared ({ caller }) func deleteVideo(id : Text) : async () {
    videos.remove(id);
  };

  public query ({ caller }) func getVideo(id : Text) : async Video.VideoType {
    switch (videos.get(id)) {
      case (null) { Runtime.trap("Video not found") };
      case (?video) { video };
    };
  };

  public query ({ caller }) func getAllVideos() : async [Video.VideoType] {
    videos.values().toArray().sort(Video.compareByYear);
  };

  public shared ({ caller }) func createPhoto(id : Text, title : Text, url : Text, description : Text, year : Nat) : async () {
    let photo : Photo.PhotoType = {
      id;
      title;
      url;
      description;
      year;
    };
    photos.add(id, photo);
  };

  public shared ({ caller }) func updatePhoto(id : Text, title : Text, url : Text, description : Text, year : Nat) : async () {
    let photo : Photo.PhotoType = {
      id;
      title;
      url;
      description;
      year;
    };
    photos.add(id, photo);
  };

  public shared ({ caller }) func deletePhoto(id : Text) : async () {
    photos.remove(id);
  };

  public query ({ caller }) func getPhoto(id : Text) : async Photo.PhotoType {
    switch (photos.get(id)) {
      case (null) { Runtime.trap("Photo not found") };
      case (?photo) { photo };
    };
  };

  public query ({ caller }) func getAllPhotos() : async [Photo.PhotoType] {
    photos.values().toArray().sort(Photo.compareByYear);
  };

  public shared ({ caller }) func createPress(id : Text, title : Text, publication : Text, date : Time.Time, url : Text, excerpt : Text) : async () {
    let pressItem : Press.PressType = {
      id;
      title;
      publication;
      date;
      url;
      excerpt;
    };
    press.add(id, pressItem);
  };

  public shared ({ caller }) func updatePress(id : Text, title : Text, publication : Text, date : Time.Time, url : Text, excerpt : Text) : async () {
    let pressItem : Press.PressType = {
      id;
      title;
      publication;
      date;
      url;
      excerpt;
    };
    press.add(id, pressItem);
  };

  public shared ({ caller }) func deletePress(id : Text) : async () {
    press.remove(id);
  };

  public query ({ caller }) func getPress(id : Text) : async Press.PressType {
    switch (press.get(id)) {
      case (null) { Runtime.trap("Press item not found") };
      case (?press) { press };
    };
  };

  public query ({ caller }) func getAllPress() : async [Press.PressType] {
    press.values().toArray().sort(Press.compareByDate);
  };

  public shared ({ caller }) func createAlbum(id : Text, title : Text, year : Nat, description : Text, trackList : [Text]) : async () {
    let album : Album.AlbumType = {
      id;
      title;
      year;
      description;
      trackList;
    };
    albums.add(id, album);
  };

  public shared ({ caller }) func updateAlbum(id : Text, title : Text, year : Nat, description : Text, trackList : [Text]) : async () {
    let album : Album.AlbumType = {
      id;
      title;
      year;
      description;
      trackList;
    };
    albums.add(id, album);
  };

  public shared ({ caller }) func deleteAlbum(id : Text) : async () {
    albums.remove(id);
  };

  public query ({ caller }) func getAlbum(id : Text) : async Album.AlbumType {
    switch (albums.get(id)) {
      case (null) { Runtime.trap("Album not found") };
      case (?album) { album };
    };
  };

  public query ({ caller }) func getAllAlbums() : async [Album.AlbumType] {
    albums.values().toArray().sort(Album.compareByYear);
  };

  public query ({ caller }) func getRelated(entityId : Text) : async Related {
    switch (songs.get(entityId)) {
      case (?song) {
        let relatedShows : [Show.ShowType] = getShowsForSong(song.id);
        let relatedMembers : [Member.MemberType] = getMembersForYear(song.year);
        let relatedAlbum = getAlbumForSong(song.album);

        return {
          id = entityId;
          relatedType = #songs([song]);
          relatedItems = [
            { relatedType = #shows(relatedShows) },
            { relatedType = #members(relatedMembers) },
            { relatedType = #albums(relatedAlbum) },
          ];
        };
      };
      case (null) {};
    };

    switch (shows.get(entityId)) {
      case (?show) {
        let relatedSongs : [Song.SongType] = getSongsForShow(show.setlist);
        return {
          id = entityId;
          relatedType = #shows([show]);
          relatedItems = [{ relatedType = #songs(relatedSongs) }];
        };
      };
      case (null) {};
    };

    switch (members.get(entityId)) {
      case (?member) {
        let relatedAlbums : [Album.AlbumType] = getAlbumsForYear(member.years.0, member.years.1);
        return {
          id = entityId;
          relatedType = #members([member]);
          relatedItems = [{ relatedType = #albums(relatedAlbums) }];
        };
      };
      case (null) { Runtime.trap("Entity not found") };
    };
  };

  func getShowsForSong(songId : Text) : [Show.ShowType] {
    let result = List.empty<Show.ShowType>();
    for (show in shows.values()) {
      let setlistArray = show.setlist;
      switch (setlistArray.find(func(id) { id == songId })) {
        case (null) {};
        case (?_) {
          result.add(show);
        };
      };
    };
    result.toArray();
  };

  func getMembersForYear(year : Nat) : [Member.MemberType] {
    let result = List.empty<Member.MemberType>();
    for (member in members.values()) {
      if (year >= member.years.0) {
        switch (member.years.1) {
          case (?endYear) {
            if (year <= endYear) {
              result.add(member);
            };
          };
          case (null) {
            result.add(member);
          };
        };
      };
    };
    result.toArray();
  };

  func getSongsForShow(setlist : [Text]) : [Song.SongType] {
    let result = List.empty<Song.SongType>();
    for (song in songs.values()) {
      switch (setlist.find(func(id) { id == song.id })) {
        case (null) {};
        case (?_) {
          result.add(song);
        };
      };
    };
    result.toArray();
  };

  func getAlbumsForYear(startYear : Nat, endYear : ?Nat) : [Album.AlbumType] {
    let result = List.empty<Album.AlbumType>();
    for (album in albums.values()) {
      if (album.year >= startYear) {
        switch (endYear) {
          case (?endY) {
            if (album.year <= endY) {
              result.add(album);
            };
          };
          case (null) { result.add(album) };
        };
      };
    };
    result.toArray();
  };

  func getAlbumForSong(albumId : Text) : [Album.AlbumType] {
    switch (albums.get(albumId)) {
      case (?album) { [album] };
      case (null) { [] };
    };
  };
};
