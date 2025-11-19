import React, { useState } from "react";
import './App.css'
import Header from "./component/Header";
import Loader from "./component/Loader";
import InputBar from "./component/InputBar";

function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  function messageInput(input) {
    sendMessage(input)
  }

  const sendMessage = async (input) => {
    if (!input) return;
    const newMessage = { role: "user", content: input };
    setMessages([...messages, newMessage]);
    setLoading(true);

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_API_SECRET_KEY}`,
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b:free",
          messages: [...messages, newMessage],
        }),
      });

      const data = await res.json();
      console.log(data);
      if (data?.error) {
        setMessages(prev => [...prev, { role: "ai", content: data.error.message }]);
        return;
      }
      if (data.choices && data.choices.length > 0) {
        const reply = data.choices[0].message;
        setMessages([...messages, newMessage, { role: reply.role, content: reply.content }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-[#151f27] min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 overflow-y-auto">
        {messages.map((msg, i) => (
          <div className={`message ${msg.role === "user" ? "user" : "ai"}`} key={i}>
            <div className={`messagebubble ${msg.role === "user" ? "user" : "ai"}`}>
              <p>{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <Loader />
        )}
      </div>
      <div className="sticky bottom-0">
        <InputBar messageInput={messageInput} />
      </div>
    </div>
  );
}

export default App;