// src/pages/UpdateGoal.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Glass from "../assets/PIXELGLASS.svg";

function UpdateGoal() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // goalId from route
  const [goalName, setGoalName] = useState("");
  const [goalTime, setGoalTime] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch goal details on mount
  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/goals/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch goal");

        setGoalName(data.goalName);
        setGoalTime(data.goalTime);
      } catch (err) {
        alert(err.message);
      }
    };

    fetchGoal();
  }, [id]);

  // ✅ Delete goal in backend
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to delete a goal.");
        return;
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/goals/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete goal");

      console.log("Goal deleted:", data);
      navigate("/home"); // ✅ redirect after delete
    } catch (err) {
      alert(err.message);
    }
  };

  // ✅ Update goal in backend
  const handleUpdate = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to update a goal.");
        return;
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/goals/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ goalName, goalTime }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update goal");
      }

      console.log("Goal updated:", data);
      navigate("/home"); // ✅ redirect after success
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = () => {
    navigate("/start-goal", { state: { goalId: id } });
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
        onClick={confirmBack}
        className="absolute top-[15px] left-[17px] w-10 h-10 flex items-center justify-center 
        rounded-full text-white text-lg font-bold z-20 shadow-md"
        {...getButtonProps()}
      >
        ←
      </button>

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
          <div
            className="bg-gradient-to-b from-[#ffb4b4] to-[#dc2626] border-4 border-black 
      rounded-[20px] p-6 flex flex-col items-center"
            style={{
              WebkitAppRegion: "no-drag",
              boxShadow: "6px 6px 0px #111",
              fontFamily: "Pixelify Sans",
            }}
          >
            <p className="text-white text-xl font-['Pixelify_Sans'] mb-4">
              ⚠️ Delete this goal?
            </p>
            <div className="flex space-x-6">
              {/* Confirm Delete */}
              <button
                onClick={handleDelete}
                className="px-6 py-2 bg-[#dc2626] text-white font-['Pixelify_Sans'] 
          border-2 border-black rounded-lg shadow-[4px_4px_0_#991b1b] 
          transition-all duration-150 
          hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#991b1b]
          active:translate-x-[4px] active:translate-y-[4px] active:shadow-[0px_0px_0_#991b1b]"
              >
                ✅ Delete
              </button>

              {/* Cancel */}
              <button
                onClick={() => setShowDeletePopup(false)}
                className="px-6 py-2 bg-gray-600 text-white font-['Pixelify_Sans'] 
          border-2 border-black rounded-lg shadow-[4px_4px_0_#222] 
          transition-all duration-150 
          hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#222]
          active:translate-x-[4px] active:translate-y-[4px] active:shadow-[0px_0px_0_#222]"
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Goal */}
      <h2 className="text-white text-xl mb-4 mt-[25px] font-['Pixelify_Sans']">
        UPDATE GOAL
      </h2>

      {/* Goal Name LABEL */}
      <label
        className="absolute font-['Pixelify_Sans']"
        style={{
          width: "600px",
          top: "55px",
          fontWeight: 10000,
          fontSize: "30px",
          display: "flex",
          justifyContent: "center",
          color: "#FFFFFF",
          WebkitTextStroke: "0.9px #000000",
        }}
      >
        NAME OF GOAL
      </label>

      {/* Goal Name Input */}
      <input
        type="text"
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

      {/* Goal Time LABEL */}
      <label
        className="absolute font-['Pixelify_Sans'] z-10"
        style={{
          width: "600px",
          top: "190px",
          fontWeight: 10000,
          fontSize: "34px",
          display: "flex",
          justifyContent: "center",
          color: "#FFFFFF",
          WebkitTextStroke: "1px #000000",
        }}
      >
        SET TIME
      </label>

      {/* Goal Time Input */}
      <input
        type="text"
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

      {/* Glass */}
      <img
        src={Glass}
        alt="Glass"
        className="w-[200px] h-[200px] absolute top-[125px] z-0 mt-[20px] pointer-events-none"
      />

      {/* Update, Delete and Start Buttons */}
      <div
        className="flex space-x-[30px] mt-[270px]"
        style={{ WebkitAppRegion: "no-drag" }}
      >
        {/* Update */}
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="px-[10px] py-3 rounded-2xl text-white font-['Pixelify_Sans'] 
    text-2xl tracking-wider border-2 border-[#3b0764] 
    shadow-[6px_6px_0_#3b0764] 
    transition-all duration-150 
    hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0_#3b0764]
    active:translate-x-[6px] active:translate-y-[6px] active:shadow-[0px_0px_0_#3b0764]"
          style={{ background: "#7e22ce" }}
        >
          {loading ? "Updating..." : "Update"}
        </button>

        {/* DELETE */}
        <button
          onClick={() => setShowDeletePopup(true)}
          className="px-8 py-3 rounded-2xl text-white font-['Pixelify_Sans'] 
  text-2xl tracking-wider border-2 border-[#991b1b] 
  shadow-[6px_6px_0_#991b1b] 
  transition-all duration-150 
  hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0_#991b1b]
  active:translate-x-[6px] active:translate-y-[6px] active:shadow-[0px_0px_0_#991b1b]"
          style={{ background: "#dc2626" }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default UpdateGoal;
