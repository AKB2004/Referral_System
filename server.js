const express = require("express");
const dotenv = require("dotenv");
const mongoDBConnectionDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");

dotenv.config();
const app = express();
app.use(express.json());


mongoDBConnectionDB();

app.use("/", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
