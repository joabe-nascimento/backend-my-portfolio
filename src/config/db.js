const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conexão do banco de dados bem sucedida.");
  } catch (err) {
    console.error(`Falha na conexão com o MongoDB: ${err.message}`);
    process.exit(1);
  }
};

mongoose.connection.on("connected", () => {
  console.log("Conexão do banco de dados bem sucedida.");
});

mongoose.connection.on("error", (err) => {
  console.log(`Falha na conexão com o MongoDB: ${err.message}`);
});

module.exports = connectDB;
