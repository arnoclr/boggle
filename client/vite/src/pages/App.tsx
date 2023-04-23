import { useState } from "react";
import LoginModal from "../components/LoginModal";
import "./App.css";
import Game from "./Game";

function App() {
  return (
    <>
      <LoginModal />
      <Game></Game>
    </>
  );
}

export default App;
