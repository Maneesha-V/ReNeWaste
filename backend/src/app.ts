import express from "express";
import connectDB from "./config/db";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes";
import superAdminRoutes from "./routes/superAdminRoutes";
import wastePlantRoutes from "./routes/wastePlantRoutes";
import driverRoutes from "./routes/driverRoutes";

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
app.use("/api/super-admin", superAdminRoutes);
app.use("/api/waste-plant", wastePlantRoutes);
app.use("/api/driver", driverRoutes);

const PORT = process.env.PORT || 5001;


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

