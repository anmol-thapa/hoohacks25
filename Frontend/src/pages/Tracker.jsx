import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './Tracker.module.css';

export default function Tracker() {
  const [formData, setFormData] = useState({
    Weekday_Sleep_Start: '',
    Weekend_Sleep_Start: '',
    Weekday_Sleep_End: '',
    Weekend_Sleep_End: '',
    Screen_Time: '',
    Physical_Activity: '',
    Caffeine_Intake: ''
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
      return;
    }
    // Load history from MongoDB
    loadHistory(userId);
  }, [navigate]);

  const loadHistory = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/history/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to load history');
      }
      const data = await response.json();
      setHistory(data.records);
    } catch (err) {
      console.error('Error loading history:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
      return;
    }

    try {
      // Convert all inputs to numbers
      const processedData = {
        ...formData,
        user_id: userId,
        Weekday_Sleep_Start: Number(formData.Weekday_Sleep_Start),
        Weekend_Sleep_Start: Number(formData.Weekend_Sleep_Start),
        Weekday_Sleep_End: Number(formData.Weekday_Sleep_End),
        Weekend_Sleep_End: Number(formData.Weekend_Sleep_End),
        Screen_Time: Number(formData.Screen_Time),
        Physical_Activity: Number(formData.Physical_Activity),
        Caffeine_Intake: Number(formData.Caffeine_Intake)
      };

      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processedData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get prediction');
      }

      const data = await response.json();
      setResult(data);
      loadHistory(userId); // Reload history after new submission

      // Clear form
      setFormData({
        Weekday_Sleep_Start: '',
        Weekend_Sleep_Start: '',
        Weekday_Sleep_End: '',
        Weekend_Sleep_End: '',
        Screen_Time: '',
        Physical_Activity: '',
        Caffeine_Intake: ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.container}>
      <form onSubmit={handleSubmit} className={style.form}>
        <div className={style.formGroup}>
          <label>Weekday Sleep Start (decimal hours):</label>
          <input
            type="number"
            name="Weekday_Sleep_Start"
            value={formData.Weekday_Sleep_Start}
            onChange={handleChange}
            required
            min="0"
            max="24"
            step="0.5"
            placeholder="Enter time (e.g., 23.5 for 11:30 PM)"
          />
        </div>

        <div className={style.formGroup}>
          <label>Weekend Sleep Start (decimal hours):</label>
          <input
            type="number"
            name="Weekend_Sleep_Start"
            value={formData.Weekend_Sleep_Start}
            onChange={handleChange}
            required
            min="0"
            max="24"
            step="0.5"
            placeholder="Enter time (e.g., 0.5 for 12:30 AM)"
          />
        </div>

        <div className={style.formGroup}>
          <label>Weekday Sleep End (decimal hours):</label>
          <input
            type="number"
            name="Weekday_Sleep_End"
            value={formData.Weekday_Sleep_End}
            onChange={handleChange}
            required
            min="0"
            max="24"
            step="0.5"
            placeholder="Enter time (e.g., 7.5 for 7:30 AM)"
          />
        </div>

        <div className={style.formGroup}>
          <label>Weekend Sleep End (decimal hours):</label>
          <input
            type="number"
            name="Weekend_Sleep_End"
            value={formData.Weekend_Sleep_End}
            onChange={handleChange}
            required
            min="0"
            max="24"
            step="0.5"
            placeholder="Enter time (e.g., 9.0 for 9:00 AM)"
          />
        </div>

        <div className={style.formGroup}>
          <label>Screen Time (hours):</label>
          <input
            type="number"
            name="Screen_Time"
            value={formData.Screen_Time}
            onChange={handleChange}
            required
            min="0"
            max="24"
            step="0.5"
            placeholder="Enter screen time"
          />
        </div>

        <div className={style.formGroup}>
          <label>Physical Activity (minutes):</label>
          <input
            type="number"
            name="Physical_Activity"
            value={formData.Physical_Activity}
            onChange={handleChange}
            required
            min="0"
            max="480"
            step="5"
            placeholder="Enter physical activity"
          />
        </div>

        <div className={style.formGroup}>
          <label>Caffeine Intake (mg):</label>
          <input
            type="number"
            name="Caffeine_Intake"
            value={formData.Caffeine_Intake}
            onChange={handleChange}
            required
            min="0"
            max="1000"
            step="10"
            placeholder="Enter caffeine intake"
          />
        </div>

        {error && <div className={style.error}>{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze Sleep Pattern'}
        </button>
      </form>

      {result && (
        <div className={style.result}>
          <h2>Analysis Results</h2>
          <div className={style.prediction}>
            <h3>Sleep Quality Score: {result.prediction.toFixed(1)}/10</h3>
          </div>
          <div className={style.insights}>
            <h3>Insights:</h3>
            <ul>
              {result.insights.map((insight, index) => (
                <li key={index}>{insight}</li>
              ))}
            </ul>
          </div>
          <div className={style.recommendations}>
            <h3>Recommendations:</h3>
            <p>{result.recommendations}</p>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className={style.history}>
          <h2>Sleep History</h2>
          {history.map((record, index) => (
            <div key={index} className={style.historyItem}>
              <h3>Record {history.length - index}</h3>
              <p>Sleep Quality: {record.prediction.toFixed(1)}/10</p>
              <p>Date: {new Date(record.created_at).toLocaleDateString()}</p>
              <div className={style.insights}>
                <h4>Insights:</h4>
                <ul>
                  {record.insights.map((insight, i) => (
                    <li key={i}>{insight}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 