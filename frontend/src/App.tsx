
import { Routes, Route } from "react-router-dom";

import Home from "./pages/home/Home";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import AppRoutes from './routes/AppRoutes';
import VolunteerInfo from "./pages/VolunteerInfo/VolunteerInfo";
import TermsOfService from "./pages/TermsOfService/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy"; 
import Contact from "./pages/Contact/Contact"; 
import CommunityGuidelines from "./pages/CommunityGuidelines/CommunityGuidelines";
import "./dashboard.css";
import ForgotPassword from "./pages/Auth/ForgotPassword";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/volunteer-info" element = {<VolunteerInfo/>} /> 
      <Route path="/terms-and-conditions" element = {<TermsOfService /> } />
      <Route path="/contact" element = {<Contact /> } />
      <Route path="/privacy-policy" element = {<PrivacyPolicy /> } />
      <Route path="/community-guidelines" element = {<CommunityGuidelines /> } />
      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />
      <Route path="/*" element={<AppRoutes />} />
    </Routes>
  );
}
