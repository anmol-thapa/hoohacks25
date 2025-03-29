# decision_tree.py

questions = {
    "q1": {
        "text": "How many hours do you usually sleep on weekdays?",
        "options": {
            "A": "Less than 5",
            "B": "Between 5-7",
            "C": "More than 7"
        },
        "next": "q2"      
    },
    "q2": {
        "text": "Do you wake up feeling rested?",
        "options": {
            "A": "Rarely",
            "B": "Sometimes",
            "C": "Often"
        },
        "next": "q3"
    },
    "q3": {
        "text": "Do you have trouble falling asleep?",
        "options": {
            "A": "Yes",
            "B": "No"
        },
        "next": None
    },
    "q4": {
        "text": "Do you use electronic devices within an hour of sleeping?",
        "options": {
            "A": "Yes, often",
            "B": "Sometimes",
            "C": "Rarely or never"
        },
        "next": "q5"
    },
    "q5": {
        "text": "Do you maintain a consistent sleep schedule?",
        "options": {
            "A": "Not at all",
            "B": "Somewhat",
            "C": "Yes, regularly"
        },
        "next": None
    }
}

def get_diagnosis(answers):
    score = 0

    # q1 - amount of sleep
    if answers[0] == "A":
        score -= 2
    elif answers[0] == "B":
        score -= 1
    else:
        score += 1

    # q2 - feeling rested
    if answers[1] == "A":
        score -= 2
    elif answers[1] == "B":
        score -= 1
    else:
        score += 1

    # q3 - trouble sleeping
    if answers[2] == "A":
        score -= 1
    else:
        score += 1

    # q4 - phone before bed
    if answers[3] == "A":
        score -= 2
    elif answers[3] == "B":
        score -= 1
    else:
        score += 1

    # q5 - consistent sleep schedule
    if answers[4] == "A":
        score -= 2
    elif answers[4] == "B":
        score -= 1
    else:
        score += 1

    # return respective diagnosis
    if score <= -5:
        return "You may have severe sleep issues. Consider speaking to a professional and reviewing your sleep environment."
    elif -5 < score <= -2:
        return "You may be experiencing moderate sleep problems. Try improving your sleep."
    elif -2 < score < 3:
        return "Your sleep habits are average, but there's room for improvement."
    else:
        return "You have good sleep habits! Keep maintaining your routine and sleep environment."
