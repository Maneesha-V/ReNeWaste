import express from "express";
import connectDB from "./config/db";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import morgan from "morgan";
import cookieParser from 'cookie-parser';
import http from "http";
import { Server } from "socket.io";
import userRoutes from "./routes/userRoutes";
import superAdminRoutes from "./routes/superAdminRoutes";
import wastePlantRoutes from "./routes/wastePlantRoutes";
import driverRoutes from "./routes/driverRoutes";
import mapsRoutes from "./routes/mapRoutes";

import socketHandler from "./socket/socketHandler";

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5001;

// CORS for Express REST API
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true, 
})); 
// CORS for Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);
  socketHandler(socket, io); 
});

app.use(bodyParser.json()); 
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

connectDB();

app.use("/api", userRoutes);
app.use("/api/super-admin", superAdminRoutes);
app.use("/api/waste-plant", wastePlantRoutes);
app.use("/api/driver", driverRoutes);
app.use("/api/maps", mapsRoutes);

	// When using Express + Socket.IO
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


