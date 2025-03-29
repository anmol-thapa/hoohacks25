"""
Importing necessary packages
"""
from sklearn import model_selection
import preprocessing
from modeling import train_and_evaluate_models

def main():
    # Load and preprocess the data
    file_path = 'datasets/student_sleep_patterns.csv'
    sleep_data = preprocessing.load_data(file_path)
    sleep_data = preprocessing.initial_preprocess(sleep_data)
    
    # Define features for the model
    base_features = [
        'Weekday_Sleep_Start', 'Weekend_Sleep_Start',
        'Weekday_Sleep_End', 'Weekend_Sleep_End',
        'Screen_Time', 'Physical_Activity', 'Caffeine_Intake'
    ]
    
    derived_features = [
        'Weekday_Sleep_Duration', 'Weekend_Sleep_Duration',
        'Avg_Sleep_Duration', 'Sleep_Start_Difference', 'Sleep_End_Difference',
        'Sleep_Duration_Difference', 'Sleep_Regularity', 'Sleep_Deprivation',
        'Late_Night_Sleep', 'Consistent_Pattern', 'Screen_Time_Impact',
        'Activity_Sleep_Ratio'
    ]
    
    features = base_features + derived_features
    
    # Prepare data for modeling
    X = sleep_data[features]
    y = sleep_data['Sleep_Quality']
    
    # Split the data
    X_train, X_test, y_train, y_test = model_selection.train_test_split(
        X, y, test_size=0.2, random_state=1
    )
    
    # Train models and get results
    results = train_and_evaluate_models(
        X_train, X_test, y_train, y_test, features
    )
    
    # Print results
    print("\nModel Performance:")
    print(f"{results['best_model']}: RMSE = {results['rmse']:.4f}")

if __name__ == "__main__":
    main() 