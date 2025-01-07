export interface Notification {
  id: string,
  ownerId: string,
  datePublished: Date,
  title: string,
  image: string,
  url: string,
  seen: boolean,
  forUser: boolean,
}
