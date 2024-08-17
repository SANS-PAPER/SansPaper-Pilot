import axios from 'axios';

const apiKey = 'a70e1df3888647d89d1b8cb88b9e9b94';

const openaiInstance = axios.create({
  baseURL: `https://sanspaperform-openai.openai.azure.com/openai/deployments/gpt-4/chat/completions?api-version=2024-02-15-preview&api-key=${apiKey}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getOpenAIResponse = async (messages:any) => {
  try {
    const response = await openaiInstance.post('', {
      messages: messages,
      max_tokens: 100,
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error fetching response from OpenAI:', error);
    throw error;
  }
};