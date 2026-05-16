const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
});

router.post(
    "/upload",
    upload.single("resume"),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "No file uploaded",
                });
            }

            const data = await pdfParse(req.file.buffer);

            const extractedText = data.text;

            res.json({
                success: true,
                extractedText,
            });
        } catch (error) {
            console.log(error);

            res.status(500).json({
                success: false,
                message: "Error parsing pdf",
            });
        }
    }
);

module.exports = router;