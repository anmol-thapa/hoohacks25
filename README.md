# HooHacks25 - Dormio

Dormio turns sleep into strategy — AI, flashcards, and habit coaching for the academically exhausted.

## Inspiration
As college students ourselves, we noticed that many students struggle with maintaining a healthy sleep routine due to academic pressure, late-night studying, and poor sleep habits. Dormio.tech was inspired by the idea of creating a personal sleep companion that could educate students, provide personalized insights, and encourage better sleep habits — all in a fun and interactive way.

## What it does
- User Login/Authentication: Allows each user to create a personalized experience by securely logging in and saving their sleep data, questionnaire answers, and progress across sessions.
- Questionnaire: A quick onboarding quiz that gathers information about the user’s sleep habits, routines, and challenges.
- Informational Cards: Interactive cards that teach users about sleep science, habits, and recovery tips in a fun, bite-sized format — designed to educate without overwhelming.
- Nap Schedule Optimizer: Analyzes the user’s calendar details to identify ideal nap times based on their free time, sleep debt, and daily rhythm — turning downtime into recharging time.
- Sleep Tracker Analysis - Provides users with a summary of their sleep behavior over time, surfaces key insights (like consistency or late-night usage), and offers tailored recommendations to improve sleep quality.

## How we built it
- User Login/Authentication: Custom-Made React, UAuth 
- Questionnaire: React, Decision Tree
- Informational Cards: React
- Nap Schedule Optimizer: React, OpenAI
- Sleep Tracker Analysis: Gemini, XGBoost

## Challenges we ran into
We faced several challenges during development. Integrating Gemini AI into our chatbot required fine-tuning both the prompt and the post-processing to make the responses feel more like a sleep-focused diagnosis. We also had to carefully limit the answer range to keep interactions natural and manageable.

Another challenge was designing a chatbot that remains educational without overwhelming the user. Additionally, integrating the frontend and backend smoothly under tight hackathon time constraints pushed us to prioritize clarity and speed in our architecture.

## Accomplishments that we're proud of
We built a fully functional website that helps students figure out if their sleep is on point (or a disaster), teaches them useful sleep facts through flashcards, and even helps them fall asleep with personalized music — all packed into one friendly assistant.

Additionally, we:
- Built a functional AI chatbot with a smooth conversational flow.
- Overcame formatting and response length issues to make the experience concise and enjoyable.
- Created a tool we would genuinely use ourselves!

## What we learned
- Prompt engineering is crucial when working with large language models.
- Designing for students means prioritizing simplicity and brevity.
- We learned how to integrate AI smoothly into the frontend while keeping it friendly for non-technical users.
- We also gained valuable experience in frontend-backend communication under real-world constraints.

## What's next for Dormio
Next, we plan to integrate sleep data input — both manual entry and wearable sync — and build a habit tracker that provides personalized, adaptive feedback over time. We’ll expand our educational flashcard library, develop a generative sleep music feature, and enhance our AI responses using richer datasets for more insightful coaching. Our goal is to launch beta testing on campus and scale Dormio.Tech into the go-to sleep companion for students everywhere.


## To Deploy:
