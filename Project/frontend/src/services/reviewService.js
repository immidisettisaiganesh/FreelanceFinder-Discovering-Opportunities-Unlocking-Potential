import http from "./httpService";

export const addReview = (data) => http.post("/review/add", data).then(({ data }) => data.data);
export const getUserReviews = (userId) => http.get(`/review/user/${userId}`).then(({ data }) => data.data);
export const getProjectReviews = (projectId) => http.get(`/review/project/${projectId}`).then(({ data }) => data.data);
