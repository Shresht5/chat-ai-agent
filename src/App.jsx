import React, { useState } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input) return;
    const newMessage = { role: "user", content: input };
    setMessages([...messages, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer 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`, // keep key safe in .env
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat-v3.1:free", // use a valid free model
          messages: [...messages, newMessage],
        }),
      });

      const data = await res.json();
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
    <div style={{ maxWidth: "600px", margin: "0px auto", fontFamily: "Arial", height: "calc(100vh-100px)" }}>
      <h2>🤖 My Personal AI Agent</h2>
      <div style={{ border: "1px solid #ccc", padding: "10px", height: "75vh", overflowY: "scroll" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ margin: "8px 0" }}>
            <b>{msg.role === "user" ? "You" : "AI"}:</b> {msg.content}
          </div>
        ))}
        {loading && <p>AI is typing...</p>}
      </div>
      <form onSubmit={sendMessage} style={{ marginTop: "10px" }}>
        <input
          name="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ width: "80%", padding: "8px" }}
          placeholder="Type your message..."
        />
        <button type="submit" style={{ padding: "8px 12px", marginLeft: "5px" }}>
          Send
        </button>
      </form>
    </div >
  );
}

export default App;