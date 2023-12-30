# WhatsApp AI Chatbot

Welcome to the WhatsApp AI Chatbot! This project uses Node.js and OpenAI's GPT to create a innovative chatbot for WhatsApp, Intelligent chatbot that can respond to user messages and perform actions based on certain commands.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Installation](#installation)
   - [Clone the Repository](#clone-the-repository)
   - [Install Dependencies](#install-dependencies)
   - [WhatsApp Login](#whatsapp-web-login)
   - [OpenAI API Key](#openai-api-key)
   - [Start the Bot](#start-the-bot)
   - [Start Chatting](#start-chatting)
3. [Using the Chatbot](#using-the-chatbot)
4. [Project Structure](#project-structure)
5. [Contributing](#contributing)
6. [Chat History JSON Structure](#chat-history-json-structure)
7. [Contact](#contact)

# Project Explanation

This WhatsApp AI Chatbot is designed to interact with users in WhatsApp groups or individual chats. It can respond to user messages and perform specific actions when triggered by a message. The core functionality includes:

- **User Messaging**: The chatbot can engage in conversations with users and respond to their messages.

- **Chat History**: All chat interactions are logged in JSON files, making it easy to track conversations and system actions over time.

# Installation

To get this project up and running, follow these steps:

1. **Clone the Repository:** Clone this GitHub repository to your local machine.
    ```bash
    git clone https://github.com/OfekiAlm/whatsapp-ai-chatbot.git
    cd whatsapp-ai-chatbot
    ```
2. **Install Dependencies:** Make sure you have Node.js installed. Then, install the required Node.js packages.
    ```bash
    npm install
    ```

3. **WhatsApp Web Login:** In order to use this chatbot, you need to log in to WhatsApp Web using your phone. The chatbot will display a QR code for you to scan using the WhatsApp app on your phone.

4. **OpenAI API Key:** You need an API key from OpenAI to use the GPT functionality. Visit the [OpenAI](https://platform.openai.com/account/api-keys) website to sign up and obtain an API key. Once you have it, create a `.env` file in the project root directory and add your API key as follows:
    ```makefile
    OPENAI_API_KEY=your_api_key_here
    ```
5. **Make a folder for chat history**: Create the directory using the following command:
   ```bash
   mkdir chats_history
   ```
6. **(OPTINAL) for transcriptions funcionality**:
Create the directory using the following command:
   ```bash
   mkdir .audio_cache
   ```
    And if you haven't installed `ffmpeg` already:
    
    Linux - 
    ```bash
    sudo apt update
    sudo apt install ffmpeg
    ``` 

    Windows -

    You can follow [this](https://phoenixnap.com/kb/ffmpeg-windows) tutorial which is guiding with a step by step explanation

7. **Start the Bot:** Run the bot using the following command:
    ```bash
    node bot.js
    ```
8. **Setting a phone number For testing purposes(OPTIONAL):** 
This phone number will act as chatGPT reciever of messages and will respond to each message sent to this phone number via Whatsapp.
    ```
    PHONE_NUMBER_TO_CONTACT = your_number 
    ```
9. **Start Chatting:** Once the bot is running and authenticated, you can start chatting with it on WhatsApp!


## Using the Chatbot

- Simply send messages to the bot, and it will respond accordingly.
- To trigger system actions, send a message starting with "!act". The chatbot will log and respond to these actions. [Further information about this role](https://community.openai.com/t/the-system-role-how-it-influences-the-chat-behavior/87353)
- All chat interactions are saved in JSON files in the `chats_history` directory.

## Image Generation Feature

The chatbot now supports image generation. Command format:
```
!generate [number of images] [prompt]
```
For example, `!generate 3 sunset over a beach`.

default number of creations is one image.

## Project Structure

- `bot.js`: Main entry point of the application.
- `chat_funcionality.js`: Module for chat-related functionality and history logging.
- `open_ai_gpt.js`: Module for interacting with OpenAI's GPT API.
- `package.json`: Contains project dependencies and scripts.

## Chat History JSON Structure

The chat history is stored in JSON format, organized as an array of messages. Each message has two main properties:

- `"role"`: Indicates the sender's role, such as "user" or "system".
- `"content"`: Contains the message content.

This structured format simplifies the storage and retrieval of chat history for analysis and tracking.

```json
{
   "history":
   [
      { "role": "system", "content": "act like a teacher"},
      { "role": "user", "content": "Hi"},
      { "role": "user", "content": "Can you explain about math equations?"}
   ]
}
```
Please note that messages sent by the assistant are not included in this JSON structure (For computing purposes).

## ASISTANT_LOGS Configuration

In the `bot.js` file, you will find a variable named `ASISTANT_LOGS`. This variable is used to control whether the chatbot logs the responses generated by the assistant (AI) during conversations. Here's how it works:

- If `ASISTANT_LOGS` is set to `true`, the chatbot will log the responses generated by the assistant into the chat history, making it possible to review the assistant's interactions in the chat history.

- If `ASISTANT_LOGS` is set to `false`, the chatbot will not log the assistant's responses in the chat history. This can be useful for scenarios where you only want to track user messages and not the AI-generated responses.

### Usage

To enable or disable the logging of assistant responses, open the `bot.js` file and locate the `ASISTANT_LOGS` variable at the beginning of the script. You can change its value to `true` or `false` as needed.

```javascript
const ASISTANT_LOGS = true; // Set to true to log assistant responses, or false to exclude them from the chat history.
```

## Contributing

Feel free to contribute to this project by submitting issues or pull requests. I welcome any improvements or feature additions!

Thank you for using my project. Enjoy your conversations with this intelligent chatbot!

## Contact

If you have any questions, feedback, or need assistance with the project, please don't hesitate to reach out:

- **Email**: [ofekalm100@gmail.com](mailto:ofekalm100@example.com)

Feel free to contact me anytime; I'm here to help!
