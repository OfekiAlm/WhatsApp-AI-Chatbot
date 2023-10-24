const qrcode = require('qrcode-terminal');
const {Client, LocalAuth, MessageMedia} = require('whatsapp-web.js');

const fs = require('fs');
const child_process = require('child_process');
const { unlink } = require('node:fs');

const colors = require('colors');  //terminal enhancement, can be removed.

// Custom modules for chat functionality and OpenAI GPT interaction
const chat_functionalities = require('./chat_funcionality');
const GPT = require('./open_ai_gpt');

const ASSISTANT_LOGS = false;

// Create a new WhatsApp client with local authentication method
const client = new Client({
    authStrategy: new LocalAuth(),
});

// Display the QR code for user authentication
client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log(colors.bold.green('[+] Client is ready!'));
});

// Listen for incoming messages from users
client.on('message', async message => {

    const chat = await message.getChat();
    let roleActionReq = message.body.includes("!act");
    let imageReq = message.body.includes("!generate");
    let transcribeReq = message.body.includes("!transcribe");
    const chatID = chat.id._serialized;
    
    if(transcribeReq){
        if (!message.hasQuotedMsg) {
            await chat.sendMessage("You should quote a audio/video message!");
            return;
        }
        
        const quote = await message.getQuotedMessage();
        if (!quote.hasMedia || !(quote.type == "audio" || quote.type == "voice" || quote.type == "ptt" || quote.type == "video")) {
            await message.reply("That message doesn't contain any audio!");
            return;
        }
        chat.sendStateTyping();

        const filename = message.id.id;
        const downloadedMedia = await quote.downloadMedia();
        let buffer = Buffer.from(downloadedMedia.data, 'base64');
        fs.writeFileSync(`./.audio_cache/${filename}.ogg`, buffer);
        
        //-hide_banner -loglevel error flags are only for logging purposes.
        child_process.execSync(`ffmpeg -hide_banner -loglevel error -i .audio_cache/${filename}.ogg -acodec libmp3lame .audio_cache/${filename}.mp3`);
        
        let transcription = await GPT.transcribeAudio(`.audio_cache/${filename}.mp3`);
        await chat.sendMessage(transcription);

        unlink(`.audio_cache/${filename}.mp3`, (err) =>{
            if (err) console.error(err);
        })
        unlink(`.audio_cache/${filename}.ogg`, (err) =>{
            if (err) console.error(err);
        })
        return;
    }
    if(imageReq){
        const formatted_input = chat_functionalities.validateAndExtractImgCommand(message.body);
        if(formatted_input.valid){
            let images = await GPT.generateImage(formatted_input.prompt,formatted_input.number);
            for (const image of images) {
                const imageUrlMedia = await MessageMedia.fromUrl(image.url);
                await chat.sendMessage(imageUrlMedia);
            }
        }
        else
            await chat.sendMessage("invalid command\n!generate [number] [prompt]")
        return;
    }
    await chat.sendStateTyping();
    // Create or retrieve the chat history file
    let filePath = 'chats_history/'+chat_functionalities.removePattern(chatID) + '.json';

    if(roleActionReq){
        // Extract the content after "!act" and log it as a system action
        let contentRegex = chat_functionalities.extractTextAfterAct(message.body);
        chat_functionalities.createChatHistoryOrRetrieve(filePath, {role: 'system', content: contentRegex});
        GPT.messages.push({ role: 'system', content: contentRegex });
        await message.reply("trying to act like mentioned");
    }
    else{
        // Log user messages in chat history
        chat_functionalities.createChatHistoryOrRetrieve(filePath, {role: 'user', content: message.body});
        GPT.messages.push({ role: 'user', content: message.body });
    }

    // Generate a response
    let answer = await GPT.askGPT();

    if(!roleActionReq){
        await chat.sendMessage(answer);
    }
    
    // Update the chat history for assistant ROLE
    if(ASSISTANT_LOGS)
        GPT.chatHistory = chat_functionalities.createChatHistoryOrRetrieve(filePath, { role: 'asistant', content: answer });
});

// Initialize the WhatsApp client
client.initialize();