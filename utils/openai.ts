// utils/openai.js
import axios from "axios";

const BASE_URL = "https://api.openai.com/v1";

// LL-dlIgQVFTLtpQ66uuFfPlW2DMMtbq317E8KmWvS3l6CQv7KB6zmBaeuVKPBfWlyrC

const OPENAI_API_KEY = "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";
export const createRequest = async (text: any) => {
  try {
    const response = await axios.post(
      `${BASE_URL}
/completions`,
      {
        prompt: text,
        model: "gpt-3.5-turbo", 
        temperature: 0.8,
        max_tokens: 100,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}
`,
        },
      }
    );
    return response.data.choices[0].text;
  } catch (error: any) {
    console.log("Error:", error.response.data);
    return null;
  }
};