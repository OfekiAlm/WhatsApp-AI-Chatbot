const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');

//Logs enhancement, can be removed.
const colors = require('colors');

// Custom modules for chat functionality and OpenAI GPT interaction
const chat_functionalities = require('./chat_funcionality');
const GPT = require('./open_ai_gpt');
const { handleImageReq } = require('./imageRequest');
const { handleTranscribeReq } = require('./transcribeRequest');
const { handleRoleActionReq } = require('./roleActionRequest');

const ASSISTANT_LOGS = false;

// Create a new WhatsApp client with local authentication method
const client = new Client({
    authStrategy: new LocalAuth(),
});

// Display the QR code for user authentication
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log(colors.bold.green('[+] Client is ready!'));

    if (process.env.CHAT_BOT_PHONE_NUMBER) {
        console.log(colors.bold.blue("The bot is ready."))
        console.log(colors.bold.blue("The bot phone number is:"))
        console.log(colors.bold.bgWhite(process.env.CHAT_BOT_PHONE_NUMBER))
        console.log(colors.bold.blue("Try to send a message to this number from another phone."))
    }
    else console.log(colors.bold.yellow("You didn't set a phone number for testing purposes."))
});

// Listen for incoming messages from users
client.on('message', async (message) => {
    console.log(colors.bold.blue(`Message ${message.title} recieved from: ${message.from}`))

    if (process.env.CHAT_BOT_PHONE_NUMBER && message.from !== `${process.env.CHAT_BOT_PHONE_NUMBER}@c.us`)
        return;

    const chat = await message.getChat();
    const chatID = chat.id._serialized;

    const roleActionReq = message.body.includes("!act");
    const imageReq = message.body.includes("!generate");
    const transcribeReq = message.body.includes("!transcribe");

    handleTranscribeReq(transcribeReq, message, chat, GPT);


    handleImageReq(imageReq, message, chat_functionalities, chat);

    await chat.sendStateTyping();

    // Create or retrieve the chat history file
    let filePath = 'chats_history/' + chat_functionalities.removePattern(chatID) + '.json';

    handleRoleActionReq(roleActionReq, message, GPT, chat_functionalities);

    // Generate a response
    const answer = await GPT.askGPT();

    if (!roleActionReq) {
        await chat.sendMessage(answer);
    }

    // Update the chat history for assistant ROLE
    if (ASSISTANT_LOGS)
        GPT.chatHistory = chat_functionalities.createChatHistoryOrRetrieve(filePath, { role: 'asistant', content: answer });
});

// Initialize the WhatsApp client
client.initialize();