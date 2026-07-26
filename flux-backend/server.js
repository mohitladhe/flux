const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcryptjs");
const User = require("./models/UserModel");
const connectDB = require("./config/db");
const PendingUser = require("./models/PendingUserModel");
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes");
const conversationRoutes = require("./routes/conversationRoutes");

app.use(express.json());

const allowedOrigins = ["http://localhost:5173"];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

const startServer = async () => {
  try {
    await connectDB();

    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

startServer();

app.get("/", (req, res) => {
  res.send("Backend is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/conversations", conversationRoutes);
