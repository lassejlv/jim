const express = require("express");
const app = express();
require("./main");

app.get("/", (req, res) => {
  res.send(202);
});

app.listen(3000, () => console.info("Server is up and running!"));
