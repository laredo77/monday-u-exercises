const express = require("express");
const compression = require("compression");
require("express-async-errors");

const logger = require("./server/middleware/logger");
const todoRouter = require("./server/routes/api");
const port = 8080;
const app = express();

app.use([logger, compression(), express.json()]);
app.use("/", express.static("dist"));
app.use("/tasks", todoRouter);

app.listen(port, () => {
  console.log("Server started on port", port);
});
