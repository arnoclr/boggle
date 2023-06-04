import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Footer from "../components/Footer";
import LoginModal from "../components/LoginModal";
import "./App.css";
import ErrorPage from "./ErrorPage";
import Game from "./Game";
import Home from "./Home";
import Profile from "./Profile";
import { useState } from "react";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home></Home>,
      errorElement: <ErrorPage></ErrorPage>,
    },
    {
      path: "/g/:gameId",
      element: <Game loggedIn={loggedIn}></Game>,
    },
    {
      path: "/p/:username",
      element: <Profile></Profile>,
    },
  ]);

  function onLogin() {
    setLoggedIn(true);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateRows: "1fr auto",
      }}
    >
      <div>
        <LoginModal onLogin={onLogin} />
        <RouterProvider router={router}></RouterProvider>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default App;
