const fs = require('fs');
const path = require('path');

/**
 * Validates and extracts data from a given "!img" command.
 *
 * The command format is expected to be one of the following:
 * - "!img [prompt]"
 * - "!img [number] [prompt]"
 *
 * A prompt is mandatory for the command to be considered valid.
 *
 * @param {string} input - The input string to be validated and parsed.
 * @returns {object} An object with the following properties:
 *                   - valid (boolean): Indicates if the command is valid.
 *                   - number (number|null): The extracted number or null if not present.
 *                   - prompt (string|null): The extracted prompt or null if not present.
 */
function validateAndExtractImgCommand(input) {
    const regex = /^!img(\s+(\d+))?\s+(.+)$/;
    const match = input.match(regex);

    if (!match) {
        return { valid: false };
    }

    return {
        valid: true,
        number: match[2] ? parseInt(match[2], 10) : undefined,
        prompt: match[3]
    };
}

/**
 * Extracts text after a '!act' command from the given input.
 *
 * @param {string} input - The input string to search for '!act' commands.
 * @returns {string | null} - The extracted text after the '!act' command or null if not found.
 */
function extractTextAfterAct(input) {
    const match = input.match(/!act\s*(.+)/);
    if (match && match[1]) {
      return match[1].trim();
    }
    return null; // Return null if there's no match or text after "!act"
  }

/**
 * Retrieves the chat history from a JSON file.
 *
 * @param {string} fileName - The name of the JSON file to read.
 * @returns {Array} - An array containing chat history.
 */
function getChatHistory(fileName){
    const data = JSON.parse(fs.readFileSync(fileName, 'utf-8'));
    return data.history;
}
/**
 * Creates or retrieves the chat history from a JSON file and writes a message to it.
 *
 * @param {string} filename - The name of the JSON file to create or retrieve.
 * @param {string} message - The message to add to the chat history.
 * @returns {Array} - An array containing updated chat history.
 */
async function createChatHistoryOrRetrieve(filename, message) {
    const filePath = path.resolve(filename);

    let chatHistory = [];
    if (fs.existsSync(filePath)) {
        // File exists, retrieve chat history
        const loadedData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        chatHistory = loadedData.history;
    }

    // Add the new message to the chat history
    chatHistory.push(message);

    // Write the updated chat history back to the file
    const jsonData = JSON.stringify({ history: chatHistory }, null, 4);
    fs.writeFileSync(filePath, jsonData, 'utf-8');

    return chatHistory;
}

/**
 * Removes specific patterns from the input text.
 * for modifying the Whatsapp chatID response to create the JSON.
 * before: 120363159238258722@c.us
 * before: 120363159238258722@g.us
 * after:  120363159238258722
 * @param {string} inputText - The text from which patterns should be removed.
 * @returns {string} - The input text with specified patterns removed.
 */
function removePattern(inputText) {
    return inputText.replace(/@g\.us|@c\.us/g, '');
}

module.exports = {
    validateAndExtractImgCommand,
    extractTextAfterAct,
    getChatHistory,
    createChatHistoryOrRetrieve,
    removePattern
}