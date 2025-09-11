// src/pages/Timer.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/style.css";

function Timer() {
  const navigate = useNavigate();
  const location = useLocation();
  const { goalId } = location.state || {}; // ✅ coming from Home.jsx

  const [goal, setGoal] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);

  const [isRunning, setIsRunning] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [selectedJuice, setSelectedJuice] = useState(null);
  const [goalName, setGoalName] = useState("");

  const [hoverYes, setHoverYes] = useState(false);
  const [hoverCancel, setHoverCancel] = useState(false);

  const intervalRef = useRef(null);
  const restoredRef = useRef(false); // <- add this
  const storageKey = `timer-${goalId}`; // ✅ unique key per goal

  // ✅ Parse goalTime (HH:MM) → seconds
  const parseTime = (timeStr) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(":").map(Number);
    return h * 3600 + m * 60;
  };

  // ✅ Fetch goal details & restore saved state if available
  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || !goalId) return;

        const res = await fetch(`http://localhost:5000/api/goals/${goalId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch goal");

        setGoal(data);
        setGoalName(data.goalName); // ✅ correct field from backend
        console.log("Fetched goal data:", data);

        const total = parseTime(data.goalTime);
        setTotalSeconds(total);

        // ✅ Try restoring saved state first (robust parsing)
        let saved = null;
        try {
          const raw = localStorage.getItem(storageKey);
          saved = raw ? JSON.parse(raw) : null;
        } catch (e) {
          console.error("Failed to parse saved timer state:", e);
          saved = null;
        }
        console.log("Saved state for goal:", storageKey, saved);

        if (
          saved &&
          typeof saved.secondsLeft === "number" &&
          saved.secondsLeft > 0
        ) {
          setSecondsLeft(saved.secondsLeft);
          setIsRunning(false); // Always paused when reopening
          setSelectedJuice(saved.selectedJuice);
        } else {
          // Only set fresh total if no saved state
          setSecondsLeft(total);
        }

        // mark restore complete so the save effect can start writing
        restoredRef.current = true;
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchGoal();
  }, [goalId]);

  // ✅ Save to localStorage whenever state changes (but only after initial restore)
  useEffect(() => {
    if (!goalId || !restoredRef.current) return; // <-- important guard
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          secondsLeft,
          isRunning,
          selectedJuice,
        })
      );
    } catch (e) {
      console.error("Failed to save timer state:", e);
    }
  }, [secondsLeft, isRunning, selectedJuice, goalId]);

  // ✅ Timer countdown effect
  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setIsRunning(false);
            setShowCompleted(true);

            // ✅ Reset storage on completion
            localStorage.removeItem(storageKey);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, secondsLeft]);

  // ✅ Format seconds → HH:MM:SS or MM:SS
  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((secs % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return h !== "00" ? `${h}:${m}:${s}` : `${m}:${s}`;
  };

  console.log("goalName is:", goalName); // ✅ log here, outside JSX

  // ✅ Glass fill %
  const fillPercent = totalSeconds > 0 ? (secondsLeft / totalSeconds) * 100 : 0;

  // ✅ Back popup
  const handleBackClick = () => setShowPopup(true);
  const handleConfirmStop = () => {
    setShowPopup(false);
    // ❌ If you want: clear saved state when leaving
    // localStorage.removeItem(storageKey);
    navigate("/home");
  };
  const handleCancel = () => setShowPopup(false);

  // ✅ Toggle timer
  const toggleTimer = () => {
    if (!selectedJuice) {
      alert("Please select a juice first! 🧃");
      return;
    }
    setIsRunning((prev) => !prev);
  };

  if (!goal) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-bold">
        Loading goal...
      </div>
    );
  }

  return (
    <div
      className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[400px] bg-gradient-to-b from-[#94FFFD] to-[#0B9499] rounded-[30px] flex flex-col items-center pt-16"
      style={{ WebkitAppRegion: "drag" }}
    >
      {/* Back Button */}
      <button
        onClick={handleBackClick}
        className="absolute top-[15px] left-[17px] w-10 h-10 flex items-center justify-center rounded-full text-white text-lg font-bold z-40 shadow-md"
        style={{
          WebkitAppRegion: "no-drag",
          pointerEvents: "auto",
          backgroundColor: "#0B9499",
        }}
      >
        ←
      </button>

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

      {/* Stop Timer Popup */}
      {showPopup && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30"
          style={{ WebkitAppRegion: "no-drag" }}
        >
          <div
            className="flex flex-col items-center justify-center p-4"
            style={{
              width: "180px",
              background: "#FFF176",
              border: "3px solid #000",
              borderRadius: "8px",
              boxShadow: "4px 4px 0px #222",
              fontFamily: "Pixelify Sans",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "12px",
              }}
            >
              Want to stop timer?
            </p>
            <div className="flex space-x-4 gap-[10px]">
              <button
                onClick={handleConfirmStop}
                onMouseEnter={() => setHoverYes(true)}
                onMouseLeave={() => setHoverYes(false)}
                style={{
                  padding: "4px 12px",
                  background: hoverYes ? "#FF6B6B" : "#EF4444", // lighten on hover
                  border: "3px solid #000",
                  boxShadow: hoverYes ? "5px 5px 0px #222" : "3px 3px 0px #222", // slightly bigger shadow
                  fontFamily: "Pixelify Sans",
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.2s ease", // smooth transition
                }}
              >
                Yes
              </button>

              <button
                onClick={handleCancel}
                onMouseEnter={() => setHoverCancel(true)}
                onMouseLeave={() => setHoverCancel(false)}
                style={{
                  padding: "6px 14px",
                  background: hoverCancel ? "#34D399" : "#22C55E", // lighten on hover
                  border: "3px solid #000",
                  boxShadow: hoverCancel
                    ? "5px 5px 0px #222"
                    : "3px 3px 0px #222",
                  fontFamily: "Pixelify Sans",
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Goal Completed Popup */}
      {showCompleted && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40"
          style={{ WebkitAppRegion: "no-drag" }}
        >
          <div
            className="flex flex-col items-center justify-center p-6"
            style={{
              width: "250px",
              background: "#A7F3D0",
              border: "3px solid #000",
              borderRadius: "8px",
              boxShadow: "4px 4px 0px #222",
              fontFamily: "Pixelify Sans",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                marginBottom: "14px",
              }}
            >
              🎉 Goal Completed!
            </p>
            <button
              onClick={() => {
                setShowCompleted(false);
                navigate("/home");
              }}
              style={{
                padding: "8px 18px",
                background: "#3B82F6",
                border: "3px solid #000",
                boxShadow: "3px 3px 0px #222",
                fontFamily: "Pixelify Sans",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {goalName && (
        <div
          className="font-['Pixelify_Sans'] "
          style={{
            position: "absolute",
            top: "10px", // move it slightly lower so it's not hidden
            left: "35%",
            transform: "translateX(-50%)",
            width: "200px",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "20px",
            color: "purple", // white for better contrast
            pointerEvents: "none",
            zIndex: 10, // above everything
          }}
        >
          {goalName}
        </div>
      )}

      {/* Glass + Straw Wrapper */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          top: "12%",
          width: "120px",
          height: "150px",
          position: "relative",
        }}
      >
        {/* Straw */}
        <div
          style={{
            position: "absolute",
            top: "-35px",
            right: "25px",
            width: "12px",
            height: "175px",
            background: "#ff69b4",
            border: "3px solid #000",
            transform: "rotate(10deg)",
            zIndex: 2,
          }}
        />

        {/* Glass */}
        <div
          style={{
            width: "120px",
            height: "150px",
            background: "#c7f7ff",
            border: "4px solid #000",
            imageRendering: "pixelated",
            boxShadow: "4px 4px 0px #111, inset -6px -6px 0px #94FFFD",
            position: "relative",
            overflow: "hidden",
            borderRadius: "6px",
          }}
        >
          {/* Juice Fill */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: `${fillPercent}%`,
              background: selectedJuice || "#60A5FA",
              borderTop: "3px solid #000",
              transition: "height 1s linear",
              zIndex: 1,
            }}
          />

          {/* Ice Cubes (float + disappear with juice) */}
          {[...Array(10)].map((_, i) => {
            const cubeBottom = 10 + (i % 5) * 20; // same as before
            const cubeVisible = cubeBottom <= fillPercent; // visible only if below juice height

            return (
              <div
                key={i}
                className="ice-cube"
                style={{
                  position: "absolute",
                  bottom: `${cubeBottom}px`,
                  left: `${10 + ((i * 10) % 90)}px`,
                  width: "8px",
                  height: "8px",
                  background: "#e0f7ff",
                  border: "1.5px solid #000",
                  boxShadow: "1px 1px 0px #000",
                  zIndex: 2,
                  opacity: cubeVisible ? 0.9 : 0, // disappear if juice is below
                  pointerEvents: "none",
                  transition: "opacity 0.5s linear",
                  animation: cubeVisible
                    ? `float ${3 + (i % 3)}s ease-in-out infinite`
                    : "none",
                  animationDuration: `${3 + (i % 3)}s`,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            );
          })}
        </div>

        {/* Pixel Shine */}
        <div
          style={{
            position: "absolute",
            top: "25px",
            left: "15px",
            width: "12px",
            height: "12px",
            background: "white",
            opacity: 0.8,
            border: "2px solid #000",
            boxShadow: "2px 2px 0px #000",
            zIndex: 6,
          }}
        />
      </div>

      {/* Juice Options */}
      <div
        className="absolute grid grid-cols-4 gap-4"
        style={{
          bottom: "90px",
          width: "220px",
          height: "90px",
          left: "52%",
          transform: "translateX(-50%)",
        }}
      >
        {[
          { color: "#60A5FA", emoji: "🧊" },
          { color: "#EF4444", emoji: "🥤" },
          { color: "#FACC15", emoji: "🍋" },
          { color: "#F97316", emoji: "🍊" },
          { color: "#EC4899", emoji: "🍓" },
          { color: "#A855F7", emoji: "🍇" },
          { color: "#22C55E", emoji: "🥒" },
          { color: "#F43F5E", emoji: "🍅" },
        ].map((juice, i) => (
          <button
            key={i}
            onClick={() => setSelectedJuice(juice.color)}
            className="juice-btn"
            style={{
              WebkitAppRegion: "no-drag",
              width: "40px",
              height: "40px",
              border: "3px solid #000",
              borderRadius: "50%",
              boxShadow:
                selectedJuice === juice.color
                  ? "inset 3px 3px 0px #fff, 3px 3px 0px #222"
                  : "3px 3px 0px #222",
              cursor: "pointer",
              background: juice.color,
              transition: "all 0.2s ease",
              filter:
                selectedJuice === juice.color ? "brightness(1.2)" : "none",
            }}
          >
            <span style={{ position: "relative", zIndex: 1, fontSize: "16px" }}>
              {juice.emoji}
            </span>
          </button>
        ))}
      </div>

      {/* Time Display */}
      <div
        className="absolute text-center font-mono z-10 tracking-widest font-['Serif_Sans']"
        style={{
          WebkitAppRegion: "no-drag",
          bottom: "25px",
          left: "25px",
          background: "rgba(8, 8, 8, 0.3)",
          borderRadius: "10px",
          border: "3px solid #000",
          width: "140px",
          height: "50px",
          lineHeight: "50px",
          color: "white",
          fontSize: "28px",
          boxShadow: "4px 4px 0px #222",
        }}
      >
        {formatTime(secondsLeft)}
      </div>

      {/* Play / Pause */}
      <button
        onClick={toggleTimer}
        disabled={!selectedJuice}
        style={{
          WebkitAppRegion: "no-drag",
          bottom: "20px",
          right: "25px",
          position: "absolute",
          width: "65px",
          height: "65px",
          background: selectedJuice ? "#8B5CF6" : "#9CA3AF",
          border: "3px solid black",
          borderRadius: "4px", // slightly sharper for pixel vibe
          boxShadow: "4px 4px 0px #222",
          fontFamily: "Pixelify Sans",
          fontSize: "28px",
          color: "white",
          cursor: selectedJuice ? "pointer" : "not-allowed",
          transition: "all 0.2s ease, transform 0.1s",
          textShadow: "2px 2px 0px #000", // pixel-style outline
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1) rotate(-2deg)";
          e.currentTarget.style.boxShadow = "6px 6px 0px #222"; // pop-out effect
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1) rotate(0deg)";
          e.currentTarget.style.boxShadow = "4px 4px 0px #222";
        }}
      >
        {isRunning ? "⏸" : "▶"}
      </button>
    </div>
  );
}

export default Timer;
