import axios from 'axios';

const LLAMA_API_BASE_URL = 'https://api.llama.ai';

export async function generateText(prompt: string): Promise<string | null> {
  try {
    const response = await axios.post(
      `${LLAMA_API_BASE_URL}/text-generation`,
      { prompt }
    );
    return response.data.text;
  } catch (error) {
    console.error('Error generating text:', error);
    return null;
  }
}
