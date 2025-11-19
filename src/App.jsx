import React, { useEffect, useRef, useState } from "react";
import './App.css'
import Header from "./component/Header";
import Loader from "./component/Loader";
import InputBar from "./component/InputBar";

function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  function messageInput(input) {
    sendMessage(input)
  }

  const sendMessage = async (input) => {
    if (!input) return;
    const newMessage = { role: "user", content: input };
    const updatedMessages = [
      {
        role: "system",
        content:
          "You are a concise AI assistant. Reply directly and briefly. Add extra points only if necessary. Avoid long explanations.",
      },
      ...messages,
      newMessage,
    ];
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
          messages: updatedMessages,
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


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="relative bg-[#151f27] min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 overflow-y-auto">
        {messages.map((msg, i) => (
          <div className={`message ${msg.role === "user" ? "user" : "ai"}`} key={i}>
            <div className={`messagebubble ${msg.role === "user" ? "user" : "ai"}`}>
              <p>{msg.content.replace(/<\｜begin▁of▁sentence｜>/g, "")
                .replace(/<\|endoftext\|>/g, "")
                .replace(/\s+/g, " ")
                .replace(/###\s*/g, "\n\n")
                .replace(/\*\*\*(.*?)\*\*\*/g, "\n\n$1\n")
                .replace(/\*\*(.*?)\*\*/g, "\n$1\n")
                .replace(/\*\s*\*\s*\*\s*/g, "\n")
                .replace(/\*\s*(.*?)\s*:/g, "\n• $1:")
                .replace(/([.!?])\s+/g, "$1\n")
                .trim()}</p>
            </div>
          </div>
        ))}
        {loading && (
          <Loader />
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="sticky bottom-0">
        <InputBar messageInput={messageInput} />
      </div>
    </div>
  );
}

export default App;