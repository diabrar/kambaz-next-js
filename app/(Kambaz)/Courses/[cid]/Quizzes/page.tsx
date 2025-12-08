"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import * as client from "../../client";
import { profile } from "@/app/(Kambaz)/Account/client";
import { MdDoNotDisturb } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";

export default function Quizzes() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.cid as string;
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    loadQuizzes();
    loadUser();
  }, [courseId]);

  const loadQuizzes = async () => {
    try {
      const data = await client.findQuizzesForCourse(courseId);
      setQuizzes(data);
    } catch (error) {
      console.error("Error loading quizzes:", error);
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

  const handleCreateQuiz = async () => {
    try {
      const newQuiz = await client.createQuizForCourse(courseId, {
        _id: "02",
        title: "New Quiz",
        description: "",
      });
      router.push(`/Courses/${courseId}/Quizzes/${newQuiz._id}/Editor`);
    } catch (error) {
      console.error("Error creating quiz:", error);
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;
    try {
      await client.deleteQuiz(quizId);
      loadQuizzes();
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  const handleTogglePublish = async (quiz: any, quizId: string) => {
    try {
      await client.updateQuiz({ ...quiz, published: !quiz.published });
      loadQuizzes();
    } catch (error) {
      console.error("Error toggling publish:", error);
    }
  };

  const getAvailabilityText = (quiz: any) => {
    const now = new Date();
    const availableDate = quiz.availableDate
      ? new Date(quiz.availableDate)
      : null;
    const untilDate = quiz.untilDate ? new Date(quiz.untilDate) : null;

    if (availableDate && now < availableDate) {
      return `Not available until ${availableDate.toLocaleDateString()}`;
    }
    if (untilDate && now > untilDate) {
      return "Closed";
    }
    if (
      availableDate &&
      untilDate &&
      now >= availableDate &&
      now <= untilDate
    ) {
      return "Available";
    }
    return "Available";
  };

  const isFaculty = currentUser?.role === "FACULTY";

  return (
    <div id="wd-quizzes">
      {isFaculty && (
        <div className="mb-3">
          <button
            id="wd-add-quiz"
            className="btn btn-danger"
            onClick={handleCreateQuiz}
          >
            + Quiz
          </button>
        </div>
      )}
      <h3 id="wd-quizzes-title">Quizzes</h3>
      {quizzes.length === 0 ? (
        <p className="text-muted">
          {isFaculty
            ? "No quizzes yet. Click '+ Quiz' to create one."
            : "No quizzes available for this course."}
        </p>
      ) : (
        <ul id="wd-quiz-list" className="list-group">
          {quizzes.filter((quiz: any) => !isFaculty ? quiz.published : quiz)
          .map((quiz) => (
            <li
              key={quiz._id}
              className="wd-quiz-list-item list-group-item p-3"
            >
              <div className="d-flex align-items-center">
                {isFaculty && (
                  <div className="me-3">
                    <span style={{ color: quiz.published ? "green" : "inherit" }}>
                      {quiz.published ? "Published" : "Not Published"}
                    </span>
                    <button
                      className="btn btn-sm"
                      onClick={() => handleTogglePublish(quiz, quiz._id)}
                      style={{
                        background: "none",
                        border: "none",
                        fontSize: "1.2rem",
                      }}
                    >
                      {quiz.published ? "✅" : <MdDoNotDisturb />}
                    </button>
                  </div>
                )}

                <div className="flex-grow-1">
                  <Link
                    href={`/Courses/${courseId}/Quizzes/${quiz._id}`}
                    className="wd-quiz-link text-decoration-none text-dark fw-bold"
                  >
                    {quiz.title}
                  </Link>
                  <br />
                  <p className="mb-0 text-muted small">
                    <span>{getAvailabilityText(quiz)}</span>
                    {quiz.dueDate && (
                      <span>
                        {" "}
                        | <b>Due</b>{" "}
                        {new Date(quiz.dueDate).toLocaleDateString()}
                      </span>
                    )}
                    <span> | {quiz.points} pts</span>
                    <span> | {quiz.questions?.length || 0} questions</span>
                  </p>
                </div>

                {isFaculty && (
                  <div className="position-relative">
                    <button
                      className="btn btn-sm"
                      type="button"
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === quiz._id ? null : quiz._id
                        )
                      }
                      style={{ fontSize: "1.5rem" }}
                    >
                      ⋮
                    </button>
                    {openDropdown === quiz._id && (
                      <div
                        className="position-absolute bg-white border rounded shadow"
                        style={{ right: 0, zIndex: 1000, minWidth: "150px" }}
                      >
                        <button
                          className="dropdown-item"
                          onClick={() => {
                            router.push(
                              `/Courses/${courseId}/Quizzes/${quiz._id}/Editor`
                            );
                            setOpenDropdown(null);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="dropdown-item"
                          onClick={() => {
                            handleTogglePublish(quiz, quiz._id);
                            setOpenDropdown(null);
                          }}
                        >
                          {quiz.published ? "Unpublish" : "Publish"}
                        </button>
                        <button
                          className="dropdown-item text-danger"
                          onClick={() => {
                            handleDeleteQuiz(quiz._id);
                            setOpenDropdown(null);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
