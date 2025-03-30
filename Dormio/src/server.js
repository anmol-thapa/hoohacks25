import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = 5839;
const APP_KEY = "INSET_APP_KEY";

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// OpenAI API endpoint
app.post('/askai', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const apiResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o", // Using the latest GPT-4o model
        messages: [{ role: "user", content: message }],
        temperature: 0.7
      },
      {
        headers: {
          "Authorization": `Bearer ${APP_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json(apiResponse.data);
  } catch (error) {
    console.error("Error calling OpenAI API:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to communicate with ChatGPT" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
