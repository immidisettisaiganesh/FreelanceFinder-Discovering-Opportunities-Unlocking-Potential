import http from "./httpService";

export const getProjects = (params) => http.get("/project/list", { params }).then(({ data }) => data.data);
export const getOwnerProjects = (params) => http.get("/project/owner-projects", { params }).then(({ data }) => data.data);
export const getProjectById = (id) => http.get(`/project/${id}`).then(({ data }) => data.data);
export const createProject = (data) => http.post("/project/add", data).then(({ data }) => data.data);
export const updateProject = ({ id, data }) => http.patch(`/project/update/${id}`, data).then(({ data }) => data.data);
export const deleteProject = (id) => http.delete(`/project/${id}`).then(({ data }) => data.data);
export const toggleProjectStatus = ({ id, data }) => http.patch(`/project/${id}`, data).then(({ data }) => data.data);
