export interface Video {
  id: string,
  name: string,
  datePublished: Date,
  description: string,
  views: number,
  likes: number,
  playlistName: string,
  dislikes: number,
  authorId: string,
  thumbnail: string,
  processing: boolean;
}
