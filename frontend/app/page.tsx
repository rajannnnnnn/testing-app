"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [provider, setProvider] = useState("openai");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    setLoading(true);
    setResponse("");

    const res = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, provider }),
    });

    const data = await res.json();
    setResponse(data.reply || data.error);
    setLoading(false);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>LLM App</h1>

      <select
        value={provider}
        onChange={(e) => setProvider(e.target.value)}
      >
        <option value="openai">OpenAI</option>
        <option value="claude">Claude</option>
      </select>

      <br /><br />

      <textarea
        rows={5}
        cols={50}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <br /><br />

      <button onClick={sendMessage} disabled={loading}>
        {loading ? "Thinking..." : "Send"}
      </button>

      <h3>Response:</h3>
      <p>{response}</p>
    </div>
  );
}
