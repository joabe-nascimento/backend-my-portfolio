const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  // useNewUrlParser e useUnifiedTopology são deprecatados e podem ser removidos.
});

// Verificar conexão
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

// Nova rota para buscar feedbacks
app.get("/api/feedback", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch feedbacks" });
  }
});

app.listen(port, () => {
  console.log(`Servidor conectado na porta ${port}`);
});
