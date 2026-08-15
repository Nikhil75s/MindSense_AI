# 🧠 MINDSENSE AI - Mental Health Sentiment Analysis System

![MindSense AI](https://github.com/user-attachments/assets/170478ec-65ba-4495-adc9-05cede500f8d)


## 📍 Live Demo
👉 **[Access the website here](https://v0-mental-health-website-lac.vercel.app/)**

---

## 📌 Overview

The **Mental Health Sentiment Analysis System** is an AI-powered web application designed to detect emotional and psychological states such as **depression**, **anxiety**, and **stress** from user-generated text using cutting-edge NLP techniques. It aims to bridge the gap between digital expression and mental wellness by providing early sentiment assessment, multilingual support, and clinical survey recommendations.

---

## 💡 Features

- 🎯 **Real-Time Sentiment & Emotion Detection**  
  Using advanced models like BERT, GPT, and SVM.

- 🧪 **Clinically Validated Survey Integration**  
  - PHQ-9 (Depression)
  - GAD-7 (Anxiety)

- 🌐 **Multilingual Input Support**  
  Analyze mental health sentiment across different languages.

- 📊 **Emotional Trend Visualization**  
  Interactive dashboards for emotion tracking and analysis.

- 🛡️ **Secure & Scalable Architecture**  
  Cloud-based, end-to-end encrypted, HIPAA & GDPR compliant.

- 🧠 **Advanced NLP Features**  
  Named Entity Recognition, sarcasm detection (planned), and emotion classification beyond just positive/negative/neutral.

---

## 🏗️ Tech Stack

| Layer       | Tools/Frameworks                                |
|-------------|--------------------------------------------------|
| Frontend    | React.js, Tailwind CSS                          |
| Backend     | Node.js (Express), MongoDB, JWT Auth            |
| NLP Engine  | HuggingFace Transformers, BERT, RoBERTa, spaCy  |
| Deployment  | Vercel, Firebase (for auth/logs), Render/AWS    |
| Visualization | Chart.js, D3.js                              |

---

## 📂 Project Structure

This project uses a monorepo structure:
- `frontend/`: Contains the Next.js full-stack application (React, Tailwind CSS, App Router, database models, and API endpoints).
- *(Additional microservices or backend services will be organized at the root level as the project scales).*

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **pnpm**
- **MongoDB** (local or Atlas cluster)

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AT1310/Mindsense-AI-Mental-Health-Sentiment-Analysis.git
   cd Mindsense-AI-Mental-Health-Sentiment-Analysis
   ```

2. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Environment Variables:**
   Create a `.env` file in the `frontend/` directory with your specific credentials (e.g., `MONGODB_URI`, `JWT_SECRET`).

5. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔍 How It Works

1. **Input Options**:
   - Type/Paste Text
   - Upload File (.txt or .pdf)
   - Submit URL for article/blog content

2. **NLP Processing Pipeline**:
   - Text Cleaning → Tokenization → Model Inference (Sentiment/Emotion Detection)

3. **Clinical Suggestion Engine**:
   - Based on results, the user may be prompted to take PHQ-9 or GAD-7 surveys.

4. **Dashboard Output**:
   - Results shown in charts, emotion meters, sentence-level breakdowns.

---

## 📷 Screenshots

| Sign-In Page |
| ![Sign in](https://github.com/user-attachments/assets/b7542986-f627-4a6f-8cb5-bf583b6c9519)|


| Emotion Analysis |
| ![analysis](https://github.com/user-attachments/assets/f6d129b0-c37d-4f0b-a389-103722315551)|


| Survey Results |
| ![medical surveys](https://github.com/user-attachments/assets/e0e177f7-5d5e-42d4-9ae0-234738b832e6)|

---

## 👨‍⚕️ Target Users

- Individuals seeking mental wellness checks
- Psychologists & therapists
- Digital health platforms
- Academic & clinical researchers

---

## 🔒 Privacy & Security

- User data is encrypted and stored securely
- Role-based access control for therapists/admins
- Compliance with **HIPAA**, **GDPR**

---

## 🛠️ Future Enhancements

- 🗣️ Voice sentiment analysis
- 🎯 Aspect-based emotion classification
- 🤖 AI-based coping recommendations
- 📱 Mobile app with offline mode
- 🔄 Continuous learning from feedback

---

