import axios from "axios";

const BASE_URL = "/api";

const app = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

app.interceptors.request.use(
  (config) => config,
  (err) => Promise.reject(err)
);

app.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalConfig = err.config;
    if (err.response?.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;
      try {
        await axios.get(`${BASE_URL}/user/refresh-token`, { withCredentials: true });
        return app(originalConfig);
      } catch (error) {
        return Promise.reject(error);
      }
    }
    return Promise.reject(err);
  }
);

const http = {
  get: app.get.bind(app),
  post: app.post.bind(app),
  delete: app.delete.bind(app),
  put: app.put.bind(app),
  patch: app.patch.bind(app),
};

export default http;
