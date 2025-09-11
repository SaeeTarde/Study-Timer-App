// src/App.jsx
import React, { useState, useEffect } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home.jsx";
import AddGoal from "./pages/AddGoal.jsx";
import Timer from "./pages/Timer.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import UpdateGoal from "./pages/UpdateGoal.jsx";

import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // listen for token changes (e.g. after login/register)
  useEffect(() => {
    const syncToken = () => setToken(localStorage.getItem("token"));

    // listen to both local changes + external storage changes
    window.addEventListener("storage", syncToken);

    // also patch localStorage.setItem so it updates token immediately
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function (key, value) {
      originalSetItem.apply(this, [key, value]);
      if (key === "token") {
        syncToken();
      }
    };

    return () => {
      window.removeEventListener("storage", syncToken);
      localStorage.setItem = originalSetItem; // restore
    };
  }, []);

  return (
    <Router>
      <Routes>
        {/* Default route → if token, go Home, else Register */}
        <Route
          path="/"
          element={
            token ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/register" replace />
            )
          }
        />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/home"
          element={token ? <Home /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/add-goal"
          element={token ? <AddGoal /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/start-goal"
          element={token ? <Timer /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/update-goal/:id"
          element={token ? <UpdateGoal /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
