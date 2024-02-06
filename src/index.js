const express = require("express");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const appRoutes = require("./router/router");

const app = express();
const port = process.env.PORT;

const logFolderPath = path.join(__dirname, "log");
const currentDate = new Date().toISOString().split("T")[0]; // ดึงวันที่ปัจจุบันและใช้ในชื่อไฟล์
const logFileName = `${currentDate}.log`; // สร้างชื่อไฟล์ log โดยใช้รูปแบบ YYYY-MM-DD.log
const logFilePath = path.join(logFolderPath, logFileName);

if (!fs.existsSync(logFolderPath)) {
  fs.mkdirSync(logFolderPath, { recursive: true });
}

// Middleware function to log requests
app.use((req, res, next) => {
  const logData = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;
  fs.appendFile(logFilePath, logData, (err) => {
    if (err) console.error("Error writing to log file:", err);
  });
  next();
});

// Use routes
appRoutes.routes({ app: app });

app.listen(port, () => {
  console.log(`Server started on port:${port}`);
});
