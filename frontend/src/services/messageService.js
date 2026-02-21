import http from "./httpService";

export const sendMessage = (data) => http.post("/message/send", data).then(({ data }) => data.data);
export const getConversation = (userId) => http.get(`/message/conversation/${userId}`).then(({ data }) => data.data);
export const getAllConversations = () => http.get("/message/conversations").then(({ data }) => data.data);
export const markAsRead = (senderId) => http.patch(`/message/read/${senderId}`).then(({ data }) => data.data);
