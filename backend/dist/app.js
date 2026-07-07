"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
require("reflect-metadata");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const superAdminRoutes_1 = __importDefault(require("./routes/superAdminRoutes"));
const wastePlantRoutes_1 = __importDefault(require("./routes/wastePlantRoutes"));
const driverRoutes_1 = __importDefault(require("./routes/driverRoutes"));
const socketHandler_1 = __importDefault(require("./socket/socketHandler"));
const errorHandler_1 = require("./middlewares/errorHandler");
const ApiError_1 = require("./utils/ApiError");
require("./cron/unblockWastePlants");
require("./cron/subscribeWastePlant");
require("./cron/rechargeWastePlant");
require("./cron/genCommPickup");
const logger_1 = __importDefault(require("./logger"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const PORT = Number(process.env.PORT) || 3000;
(0, db_1.default)();
// CORS for Express REST API
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
// CORS for Socket.IO
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
});
globalThis.io = io;
// Socket.IO connection
io.on("connection", (socket) => {
    console.log("🟢 New client connected:", socket.id);
    (0, socketHandler_1.default)(socket, io);
    socket.on("disconnect", () => {
        console.log("🔴 Client disconnected:", socket.id);
    });
});
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(logger_1.default);
app.use("/api", userRoutes_1.default);
app.use("/api/super-admin", superAdminRoutes_1.default);
app.use("/api/waste-plant", wastePlantRoutes_1.default);
app.use("/api/driver", driverRoutes_1.default);
app.use((req, res, next) => {
    next(new ApiError_1.ApiError(404, "Route not found"));
});
app.use(errorHandler_1.errorHandler);
// When using Express + Socket.IO
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
