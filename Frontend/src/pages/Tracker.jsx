import { useState, useEffect } from 'react';
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

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('sleepHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const decimalToTime = (decimal) => {
    if (decimal === '') return '';
    const hours = Math.floor(decimal);
    const minutes = Math.round((decimal - hours) * 60);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
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

    try {
      // Convert inputs to numbers
      const processedData = {
        ...formData,
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
        throw new Error('Failed to get prediction');
      }

      const data = await response.json();
      
      // Convert decimal times to AM/PM format for insights
      const formattedData = {
        ...data,
        insights: data.insights.map(insight => {
          // Replace decimal times with AM/PM format in insights
          return insight.replace(/(\d+\.\d+)/g, (match) => {
            return decimalToTime(Number(match));
          });
        })
      };
      
      setResult(formattedData);

      // Add to history
      const newHistoryItem = {
        ...formattedData,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        input: { ...formData }
      };

      const updatedHistory = [newHistoryItem, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('sleepHistory', JSON.stringify(updatedHistory));

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
      <h1>Sleep Pattern Tracker</h1>
      
      <form onSubmit={handleSubmit} className={style.form}>
        <div className={style.formGroup}>
          <label>Weekday Sleep Start (decimal hours):</label>
          <input
            type="number"
            name="Weekday_Sleep_Start"
            value={formData.Weekday_Sleep_Start}
            onChange={handleChange}
            placeholder="Enter time"
            required
            min="0"
            max="24"
            step="0.5"
          />
        </div>

        <div className={style.formGroup}>
          <label>Weekend Sleep Start (decimal hours):</label>
          <input
            type="number"
            name="Weekend_Sleep_Start"
            value={formData.Weekend_Sleep_Start}
            onChange={handleChange}
            placeholder="Enter time"
            required
            min="0"
            max="24"
            step="0.5"
          />
        </div>

        <div className={style.formGroup}>
          <label>Weekday Sleep End (decimal hours):</label>
          <input
            type="number"
            name="Weekday_Sleep_End"
            value={formData.Weekday_Sleep_End}
            onChange={handleChange}
            placeholder="Enter time"
            required
            min="0"
            max="24"
            step="0.5"
          />
        </div>

        <div className={style.formGroup}>
          <label>Weekend Sleep End (decimal hours):</label>
          <input
            type="number"
            name="Weekend_Sleep_End"
            value={formData.Weekend_Sleep_End}
            onChange={handleChange}
            placeholder="Enter time"
            required
            min="0"
            max="24"
            step="0.5"
          />
        </div>

        <div className={style.formGroup}>
          <label>Screen Time (hours per day):</label>
          <input
            type="number"
            name="Screen_Time"
            value={formData.Screen_Time}
            onChange={handleChange}
            placeholder="Enter hours"
            required
            min="0"
            max="24"
            step="0.5"
          />
        </div>

        <div className={style.formGroup}>
          <label>Physical Activity (minutes per day):</label>
          <input
            type="number"
            name="Physical_Activity"
            value={formData.Physical_Activity}
            onChange={handleChange}
            placeholder="Enter minutes"
            required
            min="0"
            max="1440"
            step="5"
          />
        </div>

        <div className={style.formGroup}>
          <label>Caffeine Intake (mg per day):</label>
          <input
            type="number"
            name="Caffeine_Intake"
            value={formData.Caffeine_Intake}
            onChange={handleChange}
            placeholder="Enter milligrams"
            required
            min="0"
            max="1000"
            step="10"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze Sleep Pattern'}
        </button>
      </form>

      {error && <div className={style.error}>{error}</div>}

      {result && (
        <div className={style.result}>
          <h2>Analysis Results</h2>
          <div className={style.score}>
            <h3>Sleep Quality Score: {result.prediction.toFixed(1)}/10</h3>
          </div>
          
          <div className={style.insights}>
            <h3>Key Insights</h3>
            <ul>
              {result.insights.map((insight, index) => (
                <li key={index}>{insight}</li>
              ))}
            </ul>
          </div>

          <div className={style.recommendations}>
            <h3>Recommendations</h3>
            <p>{result.recommendations}</p>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className={style.historySection}>
          <h2>Sleep History</h2>
          {history.map((item, index) => (
            <div key={index} className={style.historyItem}>
              <div className={style.historyDate}>
                {item.date} at {item.time}
              </div>
              <div className={style.historyScore}>
                Sleep Quality Score: {item.prediction.toFixed(1)}/10
              </div>
              <div className={style.insights}>
                <h3>Key Insights</h3>
                <ul>
                  {item.insights.map((insight, idx) => (
                    <li key={idx}>{insight}</li>
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