import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Dashboard from "../pages/Dashboard/Dashboard";
import { Login } from "../Auth/Login";
import Forgot from "../Auth/Forgot";

import Category from "../pages/Category/Category";
import AddCategory from "../pages/Category/AddCategory/AddCategory";
import SubCategory from "../pages/Category/CategoryList/SubCategory";
import AddVideo from "../pages/AddVideo/AddVideo";
import VideoList from "../pages/VideoList/VideoList";
import Student from "../pages/Student/Student";

import AddStudent from "../pages/Student/AddStudent";
import { allRoutes } from "./path";
import Assignment from "../pages/Assignemnt/Assignment";
import AddAssignment from "../pages/Assignemnt/AddAssignment";

function AppRoutes({ isUser, setIsUser }) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const Param = queryParams.get("pass");

  return (
    <Dashboard isUser={isUser} setIsUser={setIsUser}>
      <Routes>
        <Route
          path={allRoutes.login}
          element={
            <PublicRoute>
              <Login setIsUser={setIsUser} />
            </PublicRoute>
          }
        />
        <Route
          path={allRoutes.student}
          element={
            <PrivateRoute>
              <Student />
            </PrivateRoute>
          }
        />

        <Route
          path={`${allRoutes.addStudent}/:studentId`}
          element={
            <PrivateRoute>
              <AddStudent />
            </PrivateRoute>
          }
        />
        <Route
          path={allRoutes.addStudent}
          element={
            <PrivateRoute>
              <AddStudent />
            </PrivateRoute>
          }
        />
        <Route
          path={allRoutes.forgotPassword}
          element={
            <PublicRoute>
              <Forgot />
            </PublicRoute>
          }
        />

        <Route
          path={allRoutes.videoList}
          element={
            <PrivateRoute>
              <VideoList />
            </PrivateRoute>
          }
        />
        <Route
          path={allRoutes.addVideo}
          element={
            <PrivateRoute>
              <AddVideo />
            </PrivateRoute>
          }
        />

        <Route
          path={`${allRoutes.addVideo}/:videoId`}
          element={
            <PrivateRoute>
              <AddVideo />
            </PrivateRoute>
          }
        />

        <Route
          path={allRoutes.category}
          element={
            <PrivateRoute>
              <Category />
            </PrivateRoute>
          }
        />

        <Route
          path={allRoutes.subCategory}
          element={
            <PrivateRoute>
              <SubCategory />
            </PrivateRoute>
          }
        />
        <Route
          path={allRoutes.assignment}
          element={
            <PrivateRoute>
              <Assignment />
            </PrivateRoute>
          }
        />
        <Route
          path={allRoutes.addAssignment}
          element={
            <PrivateRoute>
              <AddAssignment />
            </PrivateRoute>
          }
        />
        <Route
          path={`${allRoutes.addAssignment}/:assignmentId`}
          element={
            <PrivateRoute>
              <AddAssignment />
            </PrivateRoute>
          }
        />
      </Routes>
    </Dashboard>
  );
}

export default AppRoutes;

function PublicRoute({ children }) {
  const token = localStorage.getItem("token");

  const isAuthenticated = Boolean(token);
  return isAuthenticated ? <Navigate to={allRoutes.category} /> : children;
}

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  const isAuthenticated = Boolean(token);
  return isAuthenticated ? children : <Navigate to={allRoutes.login} />;
}
