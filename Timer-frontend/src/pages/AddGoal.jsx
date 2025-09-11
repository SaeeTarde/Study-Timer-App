// src/pages/AddGoal.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Glass from "../assets/PIXELGLASS.svg";

function AddGoal() {
  const navigate = useNavigate();
  const [goalName, setGoalName] = useState("");
  const [goalTime, setGoalTime] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Save goal to backend
  const handleSave = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to add a goal.");
        return;
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/goals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ send token
        },
        body: JSON.stringify({ goalName, goalTime }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create goal");
      }

      console.log("Goal created:", data);
      navigate("/home"); // ✅ redirect after success
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = () => {
    navigate("/start-goal"); // Placeholder route for later
  };

  const confirmBack = () => {
    navigate("/home");
  };

  // Reusable button style
  const getButtonProps = (bgColor = "#0B9499") => ({
    style: {
      WebkitAppRegion: "no-drag",
      pointerEvents: "auto",
      backgroundColor: bgColor,
      transition: "all 0.1s ease",
      transform: "scale(1)",
    },
    onMouseEnter: (e) => {
      e.currentTarget.style.backgroundColor = "#ef4444";
      e.currentTarget.style.transform = "scale(1.2) translateY(-2px)";
      e.currentTarget.style.boxShadow = "0 4px 0 #0B9499";
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.backgroundColor = bgColor;
      e.currentTarget.style.transform = "scale(1) translateY(0)";
      e.currentTarget.style.boxShadow = "0 2px 0 #0B9499";
    },
    onMouseDown: (e) => {
      e.currentTarget.style.transform = "scale(0.95) translateY(1px)";
      e.currentTarget.style.boxShadow = "0 1px 0 #0B9499";
    },
    onMouseUp: (e) => {
      e.currentTarget.style.transform = "scale(1.2) translateY(-2px)";
      e.currentTarget.style.boxShadow = "0 4px 0 #0B9499";
    },
  });

  return (
    <div
      className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[400px] 
      bg-gradient-to-b from-[#94FFFD] to-[#0B9499] rounded-[30px] flex flex-col items-center pt-16"
      style={{ WebkitAppRegion: "drag" }}
    >
      {/* Back Button */}
      <button
        onClick={() => setShowPopup(true)}
        className="absolute top-[15px] left-[17px] w-10 h-10 flex items-center justify-center 
        rounded-full text-white text-lg font-bold z-20 shadow-md"
        {...getButtonProps()}
      >
        ←
      </button>
      {/* Popup Confirmation */}
      {showPopup && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
          <div
            className="bg-gradient-to-b from-[#94FFFD] to-[#0B9499] border-4 border-black 
            rounded-[20px] p-6 flex flex-col items-center"
            style={{
              WebkitAppRegion: "no-drag",
              boxShadow: "6px 6px 0px #222",
              fontFamily: "Pixelify Sans",
            }}
          >
            <p className="text-white text-xl font-['Pixelify_Sans'] mb-4">
              ❓ Want to go back?
            </p>
            <div className="flex space-x-6">
              <button
                onClick={confirmBack}
                className="px-6 py-2 bg-[#7e22ce] text-white font-['Pixelify_Sans'] 
                border-2 border-black rounded-lg shadow-[0_4px_0_#3b0764] active:translate-y-[2px]"
              >
                ✅ Yes
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="px-6 py-2 bg-gray-500 text-white font-['Pixelify_Sans'] 
                border-2 border-black rounded-lg shadow-[0_4px_0_#111] active:translate-y-[2px]"
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Add Goal */}
      <h2 className="text-white text-xl mb-4 mt-[25px] font-['Pixelify_Sans']">
        ADD NEW GOAL
      </h2>
      {/* Goal Name Label */}
      <label
        className="absolute font-['Pixelify_Sans']"
        style={{
          width: "600px",
          height: "20px",
          top: "55px",
          fontWeight: 10000,
          fontSize: "30px",
          lineHeight: "74px",
          display: "flex",
          textAlign: "center",
          letterSpacing: "0.05em",
          justifyContent: "center",
          color: "#FFFFFF",
          border: "none",
          WebkitTextStroke: "0.9px #000000",
        }}
      >
        NAME OF GOAL
      </label>
      {/* Goal Name Input */}
      <input
        type="text"
        placeholder="Goal Name"
        value={goalName}
        onChange={(e) => setGoalName(e.target.value)}
        className="absolute text-center font-['Pixelify_Sans'] tracking-wider z-10"
        style={{
          WebkitAppRegion: "no-drag",
          width: "250px",
          height: "50px",
          top: "125px",
          background: "rgba(8, 8, 8, 0.3)",
          border: "2px solid #000",
          borderRadius: "30px",
          outline: "none",
          color: "white",
          fontSize: "24px",
          WebkitTextStroke: "1px blue",
        }}
      />

      {/*SET TIME LABEL*/}
      <label
        className="absolute font-['Pixelify_Sans'] z-10"
        style={{
          width: "600px",
          height: "20px",
          top: "190px",
          fontWeight: 10000,
          fontSize: "34px",
          lineHeight: "74px",
          display: "flex",
          textAlign: "center",
          letterSpacing: "0.02em",
          justifyContent: "center",
          color: "#FFFFFF",
          border: "none",
          WebkitTextStroke: "1px #000000",
        }}
      >
        SET TIME
      </label>

      {/* Goal Time Input */}
      <input
        type="text"
        placeholder="00:00"
        value={goalTime}
        onChange={(e) => {
          let val = e.target.value.replace(/[^0-9]/g, "");
          if (val.length >= 3) val = val.slice(0, 2) + ":" + val.slice(2, 4);
          if (val.length > 5) val = val.slice(0, 5);
          setGoalTime(val);
        }}
        className="absolute text-center font-['Pixelify_Sans'] tracking-widest z-10"
        style={{
          WebkitAppRegion: "no-drag",
          top: "65.5%",
          background: "rgba(8, 8, 8, 0.3)",
          borderRadius: "30px",
          border: "2px solid #000",
          outline: "none",
          width: "180px",
          height: "50px",
          color: "white",
          fontSize: "32px",
          WebkitTextStroke: "1px blue",
        }}
      />
      {/* Glass Image */}
      <img
        src={Glass}
        alt="Glass"
        className="w-[200px] h-[200px] absolute top-[125px] z-0 mt-[20px] pointer-events-none"
      />

      {/* Save and Start Buttons */}
      <div
        className="flex space-x-[60px] mt-[270px]"
        style={{ WebkitAppRegion: "no-drag" }}
      >
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-[12px] py-3 rounded-2xl text-white font-['Pixelify_Sans'] 
          text-2xl tracking-wider shadow-[0_6px_0_#3b0764] active:translate-y-[4px]"
          style={{ background: "#7e22ce", border: "3px solid #000" }}
        >
          {loading ? "Saving..." : "Save"}
        </button>

        <button
          onClick={handleStart}
          className="px-8 py-3 rounded-2xl text-white font-['Pixelify_Sans'] 
          text-2xl tracking-wider shadow-[0_6px_0_#3b0764] active:translate-y-[4px]"
          style={{ background: "#7e22ce", border: "3px solid #000" }}
        >
          Start
        </button>
      </div>
    </div>
  );
}

export default AddGoal;
