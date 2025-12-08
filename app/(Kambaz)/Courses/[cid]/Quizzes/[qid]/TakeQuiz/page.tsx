"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as client from "../../../../client";
import { FaInfoCircle } from "react-icons/fa";

export default function TakeQuiz() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.cid as string;
  const quizId = params.qid as string;

  const [quiz, setQuiz] = useState<any>(null);
  const [answers, setAnswers] = useState<any>({});
  
  // New state for navigation
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  const loadQuiz = async () => {
    try {
      const data = await client.findQuizById(quizId);
      setQuiz(data);
    } catch (error) {
      console.error("Error loading quiz:", error);
    }
  };

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = () => {
    // In a real app, you would send 'answers' to the backend here
    console.log("Submitting answers:", answers);
    alert("Quiz submitted!");
    router.push(`/Courses/${courseId}/Quizzes`);
  };

  if (!quiz) return <div className="p-4">Loading...</div>;

  const question = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  return (
    <div id="wd-take-quiz" className="p-4 container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{quiz.title}</h2>
      </div>

      <div className="alert alert-info mb-4">
         <FaInfoCircle className="me-2" />
         <strong>Time Limit:</strong> {quiz.timeLimit} minutes | 
         <strong> Total Points:</strong> {quiz.points}
      </div>

      <div className="row">
        {/* LEFT COLUMN: Question Area */}
        <div className="col-md-9">
          <div className="card mb-3">
            <div className="card-header d-flex justify-content-between bg-light">
              <span className="fw-bold">Question {currentQuestionIndex + 1}</span>
              <span className="text-muted">{question.points} pts</span>
            </div>
            
            <div className="card-body">
              <div className="mb-4" dangerouslySetInnerHTML={{ __html: question.question }} />
              {!question.question && <p className="mb-4">{question.question || "No question text"}</p>}

              {/* --- Question Inputs --- */}
              
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
                        onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                      />
                      <label htmlFor={`q${question._id}-choice${idx}`} className="form-check-label">
                        {choice.text}
                      </label>
                    </div>
                  ))}
                </div>
              )}

              {/* True/False */}
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
                      />
                      <label htmlFor={`q${question._id}-${val}`} className="form-check-label text-capitalize">
                        {val}
                      </label>
                    </div>
                  ))}
                </div>
              )}

              {/* Fill in Blank */}
              {question.type === "fill-in-blank" && (
                <input
                  type="text"
                  className="form-control"
                  value={answers[question._id] || ""}
                  onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                  placeholder="Your answer"
                />
              )}
            </div>
          </div>

          {/* Navigation Buttons (Bottom) */}
          <div className="d-flex justify-content-between mt-4">
            <button 
              className="btn btn-secondary" 
              onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
              disabled={isFirstQuestion}
            >
              Previous
            </button>

            {isLastQuestion ? (
              <button className="btn btn-primary" onClick={handleSubmit}>
                Submit Quiz
              </button>
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

        {/* RIGHT COLUMN: Question Navigator */}
        <div className="col-md-3">
          <div className="card">
            <div className="card-header">Questions</div>
            <div className="card-body">
              <div className="d-flex flex-wrap gap-2">
                {quiz.questions.map((q: any, index: number) => {
                  // Determine button style based on state
                  let btnClass = "btn-outline-secondary";
                  if (currentQuestionIndex === index) btnClass = "btn-primary"; // Active
                  else if (answers[q._id]) btnClass = "btn-outline-info"; // Answered

                  return (
                    <button
                      key={q._id}
                      className={`btn ${btnClass} sm-2`}
                      style={{ width: "40px", height: "40px" }}
                      onClick={() => setCurrentQuestionIndex(index)}
                    >
                      {index + 1}
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