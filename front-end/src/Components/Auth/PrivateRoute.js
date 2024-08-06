import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const PrivateRoute = () => {
  const { accessToken } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) {
      // Redirect to login page with the current location as state
      navigate("/auth/login", {
        replace: true,
        state: { from: location.pathname },
      });
    }
  }, [accessToken, navigate, location]);

  return accessToken ? <Outlet /> : null;
};

export default PrivateRoute;
