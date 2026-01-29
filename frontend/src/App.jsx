import { React, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import socket from "./socket";
import { useAuth } from "./context/AuthContext";

const App = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      socket.auth = { token: localStorage.getItem("token") };
      socket.connect();
    } else {
      socket.disconnect();
    }

    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (!socket || !user?._id) return;

    socket.emit("setup", user._id);
  }, [socket, user]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />

      {/* This is default */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default App;
