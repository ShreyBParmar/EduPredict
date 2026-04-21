import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"
import facultyRoutes from "./routes/facultyRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import subjectFilter from "./routes/subjectFilter.js"
import subjectRoutes from "./routes/subjectRoutes.js"

dotenv.config();
connectDB();

const app = express();

app.use(cors())
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/filter_subject",subjectFilter)
app.use("/api",subjectRoutes)
app.get("/", (req, res) => {
  res.send("API Running");
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
