const openAI = require('openai');
const dotenv =  require('dotenv'); // loading the API key from .env file.

dotenv.config();

let chatHistory = [];

const messages = chatHistory.map(([role, content]) => ({
    role,
    content,
}));

const configuration = {
    apiKey: process.env.OPENAI_API_KEY,
};

const openai = new openAI(configuration);

/**
 * Asks the GPT-3.5 Turbo model a question or provides a prompt for generating text.
 *
 * @async
 * @returns {Promise<string>} - A Promise that resolves to the generated response text.
 */
async function askGPT(){
    const chatCompletion = await openai.chat.completions.create({
        messages: messages,
        model: "gpt-3.5-turbo",
    });
    return chatCompletion.choices[0].message.content;
}

module.exports = {
    askGPT,
    chatHistory,
    messages
}