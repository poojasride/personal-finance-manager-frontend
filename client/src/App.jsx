import SignUp from "./Pages/SignUp";
import SignIn from "./Pages/SignIn";
import ForgotPassword from "./Pages/ForgotPassword";
import CheckEmail from "./Pages/CheckEmail";
import { Routes, Route, Link } from "react-router-dom";
import Welcome from "./Pages/Welcome";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/check-email" element={<CheckEmail />} />
      </Routes>
    </>
  );
}

export default App;
