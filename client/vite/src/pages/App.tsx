import { useState } from "react";
import LoginModal from "../components/LoginModal";
import "./App.css";
import Game from "./Game";
import Footer from "../components/Footer";

function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateRows: "1fr auto",
      }}
    >
      <div>
        <LoginModal />
        <Game></Game>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default App;
