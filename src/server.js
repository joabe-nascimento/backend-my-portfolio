const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const compression = require("compression"); // Adicione a importação
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(compression()); // Use compressão

// MongoDB connection
mongoose.connect(process.env.MONGO_URI);

mongoose.connection.on("connected", () => {
  console.log("Conexão do banco de dados bem sucedida.");
});

mongoose.connection.on("error", (err) => {
  console.log(`Falha na conexão com o MongoDB: ${err.message}`);
});

// Feedback Schema
const feedbackSchema = new mongoose.Schema({
  name: String,
  feedback: String,
  rating: { type: Number, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now },
});

feedbackSchema.index({ createdAt: -1 }); // Adicione um índice

const Feedback = mongoose.model("Feedback", feedbackSchema);

// Rota para salvar feedback
app.post("/api/feedback", async (req, res) => {
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
app.get("/api/feedback", async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Adicione paginação
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

app.listen(port, () => {
  console.log(`Servidor conectado na porta ${port}`);
});
