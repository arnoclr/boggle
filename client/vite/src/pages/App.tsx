import { useState } from "react";
import LoginModal from "../components/LoginModal";
import "./App.css";
import WithRealtime from "../components/WithRealtime";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <LoginModal />
      <WithRealtime></WithRealtime>
    </>
  );
}

export default App;
