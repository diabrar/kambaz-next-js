"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { findQuizById, updateQuiz } from "../../../client";
import { profile } from "@/app/(Kambaz)/Account/client";

export default function QuizDetails() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.cid as string;
  const quizId = params.qid as string;
  const [quiz, setQuiz] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    loadQuiz();
    loadUser();
  }, [quizId]);

  const loadQuiz = async () => {
    try {
      const data = await findQuizById(quizId);
      setQuiz(data);
    } catch (error) {
      console.error("Error loading quiz:", error);
    }
  };

  const loadUser = async () => {
    try {
      const user = await profile();
      setCurrentUser(user);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const handleTogglePublish = async () => {
    try {
      await updateQuiz({ ...quiz, published: !quiz.published });
      loadQuiz(); // Reload to get updated data
    } catch (error) {
      console.error("Error toggling publish:", error);
    }
  };

  if (!quiz) return <div>Loading...</div>;

  const isFaculty = currentUser?.role === "FACULTY";
  const isStudent = currentUser?.role === "STUDENT";

  return (
    <div id="wd-quiz-details" className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{quiz.title}</h2>
        <div>
          {isFaculty && (
            <>
              <button
                className="btn btn-secondary me-2"
                onClick={() => router.push(`/Courses/${courseId}/Quizzes/${quizId}/Preview`)}
              >
                Preview
              </button>
              <button
                className={`btn ${quiz.published ? "btn-danger" : "btn-success"} me-2`}
                onClick={handleTogglePublish}
              >
                {quiz.published ? "Unpublish" : "Publish"}
              </button>
              <button
                className="btn btn-primary"
                onClick={() => router.push(`/Courses/${courseId}/Quizzes/${quizId}/Editor`)}
              >
                Edit
              </button>
            </>
          )}
          {isStudent && (
            <button
              className="btn btn-primary"
              onClick={() => router.push(`/Courses/${courseId}/Quizzes/${quizId}/TakeQuiz`)}
            >
              Take Quiz
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <table className="table">
            <tbody>
              <tr>
                <td><strong>Quiz Type</strong></td>
                <td>{quiz.quizType}</td>
              </tr>
              <tr>
                <td><strong>Points</strong></td>
                <td>{quiz.points}</td>
              </tr>
              <tr>
                <td><strong>Assignment Group</strong></td>
                <td>{quiz.assignmentGroup}</td>
              </tr>
              <tr>
                <td><strong>Shuffle Answers</strong></td>
                <td>{quiz.shuffleAnswers ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td><strong>Time Limit</strong></td>
                <td>{quiz.timeLimit} Minutes</td>
              </tr>
              <tr>
                <td><strong>Multiple Attempts</strong></td>
                <td>{quiz.multipleAttempts ? "Yes" : "No"}</td>
              </tr>
              {quiz.multipleAttempts && (
                <tr>
                  <td><strong>How Many Attempts</strong></td>
                  <td>{quiz.howManyAttempts}</td>
                </tr>
              )}
              <tr>
                <td><strong>Show Correct Answers</strong></td>
                <td>{quiz.showCorrectAnswers}</td>
              </tr>
              {quiz.accessCode && (
                <tr>
                  <td><strong>Access Code</strong></td>
                  <td>{quiz.accessCode}</td>
                </tr>
              )}
              <tr>
                <td><strong>One Question at a Time</strong></td>
                <td>{quiz.oneQuestionAtATime ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td><strong>Webcam Required</strong></td>
                <td>{quiz.webcamRequired ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td><strong>Lock Questions After Answering</strong></td>
                <td>{quiz.lockQuestionsAfterAnswering ? "Yes" : "No"}</td>
              </tr>
            </tbody>
          </table>

          <h4 className="mt-4">Due Dates</h4>
          <table className="table">
            <tbody>
              <tr>
                <td><strong>Due</strong></td>
                <td>{quiz.dueDate ? new Date(quiz.dueDate).toLocaleString() : "No due date"}</td>
              </tr>
              <tr>
                <td><strong>Available from</strong></td>
                <td>{quiz.availableDate ? new Date(quiz.availableDate).toLocaleString() : "Immediately"}</td>
              </tr>
              <tr>
                <td><strong>Until</strong></td>
                <td>{quiz.untilDate ? new Date(quiz.untilDate).toLocaleString() : "No end date"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}