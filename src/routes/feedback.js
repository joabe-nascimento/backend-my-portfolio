const express = require("express");
const router = express.Router();
const Feedback = require("../models/feedback");

// Rota para salvar feedback
router.post("/", async (req, res) => {
  const { name, feedback, rating } = req.body;
  const newFeedback = new Feedback({ name, feedback, rating });
  try {
    await newFeedback.save();
    res.status(201).json(newFeedback);
  } catch (error) {
    res.status(500).json({ error: "Failed to save feedback" });
  }
});

// Rota para buscar feedbacks com paginação
router.get("/", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const feedbacks = await Feedback.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch feedbacks" });
  }
});

module.exports = router;
