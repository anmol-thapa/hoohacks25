"""
Flask server for sleep pattern prediction model
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import google.generativeai as genai
from preprocessing import initial_preprocess
import os
from dotenv import load_dotenv
from database import create_user, verify_user, save_sleep_record, get_user_sleep_records

# Load environment variables
load_dotenv()

# Configure Gemini
GEMINI_AVAILABLE = False
try:
    api_key = os.getenv('GEMINI_API_KEY')
    if api_key:
        api_key = api_key.strip().strip('"').strip("'")
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        test_response = model.generate_content("Hello")
        GEMINI_AVAILABLE = True
except Exception as e:
    model = None

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the trained model
try:
    ml_model = joblib.load('models/XGBoost_model.pkl')
except Exception as e:
    ml_model = None

# Load dataset statistics
try:
    df = pd.read_csv('datasets/student_sleep_patterns.csv')
    stats = {
        'Weekday_Sleep_Start': {
            'min': df['Weekday_Sleep_Start'].min(),
            'max': df['Weekday_Sleep_Start'].max(),
            'mean': df['Weekday_Sleep_Start'].mean(),
            'std': df['Weekday_Sleep_Start'].std()
        },
        'Weekend_Sleep_Start': {
            'min': df['Weekend_Sleep_Start'].min(),
            'max': df['Weekend_Sleep_Start'].max(),
            'mean': df['Weekend_Sleep_Start'].mean(),
            'std': df['Weekend_Sleep_Start'].std()
        },
        'Weekday_Sleep_End': {
            'min': df['Weekday_Sleep_End'].min(),
            'max': df['Weekday_Sleep_End'].max(),
            'mean': df['Weekday_Sleep_End'].mean(),
            'std': df['Weekday_Sleep_End'].std()
        },
        'Weekend_Sleep_End': {
            'min': df['Weekend_Sleep_End'].min(),
            'max': df['Weekend_Sleep_End'].max(),
            'mean': df['Weekend_Sleep_End'].mean(),
            'std': df['Weekend_Sleep_End'].std()
        },
        'Screen_Time': {
            'min': df['Screen_Time'].min(),
            'max': df['Screen_Time'].max(),
            'mean': df['Screen_Time'].mean(),
            'std': df['Screen_Time'].std()
        },
        'Physical_Activity': {
            'min': df['Physical_Activity'].min(),
            'max': df['Physical_Activity'].max(),
            'mean': df['Physical_Activity'].mean(),
            'std': df['Physical_Activity'].std()
        },
        'Caffeine_Intake': {
            'min': df['Caffeine_Intake'].min(),
            'max': df['Caffeine_Intake'].max(),
            'mean': df['Caffeine_Intake'].mean(),
            'std': df['Caffeine_Intake'].std()
        }
    }
except Exception as e:
    stats = None

def analyze_sleep_patterns(data):
    """Analyze sleep patterns and generate insights"""
    try:
        insights = []
        
        # Analyze weekday sleep schedule
        weekday_start = data['Weekday_Sleep_Start']
        if weekday_start > stats['Weekday_Sleep_Start']['mean'] + stats['Weekday_Sleep_Start']['std']:
            insights.append(f"Your weekday bedtime ({weekday_start}) is later than 68% of students")
        elif weekday_start < stats['Weekday_Sleep_Start']['mean'] - stats['Weekday_Sleep_Start']['std']:
            insights.append(f"Your weekday bedtime ({weekday_start}) is earlier than 68% of students")
        
        # Analyze weekend sleep schedule
        weekend_start = data['Weekend_Sleep_Start']
        if weekend_start > stats['Weekend_Sleep_Start']['mean'] + stats['Weekend_Sleep_Start']['std']:
            insights.append(f"Your weekend bedtime ({weekend_start}) is later than 68% of students")
        elif weekend_start < stats['Weekend_Sleep_Start']['mean'] - stats['Weekend_Sleep_Start']['std']:
            insights.append(f"Your weekend bedtime ({weekend_start}) is earlier than 68% of students")
        
        # Analyze screen time
        screen_time = data['Screen_Time']
        if screen_time > stats['Screen_Time']['mean'] + stats['Screen_Time']['std']:
            insights.append(f"Your screen time ({screen_time} hours) is higher than 68% of students")
        
        # Analyze physical activity
        physical_activity = data['Physical_Activity']
        if physical_activity < stats['Physical_Activity']['mean'] - stats['Physical_Activity']['std']:
            insights.append(f"Your physical activity ({physical_activity} minutes) is lower than 68% of students")
        
        # Analyze caffeine intake
        caffeine = data['Caffeine_Intake']
        if caffeine > stats['Caffeine_Intake']['mean'] + stats['Caffeine_Intake']['std']:
            insights.append(f"Your caffeine intake ({caffeine}mg) is higher than 68% of students")
        
        return insights
    except Exception as e:
        raise

def get_fallback_recommendations(data, insights):
    """Fallback recommendations when Gemini is unavailable"""
    recommendations = [
        "Maintain a consistent sleep schedule, even on weekends",
        "Avoid screens 1 hour before bedtime",
        "Exercise regularly, but not close to bedtime",
        "Limit caffeine intake, especially in the afternoon"
    ]
    return "\n".join(recommendations)

def generate_recommendations(data, prediction, insights):
    """Generate personalized recommendations using Gemini"""
    try:
        if not GEMINI_AVAILABLE:
            return get_fallback_recommendations(data, insights)
            
        prompt = f"""You are a sleep expert analyzing a student's sleep patterns. You have access to the full dataset of student sleep patterns and know the following statistics:

Sleep Schedule Ranges:
- Weekday bedtime: {stats['Weekday_Sleep_Start']['min']:.1f} to {stats['Weekday_Sleep_Start']['max']:.1f} (mean: {stats['Weekday_Sleep_Start']['mean']:.1f})
- Weekend bedtime: {stats['Weekend_Sleep_Start']['min']:.1f} to {stats['Weekend_Sleep_Start']['max']:.1f} (mean: {stats['Weekend_Sleep_Start']['mean']:.1f})
- Weekday wake time: {stats['Weekday_Sleep_End']['min']:.1f} to {stats['Weekday_Sleep_End']['max']:.1f} (mean: {stats['Weekday_Sleep_End']['mean']:.1f})
- Weekend wake time: {stats['Weekend_Sleep_End']['min']:.1f} to {stats['Weekend_Sleep_End']['max']:.1f} (mean: {stats['Weekend_Sleep_End']['mean']:.1f})

Lifestyle Factor Ranges:
- Screen time: {stats['Screen_Time']['min']:.1f} to {stats['Screen_Time']['max']:.1f} hours (mean: {stats['Screen_Time']['mean']:.1f})
- Physical activity: {stats['Physical_Activity']['min']:.1f} to {stats['Physical_Activity']['max']:.1f} minutes (mean: {stats['Physical_Activity']['mean']:.1f})
- Caffeine intake: {stats['Caffeine_Intake']['min']:.1f} to {stats['Caffeine_Intake']['max']:.1f}mg (mean: {stats['Caffeine_Intake']['mean']:.1f})

Current Student's Data:
Sleep Schedule:
- Weekday bedtime: {data['Weekday_Sleep_Start']}
- Weekend bedtime: {data['Weekend_Sleep_Start']}
- Weekday wake time: {data['Weekday_Sleep_End']}
- Weekend wake time: {data['Weekend_Sleep_End']}

Lifestyle Factors:
- Screen time: {data['Screen_Time']} hours
- Physical activity: {data['Physical_Activity']} minutes
- Caffeine intake: {data['Caffeine_Intake']}mg

Predicted Sleep Quality: {prediction}/10

Key Insights:
{chr(10).join(insights)}

Based on this data and your knowledge of the dataset ranges, provide 3-5 specific, actionable recommendations to improve sleep quality. 
Focus on practical steps that the student can implement immediately.
Make the recommendations personalized to their specific patterns and relative to the dataset statistics."""

        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return get_fallback_recommendations(data, insights)

@app.route('/signup', methods=['POST'])
def signup():
    """Handle user signup"""
    try:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        if not username or not email or not password:
            return jsonify({'error': 'Username, email and password are required'}), 400
        
        user_id, error = create_user(username, email, password)
        if error:
            return jsonify({'error': error}), 400
        
        return jsonify({'message': 'User created successfully', 'user_id': user_id})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    """Handle user login"""
    try:
        data = request.get_json()
        identifier = data.get('username') or data.get('email')
        password = data.get('password')
        
        if not identifier or not password:
            return jsonify({'error': 'Username/Email and password are required'}), 400
        
        user_id, error = verify_user(identifier, password)
        if error:
            return jsonify({'error': error}), 401
        
        return jsonify({'message': 'Login successful', 'user_id': user_id})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/predict', methods=['POST'])
def predict():
    """Make predictions on sleep quality and generate recommendations"""
    try:
        if ml_model is None:
            return jsonify({'error': 'Model not loaded'}), 500

        if stats is None:
            return jsonify({'error': 'Dataset statistics not loaded'}), 500

        # Get data from request
        data = request.get_json()
        user_id = data.get('user_id')  # May be missing in some cases

        # Remove unnecessary fields
        data.pop('Sleep_Quality', None)
        data.pop('user_id', None)

        # Convert to DataFrame
        df = pd.DataFrame([data])

        # Preprocess the data
        processed_data = initial_preprocess(df)

        # Make prediction
        prediction = ml_model.predict(processed_data)[0]

        # Analyze patterns and generate insights
        insights = analyze_sleep_patterns(data)

        # Generate recommendations
        recommendations = generate_recommendations(data, prediction, insights)

        # Save record only if user_id exists
        record_id = None
        if user_id:
            record_data = {
                'prediction': float(prediction),
                'insights': insights,
                'recommendations': recommendations,
                'input_data': data
            }
            record_id = save_sleep_record(user_id, record_data)

        response = {
            'prediction': float(prediction),
            'message': 'Prediction successful',
            'insights': insights,
            'recommendations': recommendations,
            'using_fallback': not GEMINI_AVAILABLE,
            'record_id': record_id if user_id else "Not saved"
        }

        return jsonify(response)

    except KeyError as e:
        return jsonify({'error': f'Missing required feature: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'error': f'Error processing request: {str(e)}'}), 500


@app.route('/history/<user_id>', methods=['GET'])
def get_history(user_id):
    """Get user's sleep history"""
    try:
        records = get_user_sleep_records(user_id)
        return jsonify({'records': records})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)