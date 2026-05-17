const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");

const analyzeResumeWithAI = require("../utils/gemini");

const router = express.Router();

// Store files in memory
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
});

// Upload + Parse + Analyze
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

      // Parse PDF
      const data = await pdfParse(req.file.buffer);

      const extractedText = data.text;

      // AI Analysis
      const aiResponse = await analyzeResumeWithAI(
        extractedText
      );

      // Remove markdown formatting
      const cleanedResponse = aiResponse
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      // Convert JSON string → JS object
      const parsedResponse = JSON.parse(cleanedResponse);

      res.json({
        success: true,
        analysis: parsedResponse,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message: "Error analyzing resume",
      });
    }
  }
);

module.exports = router;