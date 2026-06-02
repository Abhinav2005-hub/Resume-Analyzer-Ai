const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");

const analyzeResumeWithAI = require("../utils/gemini");

const router = express.Router();

// Store files in memory
const storage = multer.memoryStorage();

const upload = multer({
  storage,
});

// Upload + Parse + Analyze
router.post(
  "/upload",
  upload.single("resume"),
  async (req, res) => {
    try {

      // Check file exists
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      // Parse PDF
      const data = await pdfParse(req.file.buffer);

      const extractedText = data.text;

      console.log("PDF TEXT EXTRACTED SUCCESSFULLY");

      // AI Analysis
      const aiResponse = await analyzeResumeWithAI(
        extractedText
      );

      // Remove markdown formatting if AI returns it
      const cleanedResponse = aiResponse
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      console.log("AI RESPONSE");
      console.log(cleanedResponse);
      console.log("");

      let parsedResponse;

      try {
        parsedResponse = JSON.parse(cleanedResponse);
      } catch (jsonError) {

        console.log("INVALID JSON");
        console.log(cleanedResponse);
        console.log("");

        return res.status(500).json({
          success: false,
          message: "AI returned invalid JSON",
          rawResponse: cleanedResponse,
        });
      }

      return res.status(200).json({
        success: true,
        analysis: parsedResponse,
      });

    } catch (error) {

      console.log("SERVER ERROR");
      console.log(error);
      console.log("");

      return res.status(500).json({
        success: false,
        message: "Error analyzing resume",
      });
    }
  }
);

module.exports = router;