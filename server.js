// server.js
const express = require("express");
const path = require("path");

const app = express();

// ملفات ثابتة
app.use(express.static(path.join(__dirname, "public")));

// API: كل المسلسلات
app.get("/api/shows", async (req, res) => {
  try {
    const response = await fetch("https://api.tvmaze.com/shows", {
      headers: { "User-Agent": "Node.js TV Project" }
    });
    if (!response.ok) throw new Error("TVMaze fetch failed");
    const shows = await response.json();
    res.json(shows);
  } catch (err) {
    console.error("Error fetching shows:", err);
    res.status(500).json({ error: "Server error fetching shows" });
  }
});

// API: حلقات مسلسل معين
app.get("/api/shows/:id/episodes", async (req, res) => {
  try {
    const response = await fetch(`https://api.tvmaze.com/shows/${req.params.id}/episodes`, {
      headers: { "User-Agent": "Node.js TV Project" }
    });
    if (!response.ok) throw new Error("TVMaze fetch failed");
    const episodes = await response.json();
    res.json(episodes);
  } catch (err) {
    console.error("Error fetching episodes:", err);
    res.status(500).json({ error: "Server error fetching episodes" });
  }
});

// شغل السيرفر
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
