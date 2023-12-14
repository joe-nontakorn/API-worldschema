const express = require("express");
const worldSchemaRoutes = require('./router/worldSchemaRoutes');
const countryRoutes = require('./router/countryRoutes');
const fs = require('fs');
const path = require('path');
require('dotenv').config();


const app = express();
const port = process.env.PORT;


const logFolderPath = path.join(__dirname, 'log');
const currentDate = new Date().toISOString().split('T')[0]; // ดึงวันที่ปัจจุบันและใช้ในชื่อไฟล์
const logFileName = `${currentDate}.log`; // สร้างชื่อไฟล์ log โดยใช้รูปแบบ YYYY-MM-DD.log
const logFilePath = path.join(logFolderPath, logFileName);

if (!fs.existsSync(logFolderPath)) {
  fs.mkdirSync(logFolderPath, { recursive: true });
}

// Middleware function to log requests
app.use((req, res, next) => {
  const logData = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;
  fs.appendFile(logFilePath, logData, (err) => {
    if (err) console.error('Error writing to log file:', err);
  });
  next();
});

// Use routes
app.use("/api/worldschema", worldSchemaRoutes);
app.use("/api/country", countryRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
