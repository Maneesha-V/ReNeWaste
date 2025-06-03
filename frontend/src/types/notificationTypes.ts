// export type Notification = {
//   message: string;
//   createdAt?: string;
// }
export type Notification = {
  _id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  type: string;
}