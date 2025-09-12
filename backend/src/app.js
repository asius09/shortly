const express = require("express");
const config = require("./config/config");
const connectDB = require("./db");
const cors = require("cors");

const PORT = config.port;

const app = express();
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.get("/api/user", (req, res) => {
  res.json({ status: "Backend working!" });
});

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
