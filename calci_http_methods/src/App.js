import React, { useState } from "react";

function App() {
  const [windowPrev, setWindowPrev] = useState([]);
  const [windowCurr, setWindowCurr] = useState([]);
  const [fetched, setFetched] = useState([]);
  const [avg, setAvg] = useState(0);

  const API_BASE = process.env.REACT_APP_API_BASE;
  const TOKEN = process.env.REACT_APP_ACCESS_TOKEN;
  const WINDOW_SIZE = 10;

  const fetchNumbers = async (type) => {
    try {
      const response = await fetch(`${API_BASE}/${type}`, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      return data.numbers || [];
    } catch (err) {
      console.error("Error fetching numbers:", err);
      return [];
    }
  };

  const handleRequest = async (type) => {
    const newNums = await fetchNumbers(type);
    if (newNums.length === 0) return;

    setFetched(newNums);

    const combined = Array.from(new Set([...windowCurr, ...newNums]));
    const trimmed = combined.slice(-WINDOW_SIZE);

    setWindowPrev(windowCurr);
    setWindowCurr(trimmed);
    const average =
      trimmed.reduce((sum, num) => sum + num, 0) / trimmed.length;
    setAvg(parseFloat(average.toFixed(2)));
  };

  const typeMap = {
    p: "primes",
    f: "fibo",
    e: "even",
    r: "rand",
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>HTTP Microservice Calculator</h2>
      <p>Click to fetch numbers and calculate average over sliding window.</p>

      {Object.entries(typeMap).map(([key, value]) => (
        <button
          key={key}
          onClick={() => handleRequest(value)}
          style={{
            margin: "5px",
            padding: "10px",
            cursor: "pointer",
            background: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Fetch {key.toUpperCase()}
        </button>
      ))}

      <div style={{ marginTop: "20px" }}>
        <pre>
{JSON.stringify(
  {
    windowPrevState: windowPrev,
    windowCurrState: windowCurr,
    numbers: fetched,
    avg,
  },
  null,
  2
)}
        </pre>
      </div>
    </div>
  );
}

export default App;
