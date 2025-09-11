// routes/goalRoutes.js
const express = require("express");
const router = express.Router();
const {
  createGoal,
  getGoals,
  getGoalById, // ✅ new controller
  deleteGoal,
  updateGoal,
} = require("../controllers/goalController");
const { protect } = require("../middleware/authMiddleware");

router
  .route("/")
  .post(protect, createGoal) // both must be functions
  .get(protect, getGoals);

router
  .route("/:id")
  .put(protect, updateGoal)
  .delete(protect, deleteGoal)
  .get(protect, getGoalById); // ✅ add this;

module.exports = router;
