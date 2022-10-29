import React from "react";
import ReactDOM from "react-dom/client";
import {
  createHashRouter,
  RouterProvider
} from "react-router-dom";
import "./index.css";

import Root from './routes/Root'
import dataLoader from './data/dataLoader'
import Home from './routes/Home'
import BuildSim from "./routes/BuildSim";
import StatPage from './routes/stats/StatPage'
import About from "./routes/About";

const router = createHashRouter(
  [
    {
      path: "/",
      element: <Root/>,
      children: [
        {
          path: "",
          element: <Home/>
        },
        {
          path: "buildsim",
          element: <BuildSim/>,
          loader: dataLoader,
        },
        {
          path: "about",
          element: <About/>,
          loader: dataLoader,
        },
        {
          path: "stats/drives",
          element: <StatPage for="drives"/>,
          loader: dataLoader,
        },
        {
          path: "stats/powerplants",
          element: <StatPage for="powerplants"/>,
          loader: dataLoader,
        },
        {
          path: "stats/radiators",
          element: <StatPage for="radiators"/>,
          loader: dataLoader,
        },
        {
          path: "stats/techs",
          element: <StatPage for="techs"/>,
          loader: dataLoader,
        },
        {
          path: "stats/hulls",
          element: <StatPage for="hulls"/>,
          loader: dataLoader,
        },
        {
          path: "stats/batteries",
          element: <StatPage for="batteries"/>,
          loader: dataLoader,
        },
        {
          path: "stats/weapons",
          element: <StatPage for="weapons"/>,
          loader: dataLoader,
        },
        {
          path: "stats/armor",
          element: <StatPage for="armor"/>,
          loader: dataLoader,
        }
      ]
    },
  ]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

