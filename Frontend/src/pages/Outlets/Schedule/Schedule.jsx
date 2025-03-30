import { useState } from "react";

export default function Schedule() {
  const [file, setFile] = useState(null);

  const handleFileAdd = (e) => {
    setFile(e.target.files[0]);
  };

  const sendMessageToGPT = async (message) => {
    try {
      const response = await fetch("http://localhost:5839/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message }) // Properly format JSON
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error fetching ChatGPT response:", error);
      return "Error processing request.";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      console.error("No file selected");
      return;
    }

    // Read the file contents
    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = async () => {
      const fileContent = reader.result;

      // Send the file content to GPT
      const gptResponse = await sendMessageToGPT(`Based on this classes calendar, and the assumption that the user sleeps at 11:30pm and wants 8 hours of sleep whenever possible, what are the optimal times (and amount to nap) to nap that the events are not effected nor is the sleep schedule (sleeping too close to close to bedtime or for too long). Don't expect any naps to be taken  Respond with optimal time slots for each day for each line, nothing more: ${fileContent}`);
      console.log(gptResponse);
    };

    reader.onerror = () => {
      console.error("Error reading file");
    };
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileAdd} />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
