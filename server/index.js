const express = require("express");
const cors = require("cors");
require("dotenv").config();

const resumeRoutes = require("./routes/resumeRoutes.js")

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req,res) => {
    res.json({
        message: "Resume Analyzer API Running",
    });
});

app.use("/api/resume", resumeRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log( `Server running on port ${PORT}`);
});