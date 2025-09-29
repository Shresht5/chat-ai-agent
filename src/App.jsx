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
          "Authorization": `Bearer ${import.meta.env.VITE_API_SECRET_KEY}`, // keep key safe in .env
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat-v3.1:free", // use a valid free model
          messages: [...messages, newMessage],
        }),
      });

      const data = await res.json();
      console.log(data);
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
    <div
      style={{
        maxWidth: "700px",
        margin: "20px auto",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        height: "90vh",
        border: "1px solid #e0e0e0",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #cb19eaff, #2d57ccff)",
          color: "white",
          padding: "16px",
          textAlign: "center",
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        🤖 My Personal AI Agent
      </div>

      {/* Chat Box */}
      <div
        style={{
          flex: 1,
          padding: "15px",
          background: "#f9f9f9",
          overflowY: "auto",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              margin: "10px 0",
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "75%",
                padding: "10px 14px",
                borderRadius: "18px",
                background: msg.role === "user" ? " #2d57ccff" : " #cb19eaff",
                color: msg.role === "user" ? "white" : "white",
                fontSize: "14px",
                lineHeight: "1.4",
              }}
            >
              <b>{msg.role === "user" ? "You" : "AI"}:</b> {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <p style={{ fontStyle: "italic", color: "#777" }}>AI is typing...</p>
        )}
      </div>

      {/* Input Box */}
      <form
        onSubmit={sendMessage}
        style={{
          display: "flex",
          borderTop: "1px solid #ddd",
          padding: "10px",
          background: "linear-gradient(135deg, #cb19eaff, #2d57ccff)",
        }}
      >
        <input
          name="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            flex: 1,
            padding: "10px 14px",
            border: "1px solid #ccc",
            borderRadius: "20px",
            outline: "none",
            fontSize: "14px",
          }}
          placeholder="Type your message..."
        />
        <button
          type="submit"
          style={{
            padding: "7px 15px",
            marginLeft: "8px",
            border: "solid white 3px ",
            borderRadius: "20px",
            background: "linear-gradient(135deg, #cb19eaff, #2d57ccff)",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default App;