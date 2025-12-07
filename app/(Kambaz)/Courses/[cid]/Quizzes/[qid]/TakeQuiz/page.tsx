"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as client from "../../../../client";

export default function TakeQuiz() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.cid as string;
  const quizId = params.qid as string;

  const [quiz, setQuiz] = useState<any>(null);
  const [answers, setAnswers] = useState<any>({});

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
    alert("Quiz submitted");
    router.push(`/Courses/${courseId}/Quizzes`);
  };

  if (!quiz) return <div className="p-4">Loading...</div>;

  return (
    <div id="wd-take-quiz" className="p-4">
      <h2>{quiz.title}</h2>

      <div className="alert alert-info mb-4">
        <p className="mb-1"><strong>Time Limit:</strong> {quiz.timeLimit} minutes</p>
        <p className="mb-1"><strong>Points:</strong> {quiz.points}</p>
        <p className="mb-0"><strong>Questions:</strong> {quiz.questions.length}</p>
      </div>

      {quiz.questions.map((question: any, index: number) => (
        <div key={question._id} className="card mb-4">
          <div className="card-body">
            <h5>Question {index + 1} ({question.points} pts)</h5>
            <p className="mb-3">{question.question}</p>
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
                    onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                  />
                  <label htmlFor={`q${question._id}-true`} className="form-check-label">
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
                    onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                  />
                  <label htmlFor={`q${question._id}-false`} className="form-check-label">
                    False
                  </label>
                </div>
              </div>
            )}
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
      ))}

      <div className="d-flex gap-2">
        <button className="btn btn-primary" onClick={handleSubmit}>
          Submit Quiz
        </button>
        <button 
          className="btn btn-secondary"
          onClick={() => router.push(`/Courses/${courseId}/Quizzes`)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}