// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // prevent double clicks
  const [token, setToken] = useState(null);

  const handleClose = () => {
    if (window.electronAPI) {
      window.electronAPI.closeWindow();
    } else {
      console.warn("electronAPI is not available");
    }
  };

  const handleRegister = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ username, email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      console.log("✅ Register success:", data);

      // Save token + userId in localStorage (same as Login.jsx)
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      setToken(data.token); // 🔑 tell App that token exists
      // Navigate immediately
      navigate("/home", { replace: true });
    } catch (err) {
      console.error("❌ Register error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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
      flex flex-col items-center justify-center"
      style={{ WebkitAppRegion: "drag" }}
    >
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-[15px] right-[17px] w-10 h-10 flex items-center justify-center 
             rounded-full text-white text-lg font-bold z-20 shadow-md"
        style={{
          WebkitAppRegion: "no-drag",
          pointerEvents: "auto",
          backgroundColor: "#0B9499",
          transition: "all 0.1s ease",
          transform: "scale(1)", // default
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#ef4444"; // hover red
          e.currentTarget.style.transform = "scale(1.2) translateY(-2px)"; // pop up
          e.currentTarget.style.boxShadow = "0 4px 0 #0B9499"; // 3D shadow
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#0B9499"; // back to original
          e.currentTarget.style.transform = "scale(1) translateY(0)"; // back to normal
          e.currentTarget.style.boxShadow = "0 2px 0 #0B9499"; // reset shadow
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = "scale(0.95) translateY(1px)"; // pressed down
          e.currentTarget.style.boxShadow = "0 1px 0 #0B9499";
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = "scale(1.2) translateY(-2px)"; // pop back after click
          e.currentTarget.style.boxShadow = "0 4px 0 #0B9499";
        }}
      >
        ✕
      </button>

      <h1
        className="text-white text-3xl font-['Pixelify_Sans'] mt-[10px]"
        style={{ WebkitTextStroke: "0.9px purple" }}
      >
        STUDY TIMER
      </h1>

      <h1
        className="text-white text-3xl font-['Pixelify_Sans'] mt-[2px]"
        style={{ WebkitTextStroke: "0.2px #000" }}
      >
        REGISTER
      </h1>

      {/* Username Input */}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="mb-[15px] text-center font-['Pixelify_Sans'] tracking-wider z-10"
        style={{
          WebkitAppRegion: "no-drag",
          width: "220px",
          height: "35px",
          background: "rgba(8,8,8,0.3)",
          border: "2px solid #000",
          borderRadius: "20px",
          color: "white",
          fontSize: "20px",
          outline: "none",
          WebkitTextStroke: "0.5px blue",
        }}
      />

      {/* Email Input */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-[15px] text-center font-['Pixelify_Sans'] tracking-wider z-10"
        style={{
          WebkitAppRegion: "no-drag",
          width: "220px",
          height: "35px",
          background: "rgba(8,8,8,0.3)",
          border: "2px solid #000",
          borderRadius: "20px",
          color: "white",
          fontSize: "20px",
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
        className="mb-[15px] text-center font-['Pixelify_Sans'] tracking-wider z-10"
        style={{
          WebkitAppRegion: "no-drag",
          width: "220px",
          height: "35px",
          background: "rgba(8,8,8,0.3)",
          border: "2px solid #000",
          borderRadius: "20px",
          color: "white",
          fontSize: "20px",
          outline: "none",
          WebkitTextStroke: "0.5px blue",
        }}
      />

      {/* Error Message */}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {/* Register Button */}
      <button
        onClick={handleRegister}
        disabled={loading}
        className="px-[20px] py-[5px] mb-3 rounded-2xl text-white font-['Pixelify_Sans'] text-xl tracking-wider"
        {...getButtonProps()}
      >
        {loading ? "Registering..." : "Register"}
      </button>

      <h4 className="text-white text-1xl font-['Pixelify_Sans'] mt-[30px] mb-[10px]">
        Account already exists
      </h4>

      {/* Already have account? → Login Button */}
      <button
        onClick={() => navigate("/login")}
        className="px-[20px] py-[5px] rounded-2xl text-white font-['Pixelify_Sans'] text-xl tracking-wider mb-[15px]"
        {...getButtonProps("#2563eb")} // blue button
      >
        Login
      </button>
    </div>
  );
}

export default Register;
