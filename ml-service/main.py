from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
from typing import List, Dict, Any, Optional
import joblib
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# Download NLTK resources
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')

app = FastAPI(title="Mental Health Sentiment Analysis API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize lemmatizer and stopwords
lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))

# Mock models - in a real application, you would load trained models
# For example: model_nb = joblib.load('models/naive_bayes_model.pkl')
# For this demo, we'll simulate model predictions

class TextInput(BaseModel):
    text: str

class SurveyInput(BaseModel):
    survey_type: str
    answers: Dict[str, int]

def preprocess_text(text):
    """Preprocess text for analysis"""
    # Convert to lowercase
    text = text.lower()
    # Remove special characters and numbers
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    # Tokenize
    tokens = nltk.word_tokenize(text)
    # Remove stopwords and lemmatize
    processed_tokens = [lemmatizer.lemmatize(token) for token in tokens if token not in stop_words]
    return ' '.join(processed_tokens)

def mock_naive_bayes_prediction(text):
    """Simulate Naive Bayes prediction"""
    # Simple keyword-based approach for demo
    text = text.lower()
    
    anxiety_keywords = ['anxious', 'worry', 'nervous', 'fear', 'panic']
    depression_keywords = ['sad', 'depress', 'hopeless', 'empty', 'tired']
    stress_keywords = ['stress', 'overwhelm', 'pressure', 'burden']
    positive_keywords = ['happy', 'joy', 'good', 'great', 'excellent']
    
    anxiety_score = sum(1 for word in anxiety_keywords if word in text)
    depression_score = sum(1 for word in depression_keywords if word in text)
    stress_score = sum(1 for word in stress_keywords if word in text)
    positive_score = sum(1 for word in positive_keywords if word in text)
    
    scores = {
        'anxiety': min(anxiety_score * 25, 100),
        'depression': min(depression_score * 25, 100),
        'stress': min(stress_score * 25, 100),
        'positive': min(positive_score * 25, 100)
    }
    
    # Add some randomness
    for key in scores:
        scores[key] = max(0, min(100, scores[key] + np.random.randint(-15, 15)))
    
    return scores

def mock_svm_prediction(text):
    """Simulate SVM prediction"""
    # For demo, return slightly different values from Naive Bayes
    nb_scores = mock_naive_bayes_prediction(text)
    svm_scores = {k: max(0, min(100, v + np.random.randint(-10, 10))) for k, v in nb_scores.items()}
    return svm_scores

def mock_bert_prediction(text):
    """Simulate BERT prediction"""
    # For demo, return slightly different values
    nb_scores = mock_naive_bayes_prediction(text)
    bert_scores = {k: max(0, min(100, v + np.random.randint(-5, 5))) for k, v in nb_scores.items()}
    return bert_scores

def get_ensemble_prediction(text):
    """Combine predictions from multiple models"""
    preprocessed_text = preprocess_text(text)
    
    # Get predictions from different models
    nb_scores = mock_naive_bayes_prediction(preprocessed_text)
    svm_scores = mock_svm_prediction(preprocessed_text)
    bert_scores = mock_bert_prediction(preprocessed_text)
    
    # Ensemble the predictions (simple averaging for demo)
    ensemble_scores = {}
    for emotion in nb_scores:
        ensemble_scores[emotion] = (nb_scores[emotion] + svm_scores[emotion] + bert_scores[emotion]) / 3
    
    # Determine main emotion
    main_emotion = max(ensemble_scores, key=ensemble_scores.get)
    main_score = ensemble_scores[main_emotion]
    
    # Format the response
    formatted_scores = [
        {"emotion": "Anxiety", "score": round(ensemble_scores['anxiety']), "color": "text-yellow-500"},
        {"emotion": "Depression", "score": round(ensemble_scores['depression']), "color": "text-blue-500"},
        {"emotion": "Stress", "score": round(ensemble_scores['stress']), "color": "text-red-500"},
        {"emotion": "Positive", "score": round(ensemble_scores['positive']), "color": "text-green-500"}
    ]
    
    # Generate description based on main emotion and score
    description = ""
    if main_emotion == 'anxiety' and main_score > 50:
        severity = "Moderate" if main_score > 70 else "Mild"
        description = f"Your text indicates signs of {severity.lower()} anxiety. Consider using relaxation techniques."
    elif main_emotion == 'depression' and main_score > 50:
        severity = "Moderate" if main_score > 70 else "Mild"
        description = f"Your text shows indicators of {severity.lower()} depression. Regular exercise and social connection may help."
    elif main_emotion == 'stress' and main_score > 50:
        severity = "High" if main_score > 70 else "Moderate"
        description = f"Your text suggests you're experiencing {severity.lower()} stress. Consider stress management techniques."
    elif main_emotion == 'positive' and main_score > 60:
        description = "Your text shows a positive emotional state. Keep up the good work!"
    else:
        main_emotion = "Neutral"
        description = "Your text doesn't show significant emotional distress."
    
    # Format main emotion for display
    display_emotion = main_emotion.capitalize()
    if main_emotion != "positive" and main_emotion != "neutral":
        severity = "Moderate" if main_score > 70 else "Mild"
        display_emotion = f"{severity} {display_emotion}"
    elif main_emotion == "positive":
        display_emotion = "Positive Outlook"
    
    return {
        "mainEmotion": display_emotion,
        "description": description,
        "scores": formatted_scores,
        "raw_scores": ensemble_scores
    }

def interpret_phq9_score(score):
    """Interpret PHQ-9 depression screening score"""
    if 0 <= score <= 4:
        return {"score": score, "severity": "Minimal depression", "color": "text-green-500"}
    elif 5 <= score <= 9:
        return {"score": score, "severity": "Mild depression", "color": "text-yellow-500"}
    elif 10 <= score <= 14:
        return {"score": score, "severity": "Moderate depression", "color": "text-orange-500"}
    elif 15 <= score <= 19:
        return {"score": score, "severity": "Moderately severe depression", "color": "text-red-500"}
    else:
        return {"score": score, "severity": "Severe depression", "color": "text-red-700"}

def interpret_gad7_score(score):
    """Interpret GAD-7 anxiety screening score"""
    if 0 <= score <= 4:
        return {"score": score, "severity": "Minimal anxiety", "color": "text-green-500"}
    elif 5 <= score <= 9:
        return {"score": score, "severity": "Mild anxiety", "color": "text-yellow-500"}
    elif 10 <= score <= 14:
        return {"score": score, "severity": "Moderate anxiety", "color": "text-orange-500"}
    else:
        return {"score": score, "severity": "Severe anxiety", "color": "text-red-500"}

@app.get("/")
def read_root():
    return {"message": "Mental Health Sentiment Analysis API"}

@app.post("/analyze-text")
def analyze_text(input_data: TextInput):
    """Analyze text for mental health sentiment"""
    if not input_data.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    result = get_ensemble_prediction(input_data.text)
    return result

@app.post("/process-survey")
def process_survey(input_data: SurveyInput):
    """Process and score mental health surveys"""
    if not input_data.survey_type or not input_data.answers:
        raise HTTPException(status_code=400, detail="Survey type and answers are required")
    
    # Calculate total score
    total_score = sum(input_data.answers.values())
    
    # Interpret score based on survey type
    if input_data.survey_type == "phq9":
        return interpret_phq9_score(total_score)
    elif input_data.survey_type == "gad7":
        return interpret_gad7_score(total_score)
    else:
        raise HTTPException(status_code=400, detail="Invalid survey type")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
