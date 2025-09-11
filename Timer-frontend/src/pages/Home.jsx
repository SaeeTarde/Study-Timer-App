// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import Calendar from "../components/Calendar.jsx";
import Glass from "../assets/PIXELGLASS.svg";
import { useNavigate } from "react-router-dom";
import "../styles/style.css";

function Home() {
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);

  // Fetch goals from backend
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("http://localhost:5000/api/goals", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch goals");

        setGoals(data);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchGoals();
  }, []);

  // Close button handler
  const handleClose = () => {
    if (window.electronAPI) {
      window.electronAPI.closeWindow();
    } else {
      console.warn("electronAPI is not available");
    }
  };

  // Start goal handler
  const handleStart = (goalId) => {
    navigate("/start-goal", { state: { goalId } });
  };

  return (
    <div
      className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[400px] bg-gradient-to-b from-[#94FFFD] to-[#0B9499] rounded-[30px] flex flex-col"
      style={{ WebkitAppRegion: "drag" }}
    >
      {/* Bubbles Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="bubble"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${5 + Math.random() * 10}px`,
              height: `${5 + Math.random() * 10}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
              backgroundColor: "#ffffff80", // semi-transparent white
            }}
          />
        ))}
      </div>
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-[10px] right-[17px] w-10 h-10 flex items-center justify-center 
             rounded-full text-white text-lg font-bold z-20 shadow-md"
        style={{
          WebkitAppRegion: "no-drag",
          pointerEvents: "auto",
          backgroundColor: "#0B9499",
          transition: "all 0.1s ease",
          transform: "scale(1)",
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

      {/* Top Section */}
      <div className="flex flex-col items-center mt-6 space-y-6">
        {/* Calendar */}
        <Calendar />

        {/* Add Goal button */}
        <div
          className="relative flex justify-center w-full mt-[30px]"
          style={{ WebkitAppRegion: "no-drag" }}
        >
          {/* Glass behind */}
          <img
            src={Glass}
            alt="Glass"
            className="w-[280px] h-[280px] absolute top-[-60px] z-0 mt-[30px] pointer-events-none"
            style={{ opacity: 0.75 }} // <-- adjust 0.1 to 0.9 as needed
          />

          {/* Button in front */}
          <button
            onClick={() => navigate("/add-goal")}
            className="relative z-10 px-[40px] py-[6px] bg-[#3B82F680]/100 rounded-full text-[20px] font-['Jersey_10'] text-black flex items-center justify-center space-x-2 mt-[35px] border-none
               shadow-md transition-transform duration-150 ease-in-out transform hover:-translate-y-1 hover:scale-105 active:scale-95"
          >
            <span>ADD GOAL</span>
            <span className="text-xl font-bold">+</span>
          </button>
        </div>
      </div>

      {/* Saved Goals List */}
      <div
        className="flex flex-col items-center mt-6 space-y-4 px-4 overflow-y-auto"
        style={{ WebkitAppRegion: "no-drag" }}
      >
        {goals.map((goal) => (
          <div
            key={goal._id}
            className="flex items-center justify-between w-full max-w-[250px] px-4 py-2 bg-[#3B82F680]/30 rounded-full text-[16px] font-['Jersey_10'] text-black shadow-md mt-[10px] z-10 cursor-pointer transition-transform duration-150 ease-in-out transform hover:bg-[#3B82F680]/100 "
            onClick={() => navigate(`/update-goal/${goal._id}`)} // ✅ Navigate with goalId
          >
            {/* Goal Name & Time */}
            <span className="truncate">
              {goal.goalName} ({goal.goalTime})
            </span>

            {/* Start Button */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // ✅ Prevent triggering update navigation
                handleStart(goal._id);
              }}
              className="ml-3 px-3 py-1 text-sm bg-[#7e22ce] text-white font-['Pixelify_Sans'] 
        border-2 border-[#3b0764] shadow-[4px_4px_0_#3b0764] 
        transition-all duration-150 
        hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#3b0764]
        active:translate-x-[4px] active:translate-y-[4px] active:shadow-[0px_0px_0_#3b0764]"
            >
              Start
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
