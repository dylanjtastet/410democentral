const express = require("express");
const bodyParser = require('body-parser');
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "../410democentral-frontend", "build")));

app.get("/*", function(req, res) {
    res.sendFile(res.sendFile(path.join(__dirname, "../410democentral-frontend", "build", "index.html")));
});

app.listen(80);