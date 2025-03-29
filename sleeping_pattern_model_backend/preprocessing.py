"""
Importing necessary packages
"""
import pandas as pd
import numpy as np
from scipy.stats import zscore
import os

def load_data(file_path):
    # Load sleep pattern data from a CSV file.
    try:
        sleep_data = pd.read_csv(file_path, index_col=0, header=0)
        return sleep_data
    except FileNotFoundError as exc:
        print("The file path does not exist.")
        raise exc
    except pd.errors.EmptyDataError:
        print("No data found in the CSV file.")
        raise
    except pd.errors.ParserError:
        print("Error parsing the CSV file.")
        raise

def remove_invalid_values(df):
    # Remove rows where sleep duration or other time-based features are zero or negative
    time_columns = ['Weekday_Sleep_Duration', 'Weekend_Sleep_Duration']
    
    # First calculate sleep durations if they don't exist
    if 'Weekday_Sleep_Duration' not in df.columns:
        df['Weekday_Sleep_Duration'] = df['Weekday_Sleep_End'] - df['Weekday_Sleep_Start']
        df['Weekend_Sleep_Duration'] = df['Weekend_Sleep_End'] - df['Weekend_Sleep_Start']
        
        # Adjust for any negative values (e.g., if sleep starts late at night and ends after midnight)
        df['Weekday_Sleep_Duration'] = df['Weekday_Sleep_Duration'].apply(lambda x: x + 24 if x < 0 else x)
        df['Weekend_Sleep_Duration'] = df['Weekend_Sleep_Duration'].apply(lambda x: x + 24 if x < 0 else x)

    df = df[~df[time_columns].apply(lambda x: (x <= 0).any(), axis=1)]
    return df

def drop_duplicates(df):
    # Drop duplicate rows from the DataFrame.
    df = df.drop_duplicates()
    return df

def create_derived_features(df):
    # Create derived features that capture sleep patterns and habits.

    # Average sleep duration across weekdays and weekends
    df['Avg_Sleep_Duration'] = (df['Weekday_Sleep_Duration'] + df['Weekend_Sleep_Duration']) / 2
    
    # Sleep schedule consistency (difference between weekday and weekend sleep times)
    df['Sleep_Start_Difference'] = df['Weekend_Sleep_Start'] - df['Weekday_Sleep_Start']
    df['Sleep_End_Difference'] = df['Weekend_Sleep_End'] - df['Weekday_Sleep_End']
    
    # Sleep duration difference between weekdays and weekends
    df['Sleep_Duration_Difference'] = df['Weekend_Sleep_Duration'] - df['Weekday_Sleep_Duration']
    
    # Sleep regularity score (lower is better)
    df['Sleep_Regularity'] = abs(df['Sleep_Start_Difference']) + abs(df['Sleep_End_Difference'])
    
    # Sleep deprivation indicator (1 if weekday sleep is significantly less than weekend)
    df['Sleep_Deprivation'] = (df['Sleep_Duration_Difference'] > 3).astype(int)
    
    # Late night sleep indicator (1 if sleep starts after midnight)
    df['Late_Night_Sleep'] = ((df['Weekday_Sleep_Start'] > 0) | (df['Weekend_Sleep_Start'] > 0)).astype(int)
    
    # Sleep pattern consistency (1 if weekday and weekend patterns are similar)
    df['Consistent_Pattern'] = (df['Sleep_Regularity'] < 3).astype(int)
    
    # Screen time impact (higher values indicate more screen time before sleep)
    df['Screen_Time_Impact'] = df['Screen_Time'] * df['Late_Night_Sleep']
    
    # Physical activity balance (ratio of activity to sleep duration)
    df['Activity_Sleep_Ratio'] = df['Physical_Activity'] / df['Avg_Sleep_Duration']
    
    return df

def remove_outliers(df):
    # Remove outliers based on Z-scores for numerical features.
    columns_to_check = [
        'Weekday_Sleep_Duration', 'Weekend_Sleep_Duration',
        'Avg_Sleep_Duration', 'Screen_Time', 'Physical_Activity',
        'Caffeine_Intake', 'Activity_Sleep_Ratio'
    ]
    z_scores = np.abs(zscore(df[columns_to_check]))
    outlier_mask = (z_scores > 3).sum(axis=1) <= 2
    df = df[outlier_mask]
    
    return df

def initial_preprocess(df):
    # Apply initial preprocessing steps to the DataFrame.
    df = remove_invalid_values(df)
    df = drop_duplicates(df)
    df = create_derived_features(df)
    df = remove_outliers(df)
    df.to_csv('datasets/filtered_dataset.csv')
    
    return df
