// src/App.jsx
import React from "react";
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
  const token = localStorage.getItem("token"); // check token in storage

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
