const express = require("express");
const app = express();

app.get("/", (req, res) => res.json({message: "Pure Node works!"}));

app.listen(3000, () => console.log("Pure Node server on 3000"));
