import { useState } from "react";
import styles from "./Schedule.module.css";

export default function Schedule() {
  const [file, setFile] = useState(null);
  const [napSchedule, setNapSchedule] = useState([]);

  const handleFileAdd = (e) => {
    setFile(e.target.files[0]);
  };

  const sendMessageToGPT = async (message) => {
    try {
      const response = await fetch("http://localhost:5839/askai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
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

    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = async () => {
      const fileContent = reader.result;

      // Send the file content to GPT
      const gptResponse = await sendMessageToGPT(`Based on this class calendar, and the assumption that the user sleeps at 11:30pm and wants 8 hours of sleep whenever possible, what are the optimal times (and amount to nap) to nap so that the events are not affected nor is the sleep schedule disrupted (e.g., sleeping too close to bedtime or for too long)? Respond with optimal time slots for each day in this format: 'Day: Start Time - End Time (Nap Duration)' nothing more: ${fileContent}`);

      console.log(gptResponse);

      // Convert AI response into structured data
      const parsedSchedule = gptResponse
        .split("\n")
        .filter((line) => line.trim() !== "")
        .map((line) => {
          const match = line.match(/(.+?):\s(.+?)\s-\s(.+?)\s\((.+?)\)/);
          return match
            ? {
              day: match[1].trim(),
              startTime: match[2].trim(),
              endTime: match[3].trim(),
              duration: match[4].trim(),
            }
            : null;
        })
        .filter(Boolean);

      setNapSchedule(parsedSchedule);
    };

    reader.onerror = () => {
      console.error("Error reading file");
    };
  };

  return (
    <div className={styles.container}>
      {/* Page Title */}
      <h1 className={styles.title}>Optimal Nap Schedule</h1>
      <p className={styles.subtitle}>
        Upload your .ics calendar, and we’ll generate optimal nap times that
        ensure you get enough rest while keeping your productivity high.
      </p>

      {/* File Upload Section */}
      <form onSubmit={handleSubmit} className={styles.fileUpload}>
        <input type="file" onChange={handleFileAdd} className={styles.fileInput} />
        <button type="submit" className={styles.button}>Generate Optimal Nap Times</button>
      </form>

      {/* Nap Schedule Section */}
      <div className={styles.scheduleSection}>
        <h2 className={styles.sectionTitle}>Your Personalized Nap Schedule</h2>
        <p className={styles.sectionDescription}>
          The schedule below is designed to maximize your rest without disrupting your nighttime sleep or interfering with classes/events.
        </p>

        {/* Nap Time Cards */}
        <div className={styles.cardContainer}>
          {napSchedule.length > 0 ? (
            napSchedule.map((nap, index) => (
              <div key={index} className={styles.card}>
                <h3>{nap.day}</h3>
                <p>{nap.startTime} - {nap.endTime}</p>
                <p>({nap.duration} nap)</p>
              </div>
            ))
          ) : (
            <p className={styles.noSchedule}>No nap schedule generated yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
