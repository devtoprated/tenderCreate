const express = require("express");
const app = express();
const cors = require('cors')
const fileUpload = require("express-fileupload");
const path = require("path");
const errorMiddleware = require("./middleware/error.js");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const tender = require("./routes/tenderRoute.js");
const candidate=require("./routes/candidateRoute.js")
app.use(express.json());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);
const user = require("./routes/userRoute.js");

app.use("/api/v1", user);
app.use("/api/tender", tender);
app.use("/api/candidate", candidate);

app.use(express.static('public'))

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

// Middleware for Errors
app.use(errorMiddleware);

module.exports = app;
