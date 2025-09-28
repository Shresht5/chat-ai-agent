🤖 My Personal AI Agent

A simple React-based chatbot powered by the OpenRouter
 API.
This project demonstrates how to send and receive chat messages with free AI models such as DeepSeek.

✨ Features

💬 Chat with an AI agent in real-time

📜 Messages displayed in a scrollable container (vertical only)

⌨️ Input field with submit button

⏳ “AI is typing…” indicator while waiting for a response

🔑 Uses OpenRouter
 to access free/paid models

🚀 Getting Started
1. Clone the repository
git clone https://github.com/your-username/ai-agent-react.git
cd ai-agent-react

2. Install dependencies
npm install

3. Get an OpenRouter API key

Go to OpenRouter.ai
.

Generate a free API key.

Copy it.

4. Set up environment variables

Create a .env file in the root of your project:

REACT_APP_OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxx


⚠️ Important: Never hardcode your key in React code (it will be visible in DevTools). For production apps, use a backend server to keep the key secure.

5. Update the API call

In App.jsx, replace the header with:

"Authorization": `Bearer ${process.env.REACT_APP_OPENROUTER_API_KEY}`,


And make sure you’re using a valid model slug (for free models, try deepseek/deepseek-chat:free).

6. Start the app
npm start


Open http://localhost:3000
 to see it in action.

📂 Project Structure
/src
 └── App.jsx        # Main React component with chat logic
 └── index.js       # Entry point
.env                # Stores API key
package.json        # Dependencies and scripts
README.md           # Documentation

🛠 How It Works

User enters a message in the input box.

sendMessage() sends the message + conversation history to OpenRouter’s /chat/completions endpoint.

API responds with the AI’s reply.

The reply is added to messages state and displayed in the chat box.

UI updates automatically with React re-render.

🖥 Example
You: Hello!
AI: Hi there! How can I help you today?

⚡ Improvements (Future Roadmap)

✅ Auto-scroll to latest message

✅ Better UI with Tailwind or Material UI

✅ Store chat history in localStorage

✅ Add backend proxy for secure API key usage