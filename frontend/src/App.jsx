import React, { useEffect } from "react";
import Index from "./pages/Index";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import { useUserStore } from "./stores/useUserStore";
import Dashboard from "./pages/Dashboard";
import SignUpPage from "./pages/SignUpPage";
import { Toaster } from "react-hot-toast";
import ForgotPassPage from "./pages/ForgotPassPage";
import ResetPassPage from "./pages/ResetPassPage";
import FAQs from "./pages/FAQs";

const App = () => {
  const { user, checkingAuth, checkAuth } = useUserStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (checkingAuth) {
    return <p className="text-lg">Loading...</p>;
  }

  return (
    <div className="relative overflow-hidden w-full">
      <Toaster />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="signup" element={!user && <SignUpPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="forgot-password" element={<ForgotPassPage />} />
        <Route path="/reset-password/:token" element={<ResetPassPage />} />
        <Route path="dashboard" element={!user ? <Index /> : <Dashboard />} />
        <Route path="FAQs" element={<FAQs />} />
      </Routes>
    </div>
  );
};

export default App;