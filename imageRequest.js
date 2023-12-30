

export const handleImageReq = async (req, message, chat_functionalities, chat) => {
    if (req) {

        const formatted_input = chat_functionalities.validateAndExtractImgCommand(message.body);
        if (formatted_input.valid) {
            let images = await GPT.generateImage(formatted_input.prompt, formatted_input.number);
            for (const image of images) {
                const imageUrlMedia = await MessageMedia.fromUrl(image.url);
                await chat.sendMessage(imageUrlMedia);
            }
        }
        else
            await chat.sendMessage("invalid command\n!generate [number] [prompt]")
        return;
    }
}