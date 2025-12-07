"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { findQuizById } from "../../../../client";

export default function QuizPreview() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.cid as string;
  const quizId = params.qid as string;

  const [quiz, setQuiz] = useState<any>(null);
  const [answers, setAnswers] = useState<any>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [gradedAnswers, setGradedAnswers] = useState<any>({});

  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  const loadQuiz = async () => {
    try {
      const data = await findQuizById(quizId);
      setQuiz(data);
    } catch (error) {
      console.error("Error loading quiz:", error);
    }
  };

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = () => {
    if (!quiz) return;

    let totalScore = 0;
    const graded: any = {};

    quiz.questions.forEach((question: any) => {
      const userAnswer = answers[question._id];
      let isCorrect = false;

      if (question.type === "multiple-choice") {
        const correctChoice = question.choices.find((c: any) => c.isCorrect);
        isCorrect = userAnswer === correctChoice?.text;
      } else if (question.type === "true-false") {
        isCorrect = userAnswer === question.correctAnswer;
      } else if (question.type === "fill-in-blank") {
        const normalizedAnswer = userAnswer?.toLowerCase().trim();
        isCorrect = question.possibleAnswers?.some(
          (a: string) => a.toLowerCase().trim() === normalizedAnswer
        );
      }

      if (isCorrect) {
        totalScore += question.points;
      }

      graded[question._id] = { isCorrect, userAnswer };
    });

    setScore(totalScore);
    setGradedAnswers(graded);
    setShowResults(true);
  };

  const resetQuiz = () => {
    setAnswers({});
    setShowResults(false);
    setScore(0);
    setGradedAnswers({});
  };

  if (!quiz) return <div className="p-4">Loading...</div>;

  return (
    <div id="wd-quiz-preview" className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{quiz.title} - Preview</h2>
        <button
          className="btn btn-secondary"
          onClick={() => router.push(`/Courses/${courseId}/Quizzes/${quizId}/Editor`)}
        >
          Edit Quiz
        </button>
      </div>

      {!showResults ? (
        <>
          <div className="alert alert-info">
            <strong>Preview Mode:</strong> This is how students will see the quiz. Your answers won&apos;t be saved.
          </div>

          {quiz.questions.map((question: any, index: number) => (
            <div key={question._id} className="card mb-4">
              <div className="card-body">
                <h5>
                  Question {index + 1} ({question.points} pts)
                </h5>
                <p className="mb-3">{question.question}</p>

                {/* Multiple Choice */}
                {question.type === "multiple-choice" && (
                  <div>
                    {question.choices.map((choice: any, idx: number) => (
                      <div key={idx} className="form-check mb-2">
                        <input
                          type="radio"
                          id={`q${question._id}-choice${idx}`}
                          name={`question-${question._id}`}
                          className="form-check-input"
                          value={choice.text}
                          checked={answers[question._id] === choice.text}
                          onChange={(e) =>
                            handleAnswerChange(question._id, e.target.value)
                          }
                        />
                        <label
                          htmlFor={`q${question._id}-choice${idx}`}
                          className="form-check-label"
                        >
                          {choice.text}
                        </label>
                      </div>
                    ))}
                  </div>
                )}

                {/* True/False */}
                {question.type === "true-false" && (
                  <div>
                    <div className="form-check mb-2">
                      <input
                        type="radio"
                        id={`q${question._id}-true`}
                        name={`question-${question._id}`}
                        className="form-check-input"
                        value="true"
                        checked={answers[question._id] === "true"}
                        onChange={(e) =>
                          handleAnswerChange(question._id, e.target.value)
                        }
                      />
                      <label
                        htmlFor={`q${question._id}-true`}
                        className="form-check-label"
                      >
                        True
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        id={`q${question._id}-false`}
                        name={`question-${question._id}`}
                        className="form-check-input"
                        value="false"
                        checked={answers[question._id] === "false"}
                        onChange={(e) =>
                          handleAnswerChange(question._id, e.target.value)
                        }
                      />
                      <label
                        htmlFor={`q${question._id}-false`}
                        className="form-check-label"
                      >
                        False
                      </label>
                    </div>
                  </div>
                )}

                {/* Fill in the Blank */}
                {question.type === "fill-in-blank" && (
                  <input
                    type="text"
                    className="form-control"
                    value={answers[question._id] || ""}
                    onChange={(e) =>
                      handleAnswerChange(question._id, e.target.value)
                    }
                    placeholder="Your answer"
                  />
                )}
              </div>
            </div>
          ))}

          <button className="btn btn-primary" onClick={handleSubmit}>
            Submit Quiz
          </button>
        </>
      ) : (
        <>
          {/* Results */}
          <div className="alert alert-success">
            <h4>Quiz Submitted!</h4>
            <p className="mb-0">
              Your Score: <strong>{score}/{quiz.points}</strong> (
              {((score / quiz.points) * 100).toFixed(1)}%)
            </p>
          </div>

          {quiz.questions.map((question: any, index: number) => {
            const result = gradedAnswers[question._id];
            const isCorrect = result?.isCorrect;

            return (
              <div
                key={question._id}
                className={`card mb-4 border-${isCorrect ? "success" : "danger"}`}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <h5>
                      Question {index + 1} ({question.points} pts)
                    </h5>
                    <span
                      className={`badge bg-${isCorrect ? "success" : "danger"}`}
                    >
                      {isCorrect ? "✓ Correct" : "✗ Incorrect"}
                    </span>
                  </div>
                  <p className="mb-3">{question.question}</p>

                  <div className="mb-2">
                    <strong>Your Answer:</strong>{" "}
                    <span className={isCorrect ? "text-success" : "text-danger"}>
                      {result.userAnswer || "(No answer)"}
                    </span>
                  </div>

                  {!isCorrect && (
                    <div className="alert alert-info mb-0">
                      <strong>Correct Answer:</strong>{" "}
                      {question.type === "multiple-choice" &&
                        question.choices.find((c: any) => c.isCorrect)?.text}
                      {question.type === "true-false" && question.correctAnswer}
                      {question.type === "fill-in-blank" &&
                        question.possibleAnswers.join(", ")}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <div className="d-flex gap-2">
            <button className="btn btn-primary" onClick={resetQuiz}>
              Take Again
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => router.push(`/Courses/${courseId}/Quizzes/${quizId}/Editor`)}
            >
              Edit Quiz
            </button>
          </div>
        </>
      )}
    </div>
  );
}