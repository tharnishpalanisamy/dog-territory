
import { Routes, Route } from "react-router-dom";

import Home from "./pages/home/Home";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import AppRoutes from './routes/AppRoutes';

import "./dashboard.css";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      <Route path="/*" element={<AppRoutes />} />
    </Routes>
  );
}
