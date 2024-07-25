// import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export const ProtectedRoutes = () => {
  //   const { token } = useSelector((state) => state.authSlice);
  return sessionStorage.getItem("token") !== null ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
};
