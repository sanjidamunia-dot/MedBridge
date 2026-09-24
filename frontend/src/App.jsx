import { useState } from "react";
import Login from "./pages/login.jsx";
import Signup from "./pages/signup.jsx";

function App() {
  const [showSignup, setShowSignup] = useState(false);

  return showSignup ? (
    <Signup onLogin={() => setShowSignup(false)} />
  ) : (
    <Login onSignup={() => setShowSignup(true)} />
  );
}

export default App;