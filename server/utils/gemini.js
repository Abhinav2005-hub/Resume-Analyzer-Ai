require("dotenv").config();

const OpenAI = require("openai");

// Debug API Key
console.log("API KEY:", process.env.OPENROUTER_API_KEY);

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
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "missingSkills": ["skill1", "skill2"],
  "suggestions": ["suggestion1", "suggestion2"]
}

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
    });

    return completion.choices[0].message.content;

  } catch (error) {

    console.log(error);

    throw error;
  }
};

module.exports = analyzeResumeWithAI;