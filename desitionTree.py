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
    }
}

def get_diagnosis(answers):
    if answers == ["A", "A", "A"]:
        return "You may have severe sleep deprivation."
    elif answers[0] == "B" and answers[1] in ["A", "B"]:
        return "You may have mild sleep deprivation."
    elif answers[0] == "C" and answers[1] == "C":
        return "You seem to have healthy sleep habits."
    else:
        return "You could improve your sleep hygiene."
