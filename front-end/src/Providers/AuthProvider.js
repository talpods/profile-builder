import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  clearTokens,
  refreshToken,
  setTokens,
  setUser,
} from "../State/auth/authSlice";
import CookieManager from "../Utils/cookieManager";
import { USER_INFO_API } from "../api";

function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { accessToken, refreshToken: refreshTokenValue } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    const storedAccessToken = CookieManager.get("accessToken");
    const storedRefreshToken = CookieManager.get("refreshToken");
    if (storedAccessToken && storedRefreshToken) {
      dispatch(
        setTokens({
          accessToken: storedAccessToken,
          refreshToken: storedRefreshToken,
        })
      );
    }
  }, [dispatch]);

  useEffect(() => {
    if (accessToken && refreshTokenValue) {
      CookieManager.set("accessToken", accessToken, {
        secure: true,
        sameSite: "strict",
      });
      CookieManager.set("refreshToken", refreshTokenValue, {
        secure: true,
        sameSite: "strict",
      });
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      axios.defaults.headers.common["refreshToken"] = refreshTokenValue;
    } else {
      CookieManager.remove("accessToken");
      CookieManager.remove("refreshToken");
      delete axios.defaults.headers.common["Authorization"];
      delete axios.defaults.headers.common["refreshToken"];
    }
  }, [accessToken, refreshTokenValue]);

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        if (refreshTokenValue) {
          config.headers["refreshToken"] = refreshTokenValue;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response.status === 401 &&
          !originalRequest._retry &&
          !originalRequest.url.includes("/api/login")
        ) {
          originalRequest._retry = true;

          try {
            const action = await dispatch(refreshToken()).unwrap();
            const newAccessToken = action.accessToken;
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;
            originalRequest.headers["refreshToken"] = refreshTokenValue;
            return axios(originalRequest);
          } catch (refreshError) {
            dispatch(clearTokens());
            navigate("/auth/login");
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, refreshTokenValue, dispatch, navigate]);

  useEffect(() => {
    const fetchUser = async () => {
      if (accessToken) {
        try {
          const response = await axios.get(USER_INFO_API);
          dispatch(setUser(response.data));
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUser();
  }, [accessToken, dispatch]);

  return <>{children}</>;
}

export default AuthProvider;
