import sys
import json
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import warnings

warnings.filterwarnings("ignore", category=UserWarning)

# Load data and train model
df = pd.read_csv("new-Training.csv")
x = df.drop(['prognosis'], axis=1)
y = df['prognosis']
X_train, X_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=42)

RFclf = RandomForestClassifier(n_estimators=100, max_depth=None, random_state=42)
RFclf.fit(X_train, y_train)

# Symptom columns from dataset
symptoms = np.array(x.columns)

# Define symptom aliases to map user inputs to column names
symptom_aliases = {
    "cough": "Cough",
    "fever": "Fever",
    "nausea": "Nausea",
    "vomiting": "Vomiting",
    "headache": "Headache",
    "fatigue": "Fatigue",
    "coughing": "Cough",  # Handle variations
    "temperature": "Fever",
    "sore throat": "Sore_Throat",  # Example: Adjust based on your column names
    # Add more mappings as needed based on new-Training.csv columns
}

def predict(user_input):
    # Normalize user input: lowercase, strip spaces
    user_input = [sym.lower().strip() for sym in user_input]
    
    # Map user inputs to dataset column names
    normalized_input = []
    unmatched_symptoms = []
    for sym in user_input:
        matched_sym = symptom_aliases.get(sym, sym)
        if matched_sym in symptoms:
            normalized_input.append(matched_sym)
        else:
            unmatched_symptoms.append(sym)
    
    # Debug: Log unmatched symptoms
    if unmatched_symptoms:
        print(f"Unmatched Symptoms: {unmatched_symptoms}", file=sys.stderr)
    
    # Create binary input vector
    input_symptoms = [1 if sym in normalized_input else 0 for sym in symptoms]
    print(f"Input Vector: {input_symptoms}", file=sys.stderr)
    
    # Check if any symptoms matched
    if not any(input_symptoms):
        return {
            "disease": "No matching symptoms",
            "probability": 0.0,
            "unmatched": unmatched_symptoms
        }
    
    # Predict disease
    prediction = RFclf.predict([input_symptoms])[0]
    probability = np.max(RFclf.predict_proba([input_symptoms]))
    
    return {
        "disease": prediction,
        "probability": float(probability),
        "unmatched": unmatched_symptoms
    }

if __name__ == "__main__":
    if len(sys.argv) > 1:
        user_symptoms = sys.argv[1].split(',')
        print(f"Received Symptoms: {user_symptoms}", file=sys.stderr)
        print(f"Expected Symptoms: {list(symptoms)}", file=sys.stderr)
        result = predict(user_symptoms)
        print(f"Prediction: {result}", file=sys.stderr)
        print(json.dumps(result), flush=True)
    else:
        print(json.dumps({"disease": "No symptoms provided", "probability": 0.0, "unmatched": []}), flush=True)