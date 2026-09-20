const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("MedBridge Backend is Running!");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`MedBridge Server running on port ${PORT}`);
});
