import http from "./httpService";

export const getOtp = (data) => http.post("/user/get-otp", data).then(({ data }) => data.data);
export const checkOtp = (data) => http.post("/user/check-otp", data).then(({ data }) => data.data);
export const completeProfile = (data) => http.post("/user/complete-profile", data).then(({ data }) => data.data);
export const getUser = () => http.get("/user/profile").then(({ data }) => data.data);
export const logoutApi = () => http.post("/user/logout").then(({ data }) => data.data);
export const getUsersApi = () => http.get("/admin/user/list").then(({ data }) => data.data);
export const changeUserStatusApi = ({ userId, data }) =>
  http.patch(`/admin/user/verify/${userId}`, data).then(({ data }) => data.data);
