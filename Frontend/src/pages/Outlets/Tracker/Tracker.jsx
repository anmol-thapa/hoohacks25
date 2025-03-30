import { useState, useEffect } from "react";
import { useAuth } from "../../../auth/UserAuth";
import style from "./Tracker.module.css";

export default function Tracker() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    Weekday_Sleep_Start: "",
    Weekend_Sleep_Start: "",
    Weekday_Sleep_End: "",
    Weekend_Sleep_End: "",
    Screen_Time: "",
    Physical_Activity: "",
    Caffeine_Intake: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  // Load existing sleep history from user data
  useEffect(() => {
    setHistory(user.sleepData || []);
  }, [user]);

  // Handles input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handles form submission & calls ChatGPT API via server
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Format data for ChatGPT analysis
      const message = `
        Analyze the user's sleep habits based on the following data:
        - Weekday Sleep Start: ${formData.Weekday_Sleep_Start} hours
        - Weekend Sleep Start: ${formData.Weekend_Sleep_Start} hours
        - Weekday Sleep End: ${formData.Weekday_Sleep_End} hours
        - Weekend Sleep End: ${formData.Weekend_Sleep_End} hours
        - Screen Time: ${formData.Screen_Time} hours
        - Physical Activity: ${formData.Physical_Activity} minutes
        - Caffeine Intake: ${formData.Caffeine_Intake} mg

        Provide:
        1. A Sleep Quality Score (1-10)
        2. Key insights about their sleep patterns
        3. Actionable recommendations to improve sleep.

        Do not use ** and such markdowns, the response will be displayed in plain text.
      `;

      const response = await fetch("http://127.0.0.1:5839/askai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get prediction");
      }

      const data = await response.json();
      const chatResponse = data.choices[0]?.message?.content || "No response";

      // Save results
      setResult(chatResponse);

      // Update local storage with new sleep data
      const updatedUser = {
        ...user,
        sleepData: [...(user.sleepData || []), chatResponse],
      };

      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
      accounts = accounts.map((acc) =>
        acc.username === user.username ? updatedUser : acc
      );
      localStorage.setItem("accounts", JSON.stringify(accounts));

      setHistory(updatedUser.sleepData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.container}>
      <form onSubmit={handleSubmit} className={style.form}>
        <h2 className={style.title}>Sleep Tracker</h2>

        {/* Sleep Input Fields */}
        <div className={style.formGroup}>
          <label>Weekday Sleep Start (hours):</label>
          <input type="number" name="Weekday_Sleep_Start" value={formData.Weekday_Sleep_Start} onChange={handleChange} required min="0" max="24" step="0.5" placeholder="Enter time (e.g., 23.5 for 11:30 PM)" />
        </div>

        <div className={style.formGroup}>
          <label>Weekend Sleep Start (hours):</label>
          <input type="number" name="Weekend_Sleep_Start" value={formData.Weekend_Sleep_Start} onChange={handleChange} required min="0" max="24" step="0.5" placeholder="Enter time (e.g., 0.5 for 12:30 AM)" />
        </div>

        <div className={style.formGroup}>
          <label>Weekday Sleep End (hours):</label>
          <input type="number" name="Weekday_Sleep_End" value={formData.Weekday_Sleep_End} onChange={handleChange} required min="0" max="24" step="0.5" placeholder="Enter time (e.g., 7.5 for 7:30 AM)" />
        </div>

        <div className={style.formGroup}>
          <label>Weekend Sleep End (hours):</label>
          <input type="number" name="Weekend_Sleep_End" value={formData.Weekend_Sleep_End} onChange={handleChange} required min="0" max="24" step="0.5" placeholder="Enter time (e.g., 9.0 for 9:00 AM)" />
        </div>

        {/* Lifestyle Factors */}
        <div className={style.formGroup}>
          <label>Screen Time (hours):</label>
          <input type="number" name="Screen_Time" value={formData.Screen_Time} onChange={handleChange} required min="0" max="24" step="0.5" placeholder="Enter screen time" />
        </div>

        <div className={style.formGroup}>
          <label>Physical Activity (minutes):</label>
          <input type="number" name="Physical_Activity" value={formData.Physical_Activity} onChange={handleChange} required min="0" max="480" step="1" placeholder="Enter physical activity" />
        </div>

        <div className={style.formGroup}>
          <label>Caffeine Intake (mg):</label>
          <input type="number" name="Caffeine_Intake" value={formData.Caffeine_Intake} onChange={handleChange} required min="0" max="1000" step="1" placeholder="Enter caffeine intake" />
        </div>

        {error && <div className={style.error}>{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? "Analyzing..." : "Analyze Sleep Pattern"}
        </button>
      </form>

      {/* Display ChatGPT Results */}
      {result && (
        <div className={style.result}>
          <h2>Sleep Analysis</h2>
          <pre className={style.response}>{result}</pre>
        </div>
      )}
    </div>
  );
}
