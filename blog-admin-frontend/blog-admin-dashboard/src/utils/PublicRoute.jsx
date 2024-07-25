// import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export const PublicRoute = () => {
  //   const { token } = useSelector((state) => state.authSlice);
  return sessionStorage.getItem("token") !== null ? (
    <Navigate to="/" />
  ) : (
    <Outlet />
  );
};
