import { Toaster } from "react-hot-toast";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UpdateProfile from "../src/component/UpdateProfile";
import ForgotPassword from "../src/component/ForgotPassword"
function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/edit" element={<UpdateProfile />} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />

      </Routes>
    </>
  );
}

export default App;
