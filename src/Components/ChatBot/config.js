import {REACT_APP_OPENAI_API_KEY} from '../../util/API_KEY';
// Configuration file for API keys and settings
// In production, use environment variables instead

const config = {
  // OpenAI API Key
  OPENAI_API_KEY: REACT_APP_OPENAI_API_KEY,

    // For debugging - remove in production
  ENV_DEBUG: {
    hasEnvVars: process.env.REACT_APP_OPENAI_API_KEY ? true : false,
    keyPrefix: process.env.REACT_APP_OPENAI_API_KEY ? process.env.REACT_APP_OPENAI_API_KEY.substring(0, 5) + '...' : 'not found'
  },
  
  // ChatBot settings
  chatbot: {
    model: 'gpt-4',    // OpenAI model to use
    maxTokens: 300,            // Maximum tokens per response
    initialGreeting: 'Hello! I can suggest personalized learning resources. What are you interested in learning?',
    systemPrompt: 'You are a helpful learning assistant that provides personalized learning resource recommendations. Keep responses concise and focused on educational content.Reject reponding for non educational request saying "I am unable to assist you with that.Ask me only about educational resources.". Suggest specific resources when possible.'
  }
};

export default config;