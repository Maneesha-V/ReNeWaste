import path from "path";
import morgan from "morgan";
import fs from "fs";
import { createStream } from "rotating-file-stream";
import dayjs from "dayjs";

const logDirectory = path.join(__dirname, "../../logs");

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const accessLogStream = createStream("access.log", {
  interval: "7d",
  path: logDirectory,
  maxFiles: 4,
  compress: "gzip",
});

morgan.token("dayjs-time", () => {
  return dayjs().format("DD-MMM-YYYY hh:mm:ss A");
});

morgan.token("status-emoji", (req, res) => {
  const status = res.statusCode;

  if (status >= 500) return "💥";
  if (status >= 400) return "🔴";
  if (status >= 300) return "🟡";
  if (status >= 200) return "🟢";
  return "⚪";
});

const morganMiddleware = morgan(
  "[:dayjs-time] :status-emoji :method :url :status - :res[content-length] bytes - :response-time ms",
  { stream: accessLogStream },
);

export default morganMiddleware;
