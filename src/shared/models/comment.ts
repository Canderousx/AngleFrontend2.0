export interface Comment {
  id?: string,
  authorId: string,
  videoId: string,
  datePublished?: string,
  authorName:string,
  content: string,
  extended?: boolean,
}
