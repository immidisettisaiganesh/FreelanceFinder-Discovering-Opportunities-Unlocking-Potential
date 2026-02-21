import http from "./httpService";

export const submitWork = (formData) =>
  http.post("/submission/submit", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then(({ data }) => data.data);

export const getSubmissionByProject = (projectId) =>
  http.get(`/submission/project/${projectId}`).then(({ data }) => data.data);

export const reviewSubmission = ({ id, data }) =>
  http.patch(`/submission/review/${id}`, data).then(({ data }) => data.data);

export const getMySubmissions = () =>
  http.get("/submission/my").then(({ data }) => data.data);
