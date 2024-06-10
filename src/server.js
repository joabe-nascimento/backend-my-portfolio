const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const compression = require("compression");
require("dotenv").config();

const connectDB = require("./config/db");
const feedbackRoutes = require("./routes/feedback");

const app = express();
const port = process.env.PORT || 5000;

// Conectar ao banco de dados
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(compression()); // Use compressão

// Rotas
app.use("/api/feedback", feedbackRoutes);

app.listen(port, () => {
  console.log(`Servidor conectado na porta ${port}`);
});
