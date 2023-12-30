export const handleRoleActionReq = async (req, message, GPT, chat_functionalities) => {
    if (req) {
        // Extract the content after "!act" and log it as a system action
        const contentRegex = chat_functionalities.extractTextAfterAct(message.body);
        chat_functionalities.createChatHistoryOrRetrieve(filePath, { role: 'system', content: contentRegex });
        GPT.messages.push({ role: 'system', content: contentRegex });
        await message.reply("trying to act like mentioned");
    }
    else {
        // Log user messages in chat history
        chat_functionalities.createChatHistoryOrRetrieve(filePath, { role: 'user', content: message.body });
        GPT.messages.push({ role: 'user', content: message.body });
    }
}