const handleRoleActionReq = async (req, message, GPT, chatFunctionalities) => {
    if (req) {
        // Extract the content after "!act" and log it as a system action
        const contentRegex = chatFunctionalities.extractTextAfterAct(message.body);
        chatFunctionalities.createChatHistoryOrRetrieve(filePath, { role: 'system', content: contentRegex });
        GPT.messages.push({ role: 'system', content: contentRegex });
        await message.reply("trying to act like mentioned");
    }
    else {
        // Log user messages in chat history
        chatFunctionalities.createChatHistoryOrRetrieve(filePath, { role: 'user', content: message.body });
        GPT.messages.push({ role: 'user', content: message.body });
    }
}

module.exports = {
    handleRoleActionReq,
};