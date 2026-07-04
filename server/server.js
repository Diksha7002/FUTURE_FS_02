require("dotenv").config();
console.log("URI:", process.env.MONGO_URI);

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const leadRoutes = require("./routes/leadRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/leads", leadRoutes);

app.get("/", (req, res) => {
  res.send("CRM Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});