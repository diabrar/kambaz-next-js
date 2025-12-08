"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { findQuizById } from "../../../../client"; //
import { FaExclamationCircle, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

// Faculty preview page 
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  const loadQuiz = async () => {
    try {
      const data = await findQuizById(quizId); //
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
    setCurrentQuestionIndex(0); 
  };

  if (!quiz) return <div className="p-4">Loading...</div>;

  const question = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  const result = showResults ? gradedAnswers[question._id] : null;
  const isCorrect = result?.isCorrect;

  return (
    <div id="wd-quiz-preview" className="p-4 container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{quiz.title} - Preview</h2>
        {showResults && (
           <div className="alert alert-success d-inline-block mb-0 py-1">
             Score: <strong>{score}/{quiz.points}</strong>
           </div>
        )}
        <button
          className="btn btn-secondary"
          onClick={() => router.push(`/Courses/${courseId}/Quizzes/${quizId}/Editor`)} //
        >
          Edit Quiz
        </button>
      </div>

      {!showResults && (
        <div className="alert alert-info">
          <FaExclamationCircle className="me-2" />
          This is a preview of the published version of the quiz
        </div>
      )}

      <div className="row">
        <div className="col-md-9">
            <div className={`card mb-3 ${showResults ? (isCorrect ? "border-success" : "border-danger") : ""}`}>
              <div className="card-header d-flex justify-content-between bg-light">
                <span className="fw-bold">Question {currentQuestionIndex + 1}</span>
                <span className="text-muted">{question.points} pts</span>
              </div>
              
              <div className="card-body">
                {showResults && (
                  <div className={`badge bg-${isCorrect ? "success" : "danger"} mb-3`}>
                     {isCorrect ? <><FaCheckCircle/> Correct</> : <><FaTimesCircle/> Incorrect</>}
                  </div>
                )}

                <div className="mb-4" dangerouslySetInnerHTML={{ __html: question.question }} /> 
                {!question.question && <p className="mb-4">{question.question || "No question text"}</p>}
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
                          onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                          disabled={showResults}
                        />
                        <label htmlFor={`q${question._id}-choice${idx}`} className="form-check-label">
                          {choice.text}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
                {question.type === "true-false" && (
                  <div>
                    {["true", "false"].map((val) => (
                      <div key={val} className="form-check mb-2">
                        <input
                          type="radio"
                          id={`q${question._id}-${val}`}
                          name={`question-${question._id}`}
                          className="form-check-input"
                          value={val}
                          checked={answers[question._id] === val}
                          onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                          disabled={showResults}
                        />
                        <label htmlFor={`q${question._id}-${val}`} className="form-check-label text-capitalize">
                          {val}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
                {question.type === "fill-in-blank" && (
                  <input
                    type="text"
                    className="form-control"
                    value={answers[question._id] || ""}
                    onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                    placeholder="Your answer"
                    disabled={showResults}
                  />
                )}
                {showResults && !isCorrect && (
                   <div className="alert alert-danger mt-3">
                      <strong>Correct Answer: </strong>
                      {question.type === "multiple-choice" && question.choices.find((c: any) => c.isCorrect)?.text}
                      {question.type === "true-false" && question.correctAnswer}
                      {question.type === "fill-in-blank" && question.possibleAnswers.join(", ")}
                   </div>
                )}
              </div>
            </div>
            <div className="d-flex justify-content-between mt-4">
              <button 
                className="btn btn-secondary" 
                onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                disabled={isFirstQuestion}
              >
                Previous
              </button>

              {isLastQuestion ? (
                !showResults ? (
                  <button className="btn btn-primary" onClick={handleSubmit}>
                    Submit Quiz
                  </button>
                ) : (
                   <div className="text-muted">Quiz Submitted</div>
                )
              ) : (
                <button 
                  className="btn btn-secondary"
                  onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                >
                  Next
                </button>
              )}
            </div>
        </div>

        <div className="col-md-3">
          <div className="card">
            <div className="card-header">Questions</div>
            <div className="card-body">
              <div className="d-flex flex-wrap gap-2">
                {quiz.questions.map((q: any, index: number) => {
                  let btnClass = "btn-outline-secondary";
                  if (currentQuestionIndex === index) btnClass = "btn-primary"; 
                  else if (showResults) {
                     const isQCorrect = gradedAnswers[q._id]?.isCorrect;
                     btnClass = isQCorrect ? "btn-outline-success" : "btn-outline-danger";
                  } else if (answers[q._id]) {
                     btnClass = "btn-outline-info"; 
                  }

                  return (
                    <button
                      key={q._id}
                      className={`btn ${btnClass} sm-2`}
                      style={{ width: "40px", height: "40px" }}
                      onClick={() => setCurrentQuestionIndex(index)}
                    >
                      {showResults && currentQuestionIndex !== index ? (
                         gradedAnswers[q._id]?.isCorrect ? "✓" : "✗"
                      ) : (
                         index + 1
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}