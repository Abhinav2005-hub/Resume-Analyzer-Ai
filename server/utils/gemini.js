require("dotenv").config();

const OpenAI = require("openai");

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const analyzeResumeWithAI = async (resumeText) => {

  const prompt = `
  You are an advanced ATS Resume Analyzer.
  
  Analyze the following resume and return ONLY valid JSON in this exact format:
  
  {
    "atsScore": number,
    "strengths": ["strength1", "strength2", "strength3"],
    "weaknesses": ["weakness1", "weakness2", "weakness3"],
    "missingSkills": ["skill1", "skill2", "skill3"],
    "recommendedRoles": ["role1", "role2"],
    "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
    "summary": "Short professional summary"
  }
  
  RULES:
  - ATS score must be between 0 and 100.
  - Provide at least 3 strengths.
  - Provide at least 3 weaknesses.
  - Provide at least 3 missing skills.
  - Provide at least 3 suggestions.
  - Never leave any array empty.
  - Weaknesses should be realistic areas for improvement.
  - Recommended roles should match the candidate's skills.
  - Return ONLY valid JSON.
  - Do NOT use markdown.
  - Do NOT wrap the response in \`\`\`json.
  
  Resume:
  ${resumeText}
  `;

  try {

    const completion = await client.chat.completions.create({
      model: "openai/gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
    });

    const response =
      completion.choices?.[0]?.message?.content || "";

    console.log("RAW AI RESPONSE");
    console.log(response);
    console.log("");

    return response;

  } catch (error) {

    console.log("AI ERROR:");
    console.log(error);

    throw error;
  }
};

module.exports = analyzeResumeWithAI;