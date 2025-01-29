import React, { createContext, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./App2.css";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./Components/Home/Home";
import JobDetail from "./Components/Job/JobDetail";
import MyJobs from "./Components/Job/MyJobs";
import Application from "./Components/application/Application";
import MyApplication from "./Components/application/MyApplication";
import NotFound from "./Components/NotFound/NotFound";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import Jobs from "./Components/Job/Jobs";
import { Provider } from "react-redux";
import PostJob from "./Components/Job/PostJob";
import store from "./Store/index.js";
import UpdateJob from "./Components/Job/UpdateJob.jsx";
import DeleteJob from "./Components/Job/DeleteJob.jsx";
import MyJobDetail from "./Components/Job/myJobDetail.jsx";
import Viewapplication from "./Components/application/ViewApplication.jsx";
import Profile from "./Components/Profile/Profile.jsx";

import RecruiterLogin from "./Components/Auth/RecruiterLogin.jsx";
import SavedJobs from "./Components/Job/SavedJobs.jsx";
import Profilemain from "./Components/Profile/Profilemain.jsx";

import CategoryJobs from "./Components/Job/CategoryJobs.jsx";
import JobsByType from "./Components/Job/JobsByType.jsx";

import SavedJobsDetails from "./Components/Job/SavedJobsDetails.jsx";
import ViewApplication from "./Components/application/ViewApplication.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "login",
        element: <Login></Login>,
      },
      {
        path: "register",
        element: <Register></Register>,
      },
      {
        path: "job/getall",
        element: <Jobs></Jobs>,
      },
      {
        path: "job/post",
        element: <PostJob></PostJob>,
      },
      {
        path: "savedJobs",
        element: <SavedJobs profile={true}></SavedJobs>,
      },
      {
        path: "recruiterlogin",
        element: <RecruiterLogin></RecruiterLogin>,
      },
      ,
      {
        path: "job/delete/:id",
        element: <DeleteJob></DeleteJob>,
      },
      {
        path: "application/:id",
        element: <Application></Application>,
      },
      {
        path: "application/viewapplication/:id",
        element: <Viewapplication></Viewapplication>,
      },
      {
        path: "profile",
        element: <Profilemain />,
        children: [
          { path: "", element: <Profile /> },
          { path: "savedJobs", element: <SavedJobs /> },
          {
            path: "savedJobs/:id",
            element: <SavedJobsDetails></SavedJobsDetails>,
          },
          {
            path: "application/me",
            element: <MyApplication></MyApplication>,
          },

          {
            path: "application/me/job/:id",
            element: <JobDetail></JobDetail>,
          },
          {
            path: "job/me",
            element: <MyJobs />, // Route for "My Jobs" list
          },
          {
            path: "job/me/:id",
            element: <MyJobDetail></MyJobDetail>,
          },
          {
            path: "job/me/application/viewapplication/:id",
            element: <ViewApplication></ViewApplication>,
          },
          {
            path: "job/me/update/:id",
            element: <UpdateJob></UpdateJob>,
          },
        ],
      },
      {
        path: "category/jobs/:category",
        element: <CategoryJobs></CategoryJobs>,
      },
      {
        path: "jobtype/:type",
        element: <JobsByType />,
      },
      {
        path: "job/:id",
        element: <JobDetail />,
      },
      {
        path: "*",
        element: <NotFound></NotFound>,
      },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
      {/* //it must be outside of routerprovider */}
      <ToastContainer
        position="top-center" // Change position to center
        autoClose={5000}
        hideProgressBar={false}
        draggable
        pauseOnFocusLoss
      />
    </Provider>
  </React.StrictMode>
);
