const openAI = require('openai');
const dotenv =  require('dotenv'); // loading the API key from .env file.
const { createReadStream } = require('fs');
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

/**
 * Generates an image based on the provided text prompt using the OpenAI image generation API.
 *
 * @async
 * @param {string} prompt - The text prompt to base the image generation on.
 * @param number - number of times
 * @returns {Promise<Array<Image>>} - A Promise that resolves to the URL of the generated image.
 */
async function generateImage(prompt, number = 1){
    const response = await openai.images.generate({
        prompt,
        n: number,
        size: "512x512",
    });
    return response.data;
}

async function transcribeAudio(file){
    const response = await openai.audio.transcriptions.create({
        file: createReadStream(file),
        model: "whisper-1"
    })
    return response.text;
}
module.exports = {
    askGPT,
    generateImage,
    transcribeAudio,
    chatHistory,
    messages
}