export const environment = {
  production: false,
  backendUrl: "http://192.168.100.36:7700",
  getAvatar(userId: string) {
    return this.backendUrl+`/api/auth/accounts/media/getAvatar?userId=${userId}`;
  },
  getThumbnail(videoThumbnail: string) {
    return this.backendUrl+videoThumbnail;
  }
};
