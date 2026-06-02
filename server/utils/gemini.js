require("dotenv").config();

const OpenAI = require("openai");

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const analyzeResumeWithAI = async (resumeText) => {

  const prompt = `
You are an expert ATS Resume Analyzer and Technical Recruiter.

Analyze the resume and return ONLY valid JSON.

Return EXACTLY in this format:

{
  "summary": "string",
  "atsScore": 0,
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "missingSkills": ["skill1", "skill2"],
  "recommendedRoles": ["role1", "role2"],
  "suggestions": ["suggestion1", "suggestion2"]
}

IMPORTANT RULES:
- Return ONLY JSON
- Do NOT use markdown
- Do NOT use \`\`\`json
- Do NOT add explanations
- atsScore must be between 0 and 100
- summary must be a string
- strengths must be an array
- weaknesses must be an array
- missingSkills must be an array
- recommendedRoles must be an array
- suggestions must be an array

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