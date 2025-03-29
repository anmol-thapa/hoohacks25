from flask import Flask, render_template, request, jsonify
from decision_tree import questions, get_diagnosis

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    step = data.get("step")
    answers = data.get("answers", [])

    if step == "q1":
        return jsonify(questions["q1"])
    elif step == "q2":
        return jsonify(questions["q2"])
    elif step == "q3":
        return jsonify(questions["q3"])
    elif step == "result":
        diagnosis = get_diagnosis(answers)
        return jsonify({"text": diagnosis, "options": {}})
    else:
        return jsonify({"text": "Something went wrong.", "options": {}})

if __name__ == '__main__':
    app.run(debug=True)