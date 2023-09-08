const fs = require('fs');
const path = require('path');

function extractTextAfterAct(input) {
    const match = input.match(/!act\s*(.+)/);
    if (match && match[1]) {
      return match[1].trim();
    }
    return null; // Return null if there's no match or text after "!act"
  }

function getChatHistory(fileName){
    const data = JSON.parse(fs.readFileSync(fileName, 'utf-8'));
    return data.history;
}

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
function writeChatHistory(filePath, message){
    const loadedData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    loadedData.history.push(message);
    const jsonData = JSON.stringify(loadedData, null, 4);
    
    fs.writeFileSync(filePath,jsonData,'utf-8');
}

//remove the whatsapp pattern in order
//to make a json file for that Chat/groupChat.
//input example - 
//----------@c.us
//----------@g.us
//output example -
//----------
//----------
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