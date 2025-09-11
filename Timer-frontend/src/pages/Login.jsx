// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Save token and userId in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);

      console.log("Login successful:", data);
      setToken(data.token); // 🔑 notify App
      // Navigate to Home.jsx
      navigate("/home", { replace: true });
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate("/register");
  };

  const handleClose = () => {
    if (window.electronAPI) {
      window.electronAPI.closeWindow();
    } else {
      console.warn("electronAPI is not available");
    }
  };

  // Reusable gamified button style
  const getButtonProps = (bgColor = "#7e22ce") => ({
    style: {
      WebkitAppRegion: "no-drag",
      backgroundColor: bgColor,
      border: "3px solid #000",
      boxShadow: "0 6px 0 #3b0764",
      transition: "all 0.15s ease",
      cursor: "pointer",
    },
    onMouseEnter: (e) => {
      e.currentTarget.style.transform = "scale(1.1)";
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.transform = "scale(1)";
      e.currentTarget.style.boxShadow = "0 6px 0 #3b0764";
    },
    onMouseDown: (e) => {
      e.currentTarget.style.transform = "scale(0.95)";
      e.currentTarget.style.boxShadow = "0 2px 0 #3b0764";
    },
  });

  return (
    <div
      className="absolute top-0 left-1/2 -translate-x-1/2 w-[320px] h-[420px] 
      bg-gradient-to-b from-[#94FFFD] to-[#0B9499] rounded-[30px] 
      flex flex-col items-center justify-center relative"
      style={{ WebkitAppRegion: "drag" }}
    >
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-[15px] right-[17px] w-10 h-10 flex items-center justify-center 
             rounded-full text-white text-lg font-bold z-20 shadow-md"
        style={{
          WebkitAppRegion: "no-drag",
          backgroundColor: "#0B9499",
          transition: "all 0.1s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#ef4444";
          e.currentTarget.style.transform = "scale(1.2) translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 4px 0 #0B9499";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#0B9499";
          e.currentTarget.style.transform = "scale(1) translateY(0)";
          e.currentTarget.style.boxShadow = "0 2px 0 #0B9499";
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = "scale(0.95) translateY(1px)";
          e.currentTarget.style.boxShadow = "0 1px 0 #0B9499";
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = "scale(1.2) translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 4px 0 #0B9499";
        }}
      >
        ✕
      </button>

      {/* Back Button */}
      <button
        onClick={handleBackClick}
        className="absolute top-[15px] left-[17px] w-10 h-10 flex items-center justify-center rounded-full text-white text-lg font-bold z-20 shadow-md"
        {...getButtonProps("#0B9499")}
      >
        ←
      </button>

      <h1
        className="text-white text-3xl font-['Pixelify_Sans'] mt-[10px]"
        style={{ WebkitTextStroke: "0.9px purple" }}
      >
        STUDY TIMER
      </h1>

      {/* Title */}
      <h1
        className="text-white text-3xl font-['Pixelify_Sans'] mt-[10px]"
        style={{ WebkitTextStroke: "1px #000" }}
      >
        LOGIN
      </h1>

      {/* Email Input */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-[20px] text-center font-['Pixelify_Sans'] tracking-wider z-10"
        style={{
          WebkitAppRegion: "no-drag",
          width: "220px",
          height: "45px",
          background: "rgba(8,8,8,0.3)",
          border: "2px solid #000",
          borderRadius: "20px",
          color: "white",
          fontSize: "22px",
          outline: "none",
          WebkitTextStroke: "0.5px blue",
        }}
      />

      {/* Password Input */}
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-[20px] text-center font-['Pixelify_Sans'] tracking-wider z-10"
        style={{
          WebkitAppRegion: "no-drag",
          width: "220px",
          height: "45px",
          background: "rgba(8,8,8,0.3)",
          border: "2px solid #000",
          borderRadius: "20px",
          color: "white",
          fontSize: "22px",
          outline: "none",
          WebkitTextStroke: "0.5px blue",
        }}
      />

      {/* Login Button */}
      <button
        onClick={handleLogin}
        disabled={loading}
        className="px-[20px] py-[5px] rounded-2xl text-white font-['Pixelify_Sans'] text-xl tracking-wider disabled:opacity-50"
        {...getButtonProps()}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}

export default Login;
