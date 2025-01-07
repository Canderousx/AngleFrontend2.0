export const environment = {
  production: false,
  backendUrl: "http://localhost:7700",
  getAvatar(userId: string) {
    return this.backendUrl+`/api/auth/accounts/media/getAvatar?userId=${userId}`;
  },
  getThumbnail(videoThumbnail: string) {
    return this.backendUrl+videoThumbnail;
  }
};
