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

RFclf = RandomForestClassifier(n_estimators=50, max_depth=10, random_state=42)
RFclf.fit(X_train, y_train)

symptoms = np.array(x.columns)

def predict(user_input):
    input_symptoms = [1 if sym in user_input else 0 for sym in symptoms]
    prediction = RFclf.predict([input_symptoms])[0]
    probability = np.max(RFclf.predict_proba([input_symptoms]))
    return {
        "disease": prediction,
        "probability": float(probability)
    }

if __name__ == "__main__":
    if len(sys.argv) > 1:
        user_symptoms = sys.argv[1].split(',')
        result = predict(user_symptoms)
        print(json.dumps(result), flush=True)  # ✅ FLUSH + RESULT IS DEFINED
