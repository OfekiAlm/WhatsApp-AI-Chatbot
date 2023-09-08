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