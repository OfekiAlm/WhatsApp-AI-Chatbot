const fs = require('fs');
const { unlink } = require('node:fs');
const child_process = require('child_process');

export const handleTranscribeReq = async (req, message, chat, GPT) => {
    if (req) {

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

        const transcription = await GPT.transcribeAudio(`.audio_cache/${filename}.mp3`);
        await chat.sendMessage(transcription);

        unlink(`.audio_cache/${filename}.mp3`, (err) => {
            if (err) console.error(err);
        })
        unlink(`.audio_cache/${filename}.ogg`, (err) => {
            if (err) console.error(err);
        })
        return;
    }
}