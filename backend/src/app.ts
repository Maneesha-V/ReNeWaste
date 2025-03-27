import express from "express";
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
app.use(bodyParser.json()); 
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true, 
})); 

connectDB();

app.use("/api", userRoutes);

const PORT = process.env.PORT || 5001;


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));