import http from "./httpService";
export const getCategoryList = () => http.get("/category/list").then(({ data }) => data.data);
