// A simple service to handle OpenAI API calls
import config from './config';

class OpenAiService {
  constructor(apiKey = null) {
    this.apiKey = apiKey || config.OPENAI_API_KEY;
    this.endpoint = 'https://api.openai.com/v1/chat/completions';
    this.model = config.chatbot.model;
    this.maxTokens = config.chatbot.maxTokens;
    this.systemPrompt = config.chatbot.systemPrompt;
  }

  async getChatCompletion(messages) {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: this.systemPrompt
            },
            ...messages.filter(msg => msg.role !== 'system')
          ],
          max_tokens: this.maxTokens
        })
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      throw error;
    }
  }
}

export default OpenAiService;