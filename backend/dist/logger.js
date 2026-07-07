"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const fs_1 = __importDefault(require("fs"));
const rotating_file_stream_1 = require("rotating-file-stream");
const dayjs_1 = __importDefault(require("dayjs"));
const logDirectory = path_1.default.join(__dirname, "../../logs");
if (!fs_1.default.existsSync(logDirectory)) {
    fs_1.default.mkdirSync(logDirectory);
}
const accessLogStream = (0, rotating_file_stream_1.createStream)("access.log", {
    interval: "7d",
    path: logDirectory,
    maxFiles: 4,
    compress: "gzip",
});
morgan_1.default.token("dayjs-time", () => {
    return (0, dayjs_1.default)().format("DD-MMM-YYYY hh:mm:ss A");
});
morgan_1.default.token("status-emoji", (req, res) => {
    const status = res.statusCode;
    if (status >= 500)
        return "💥";
    if (status >= 400)
        return "🔴";
    if (status >= 300)
        return "🟡";
    if (status >= 200)
        return "🟢";
    return "⚪";
});
const morganMiddleware = (0, morgan_1.default)("[:dayjs-time] :status-emoji :method :url :status - :res[content-length] bytes - :response-time ms", { stream: accessLogStream });
exports.default = morganMiddleware;
