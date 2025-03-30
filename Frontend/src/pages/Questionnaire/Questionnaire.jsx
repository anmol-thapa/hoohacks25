import { useAuth } from "../../auth/UserAuth";
import { Navigate } from "react-router";
import style from "./Questionnaire.module.css";
import { useState } from "react";

export default function Questionnaire() {
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswerClicked, setCurrentAnswerClicked] = useState(false);
  const [highestAnswered, setHighestAnswered] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);

  if (user.questionnaire) {
    return <Navigate to="/" />;
  }

  const handlePrev = () => {
    setCurrentQuestionIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (highestAnswered > currentQuestionIndex || currentAnswerClicked) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setCurrentAnswerClicked(false);
      if (currentQuestionIndex >= highestAnswered) {
        setHighestAnswered(currentQuestionIndex + 1);
      }
    }
  };

  const handleFinish = () => {
    user.questionnaire = answers;
    localStorage.setItem('user', JSON.stringify(user));
    setFinished(true);
  };

  if (finished) {
    return <Navigate to="/" />;
  }

  const handleAnswerSelect = (questionIndex, option) => {
    setAnswers({ ...answers, [questionIndex]: option });
    setCurrentAnswerClicked(true);
  };

  return (
    <div className={style.container}>
      <div className={style.questionCard}>
        <p className={style.questionText}>
          {questions[currentQuestionIndex].text}
        </p>

        <div className={style.options}>
          {questions[currentQuestionIndex].options.map((option, i) => (
            <div
              key={i}
              className={`${style.option} ${answers[currentQuestionIndex] === option ? style.selected : ""
                }`}
              onClick={() => handleAnswerSelect(currentQuestionIndex, option)}
            >
              {option}
            </div>
          ))}
        </div>

        <div className={style.buttons}>
          {currentQuestionIndex > 0 && (
            <button onClick={handlePrev} className={style.button}>
              Back
            </button>
          )}
          {currentQuestionIndex < questions.length - 1 ? (
            <button onClick={handleNext} className={style.button} disabled={!currentAnswerClicked}>
              Next
            </button>
          ) : (
            <button onClick={handleFinish} className={style.finishButton} disabled={!currentAnswerClicked}>
              Finish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const questions = [
  {
    text: "How many hours do you usually sleep on weekdays?",
    options: ["Less than 5", "Between 5-7", "More than 7"],
  },
  {
    text: "Do you wake up feeling rested?",
    options: ["Rarely", "Sometimes", "Often"],
  },
  {
    text: "Do you have trouble falling asleep?",
    options: ["Yes", "No"],
  },
];
