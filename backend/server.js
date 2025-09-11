//server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const goalRoutes = require("./routes/goalRoutes");

const app = express(); // ✅ define app BEFORE using it

// Allow your Vite dev server origin
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://study-timer-app-1.onrender.com/", // ✅ add this
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/goals", goalRoutes); // ✅ moved here

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT, () =>
      console.log(`✅ Server running on http://localhost:${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("Mongo connect error:", err));
