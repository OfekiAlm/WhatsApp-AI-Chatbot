const fs = require('fs');
const path = require('path');

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
 * Creates or retrieves the chat history from a JSON file.
 *
 * @param {string} filename - The name of the JSON file to create or retrieve.
 * @returns {Array} - An array containing chat history.
 */
async function createChatHistoryOrRetrieve(filename) {
    const filePath = path.resolve(filename);
    if(fs.existsSync(filePath)){
        return getChatHistory(filePath);
    }
    else{
        const initialData = { history: [] };
        await fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));
        return getChatHistory(filePath);
    }
}

/**
 * Writes a message to the chat history in a JSON file.
 *
 * @param {string} filePath - The path to the JSON file to write the message to.
 * @param {string} message - The message to add to the chat history.
 */
function writeChatHistory(filePath, message){
    const loadedData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    loadedData.history.push(message);
    const jsonData = JSON.stringify(loadedData, null, 4);
    
    fs.writeFileSync(filePath,jsonData,'utf-8');
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
    extractTextAfterAct,
    getChatHistory,
    createChatHistoryOrRetrieve,
    writeChatHistory,
    removePattern
}