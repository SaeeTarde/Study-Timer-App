// controllers/goalController.js
const Goal = require("../models/Goal");

// @desc Create new goal
const createGoal = async (req, res) => {
  try {
    const { goalName, goalTime } = req.body;

    if (!goalName || !goalTime) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const goal = await Goal.create({
      user: req.user.id,
      goalName,
      goalTime,
    });

    res.status(201).json(goal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc Update goal
const updateGoal = async (req, res) => {
  try {
    console.log(req.body);
    const goal = await Goal.findById(req.params.id);

    if (!goal) return res.status(404).json({ error: "Goal not found" });

    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Not authorized" });
    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updatedGoal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc Get all goals for logged-in user
const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc Delete goal
const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ error: "Goal not found" });

    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Not authorized" });
    }

    await goal.deleteOne();
    res.json({ message: "Goal removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc Get goal by ID
const getGoalById = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ error: "Goal not found" });
    }

    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Not authorized" });
    }

    res.json(goal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createGoal, getGoals, deleteGoal, updateGoal, getGoalById };
