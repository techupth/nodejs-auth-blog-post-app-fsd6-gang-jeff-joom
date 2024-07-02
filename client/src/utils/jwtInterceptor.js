import axios from "axios";

function jwtInterceptor() {
  axios.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  });

  axios.interceptors.response.use(
    (req) => {
      return req;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        window.location.href = "/login";
        localStorage.removeItem("token");
      }
      return Promise.reject(error);
    }
  );
}

export default jwtInterceptor;
