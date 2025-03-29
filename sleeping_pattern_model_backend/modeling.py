"""
Importing necessary packages
"""
import time
import joblib
import numpy as np
from sklearn import metrics
from sklearn.model_selection import RandomizedSearchCV
import xgboost as xgb
import matplotlib.pyplot as plt
from scipy.stats import uniform, randint

def plot_sleep_patterns(y_test, y_pred, model_name):
    # Plot actual vs predicted sleep quality patterns.
    plt.figure(figsize=(10, 6))
    
    # Plot actual vs predicted sleep quality
    plt.scatter(y_test, y_pred, alpha=0.5)
    plt.plot([min(y_test), max(y_test)], [min(y_test), max(y_test)], 'r--')
    plt.xlabel('Actual Sleep Quality')
    plt.ylabel('Predicted Sleep Quality')
    plt.title(f'Sleep Quality Predictions for {model_name}')

    plt.tight_layout()
    plt.savefig('misc/sleep_quality_predictions.png')
    plt.close()

def train_xgboost(x_train, y_train):
    # Train an XGBoost model using RandomizedSearchCV to optimize hyperparameters.
    param_grid = {
        # Tree-specific parameters
        'n_estimators': randint(100, 1000),  # More trees
        'max_depth': randint(3, 12),         # Deeper trees
        'min_child_weight': randint(1, 7),
        'gamma': uniform(0, 0.5),
        
        # Learning rate and regularization
        'learning_rate': uniform(0.01, 0.3),  # Wider range
        'subsample': uniform(0.6, 0.4),       # Sample ratio per tree
        'colsample_bytree': uniform(0.6, 0.4),# Column ratio per tree
        'colsample_bylevel': uniform(0.6, 0.4),# Column ratio per level
        'colsample_bynode': uniform(0.6, 0.4), # Column ratio per split
        
        # Regularization parameters
        'reg_alpha': uniform(0, 2),           # L1 regularization
        'reg_lambda': uniform(0, 2),          # L2 regularization
        
        # Tree building parameters
        'max_leaves': randint(0, 8),          # Maximum number of leaves
        'max_bin': randint(256, 512),         # Maximum number of distinct values
        'grow_policy': ['depthwise', 'lossguide'],
        
        # Dart specific
        'booster': ['gbtree', 'dart'],        # Try both boosters
        'sample_type': ['uniform', 'weighted'],
        'normalize_type': ['tree', 'forest'],
        'rate_drop': uniform(0, 0.5),
        'skip_drop': uniform(0, 0.5)
    }

    model = xgb.XGBRegressor(
        random_state=1,
        verbosity=0,
        n_jobs=-1,  # Use all CPU cores
        tree_method='hist',  # Faster histogram-based algorithm
        objective='reg:squarederror'
    )

    search = RandomizedSearchCV(
        estimator=model,
        param_distributions=param_grid,
        n_iter=500,  # More iterations
        cv=10,       # More folds
        scoring=['neg_mean_squared_error', 'neg_mean_absolute_error', 'r2'],
        refit='neg_mean_squared_error',
        n_jobs=-1,
        random_state=1,
        verbose=2
    )

    return search.fit(x_train, y_train)

def train_and_evaluate_models(x_train, x_test, y_train, y_test, feature_names):
    # Train and evaluate XGBoost model and save the model.
    print("Training XGBoost...")
    start_time = time.time()

    search = train_xgboost(x_train, y_train)
    best_model = search.best_estimator_

    # Print best parameters
    print("\nBest parameters found:")
    for param, value in search.best_params_.items():
        print(f"{param}: {value}")

    # Print cross-validation results
    print("\nCross-validation results:")
    means = search.cv_results_['mean_test_neg_mean_squared_error']
    stds = search.cv_results_['std_test_neg_mean_squared_error']
    print(f"Mean RMSE: {np.sqrt(-means.mean()):.4f} (+/- {np.sqrt(stds.mean()):.4f})")

    # Save the model
    joblib.dump(best_model, 'models/XGBoost_model.pkl', compress=3)

    # Make predictions
    y_pred = best_model.predict(x_test)
    
    # Calculate various metrics
    rmse = np.sqrt(metrics.mean_squared_error(y_test, y_pred))
    mae = metrics.mean_absolute_error(y_test, y_pred)
    r2 = metrics.r2_score(y_test, y_pred)

    # Plot results
    plot_sleep_patterns(y_test, y_pred, 'XGBoost')

    # Save metrics to a text file
    with open('misc/model_metrics.txt', 'w', encoding='utf-8') as file:
        file.write(f'RMSE: {rmse:.4f}\n')
        file.write(f'MAE: {mae:.4f}\n')
        file.write(f'R2 Score: {r2:.4f}\n')
        file.write('\nFeature Importances:\n')
        importances = dict(zip(feature_names, best_model.feature_importances_))
        for feat, imp in sorted(importances.items(), key=lambda x: x[1], reverse=True):
            file.write(f'{feat}: {imp:.4f}\n')

    elapsed_time = time.time() - start_time
    print(f'\nTraining time: {elapsed_time:.2f} seconds')
    print(f'RMSE: {rmse:.4f}')
    print(f'MAE: {mae:.4f}')
    print(f'R2 Score: {r2:.4f}')

    return {
        'best_model': 'XGBoost',
        'rmse': rmse
    } 