const express = require('express');
const cors = require('cors');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000

// middleware
app.use(cors());
app.use(express.json())





app.get("/", (req, res) => {
    res.send("This is the central page of gizmo freak server");
})

app.listen(port, () => {
    console.log("Listening to the port", port + 2000);
})