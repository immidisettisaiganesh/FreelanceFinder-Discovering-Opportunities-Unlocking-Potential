import http from "./httpService";

export const getNotifications = () => http.get("/notification").then(({ data }) => data.data);
export const markNotifAsRead = (id) => http.patch(`/notification/read/${id}`).then(({ data }) => data.data);
export const markAllNotifAsRead = () => http.patch("/notification/read-all").then(({ data }) => data.data);
export const deleteNotification = (id) => http.delete(`/notification/${id}`).then(({ data }) => data.data);
