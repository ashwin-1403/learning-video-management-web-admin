import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./App.scss";
import AppRoutes from "./routes/AppRoutes";
import {
  handleAxiosError,
  handleAxiosResponse,
} from "./Utils/intercepterHandler/intercepterHandler";

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

function App() {
  const isLogin = localStorage.getItem("isLogin");
  const [isUser, setIsUser] = useState(isLogin ? Boolean(isLogin) : false);
  const navigateToLoginPage = useNavigate();

  useEffect(() => {
    // Set up a response interceptor for the axiosInstance
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => handleAxiosResponse(response),
      (error) => handleAxiosError(error, navigateToLoginPage, setIsUser),
    );

    // Set up a request interceptor for the axiosInstance
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Clean up both interceptors when the component unmounts
    return () => {
      axiosInstance.interceptors.response.eject(responseInterceptor);
      axiosInstance.interceptors.request.eject(requestInterceptor);
    };
  }, []);

  useEffect(() => {
    const handleWindowResize = () => {};

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <div className="App">
      <AppRoutes isUser={isUser} setIsUser={setIsUser} />
    </div>
  );
}

export default App;
