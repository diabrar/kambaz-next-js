"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as client from "../../../../client";


export default function QuizEditor() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.cid as string;
  const quizId = params.qid as string;

  const [activeTab, setActiveTab] = useState<"details" | "questions">("details");
  const [quiz, setQuiz] = useState<any>({
    title: "",
    description: "",
    quizType: "Graded Quiz",
    points: 0,
    assignmentGroup: "Quizzes",
    shuffleAnswers: true,
    timeLimit: 20,
    multipleAttempts: false,
    howManyAttempts: 1,
    showCorrectAnswers: "Immediately",
    accessCode: "",
    oneQuestionAtATime: true,
    webcamRequired: false,
    lockQuestionsAfterAnswering: false,
    dueDate: "",
    availableDate: "",
    untilDate: "",
    questions: []
  });
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);

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

  const handleSave = async () => {
    try {
      await client.updateQuiz(quiz);
      router.push(`/Courses/${courseId}/Quizzes/${quizId}`);
    } catch (error) {
      console.error("Error saving quiz:", error);
    }
  };

  const handleSaveAndPublish = async () => {
    try {
      await client.updateQuiz({ ...quiz, published: true });
      router.push(`/Courses/${courseId}/Quizzes`);
    } catch (error) {
      console.error("Error saving quiz:", error);
    }
  };

  const handleCancel = () => {
    router.push(`/Courses/${courseId}/Quizzes`);
  };

  const updateQuizField = (field: string, value: any) => {
    setQuiz({ ...quiz, [field]: value });
  };

  // Question Management
  const addNewQuestion = () => {
    const newQuestion = {
      _id: Date.now().toString(),
      type: "multiple-choice",
      title: "Question",
      points: 1,
      question: "",
      choices: [
        { text: "", isCorrect: true },
        { text: "", isCorrect: false }
      ]
    };
    setCurrentQuestion(newQuestion);
    setEditingQuestionIndex(quiz.questions.length);
  };

  const saveQuestion = () => {
    if (!currentQuestion) return;
    
    const updatedQuestions = [...quiz.questions];
    if (editingQuestionIndex !== null && editingQuestionIndex < updatedQuestions.length) {
      updatedQuestions[editingQuestionIndex] = currentQuestion;
    } else {
      updatedQuestions.push(currentQuestion);
    }
    
    // Calculate total points
    const totalPoints = updatedQuestions.reduce((sum, q) => sum + (q.points || 0), 0);
    
    setQuiz({ 
      ...quiz, 
      questions: updatedQuestions,
      points: totalPoints 
    });
    setCurrentQuestion(null);
    setEditingQuestionIndex(null);
  };

  const editQuestion = (index: number) => {
    setCurrentQuestion({ ...quiz.questions[index] });
    setEditingQuestionIndex(index);
  };

  const deleteQuestion = (index: number) => {
    const updatedQuestions = quiz.questions.filter((_: any, i: number) => i !== index);
    const totalPoints = updatedQuestions.reduce((sum: number, q: any) => sum + (q.points || 0), 0);
    setQuiz({ 
      ...quiz, 
      questions: updatedQuestions,
      points: totalPoints 
    });
  };

  const cancelQuestionEdit = () => {
    setCurrentQuestion(null);
    setEditingQuestionIndex(null);
  };

  const updateQuestionField = (field: string, value: any) => {
    setCurrentQuestion({ ...currentQuestion, [field]: value });
  };

  const addChoice = () => {
    const newChoices = [...(currentQuestion.choices || []), { text: "", isCorrect: false }];
    updateQuestionField("choices", newChoices);
  };

  const updateChoice = (index: number, field: string, value: any) => {
    const newChoices = [...currentQuestion.choices];
    if (field === "isCorrect" && value) {
      // Uncheck all other choices for multiple choice (single answer)
      newChoices.forEach((c, i) => c.isCorrect = i === index);
    } else {
      newChoices[index] = { ...newChoices[index], [field]: value };
    }
    updateQuestionField("choices", newChoices);
  };

  const removeChoice = (index: number) => {
    const newChoices = currentQuestion.choices.filter((_: any, i: number) => i !== index);
    updateQuestionField("choices", newChoices);
  };

  const addPossibleAnswer = () => {
    const newAnswers = [...(currentQuestion.possibleAnswers || []), ""];
    updateQuestionField("possibleAnswers", newAnswers);
  };

  const updatePossibleAnswer = (index: number, value: string) => {
    const newAnswers = [...currentQuestion.possibleAnswers];
    newAnswers[index] = value;
    updateQuestionField("possibleAnswers", newAnswers);
  };

  const removePossibleAnswer = (index: number) => {
    const newAnswers = currentQuestion.possibleAnswers.filter((_: any, i: number) => i !== index);
    updateQuestionField("possibleAnswers", newAnswers);
  };

  return (
    <div id="wd-quiz-editor" className="p-4">
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "details" ? "active" : ""}`}
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "questions" ? "active" : ""}`}
            onClick={() => setActiveTab("questions")}
          >
            Questions
          </button>
        </li>
      </ul>

      {activeTab === "details" && (
        <div id="wd-quiz-details-editor">
          <div className="mb-3">
            <label htmlFor="wd-quiz-title" className="form-label">Title</label>
            <input
              type="text"
              id="wd-quiz-title"
              className="form-control"
              value={quiz.title}
              onChange={(e) => updateQuizField("title", e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="wd-quiz-description" className="form-label">Description</label>
            <textarea
              id="wd-quiz-description"
              className="form-control"
              rows={4}
              value={quiz.description}
              onChange={(e) => updateQuizField("description", e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="wd-quiz-type" className="form-label">Quiz Type</label>
            <select
              id="wd-quiz-type"
              className="form-select"
              value={quiz.quizType}
              onChange={(e) => updateQuizField("quizType", e.target.value)}
            >
              <option value="Graded Quiz">Graded Quiz</option>
              <option value="Practice Quiz">Practice Quiz</option>
              <option value="Graded Survey">Graded Survey</option>
              <option value="Ungraded Survey">Ungraded Survey</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="wd-assignment-group" className="form-label">Assignment Group</label>
            <select
              id="wd-assignment-group"
              className="form-select"
              value={quiz.assignmentGroup}
              onChange={(e) => updateQuizField("assignmentGroup", e.target.value)}
            >
              <option value="Quizzes">Quizzes</option>
              <option value="Exams">Exams</option>
              <option value="Assignments">Assignments</option>
              <option value="Project">Project</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Shuffle Answers</label>
            <div className="form-check">
              <input
                type="checkbox"
                id="wd-shuffle-answers"
                className="form-check-input"
                checked={quiz.shuffleAnswers}
                onChange={(e) => updateQuizField("shuffleAnswers", e.target.checked)}
              />
              <label htmlFor="wd-shuffle-answers" className="form-check-label">Yes</label>
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="wd-time-limit" className="form-label">Time Limit (Minutes)</label>
            <input
              type="number"
              id="wd-time-limit"
              className="form-control"
              value={quiz.timeLimit}
              onChange={(e) => updateQuizField("timeLimit", parseInt(e.target.value))}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Multiple Attempts</label>
            <div className="form-check">
              <input
                type="checkbox"
                id="wd-multiple-attempts"
                className="form-check-input"
                checked={quiz.multipleAttempts}
                onChange={(e) => updateQuizField("multipleAttempts", e.target.checked)}
              />
              <label htmlFor="wd-multiple-attempts" className="form-check-label">Yes</label>
            </div>
          </div>

          {quiz.multipleAttempts && (
            <div className="mb-3">
              <label htmlFor="wd-how-many-attempts" className="form-label">How Many Attempts</label>
              <input
                type="number"
                id="wd-how-many-attempts"
                className="form-control"
                value={quiz.howManyAttempts}
                onChange={(e) => updateQuizField("howManyAttempts", parseInt(e.target.value))}
              />
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="wd-access-code" className="form-label">Access Code</label>
            <input
              type="text"
              id="wd-access-code"
              className="form-control"
              value={quiz.accessCode}
              onChange={(e) => updateQuizField("accessCode", e.target.value)}
              placeholder="Optional"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">One Question at a Time</label>
            <div className="form-check">
              <input
                type="checkbox"
                id="wd-one-question"
                className="form-check-input"
                checked={quiz.oneQuestionAtATime}
                onChange={(e) => updateQuizField("oneQuestionAtATime", e.target.checked)}
              />
              <label htmlFor="wd-one-question" className="form-check-label">Yes</label>
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="wd-due-date" className="form-label">Due Date</label>
            <input
              type="datetime-local"
              id="wd-due-date"
              className="form-control"
              value={quiz.dueDate ? new Date(quiz.dueDate).toISOString().slice(0, 16) : ""}
              onChange={(e) => updateQuizField("dueDate", e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="wd-available-date" className="form-label">Available From</label>
            <input
              type="datetime-local"
              id="wd-available-date"
              className="form-control"
              value={quiz.availableDate ? new Date(quiz.availableDate).toISOString().slice(0, 16) : ""}
              onChange={(e) => updateQuizField("availableDate", e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="wd-until-date" className="form-label">Until</label>
            <input
              type="datetime-local"
              id="wd-until-date"
              className="form-control"
              value={quiz.untilDate ? new Date(quiz.untilDate).toISOString().slice(0, 16) : ""}
              onChange={(e) => updateQuizField("untilDate", e.target.value)}
            />
          </div>
        </div>
      )}

      {activeTab === "questions" && (
        <div id="wd-quiz-questions-editor">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>Questions (Total: {quiz.points} pts)</h4>
            <button className="btn btn-primary" onClick={addNewQuestion}>
              + New Question
            </button>
          </div>

          <div className="mb-4">
            {quiz.questions.map((q: any, index: number) => (
              <div key={q._id} className="card mb-2">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h5>{q.title} ({q.points} pts)</h5>
                      <p className="text-muted">{q.type}</p>
                    </div>
                    <div>
                      <button 
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => editQuestion(index)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteQuestion(index)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {currentQuestion && (
            <div className="card">
              <div className="card-body">
                <h5>{editingQuestionIndex !== null && editingQuestionIndex < quiz.questions.length ? "Edit" : "New"} Question</h5>
                
                <div className="mb-3">
                  <label className="form-label">Question Type</label>
                  <select
                    className="form-select"
                    value={currentQuestion.type}
                    onChange={(e) => {
                      const type = e.target.value;
                      const baseQuestion = {
                        _id: currentQuestion._id,
                        title: currentQuestion.title,
                        points: currentQuestion.points,
                        question: currentQuestion.question,
                        type: type
                      };
                      
                      if (type === "multiple-choice") {
                        setCurrentQuestion({
                          ...baseQuestion,
                          choices: [
                            { text: "", isCorrect: true },
                            { text: "", isCorrect: false }
                          ]
                        });
                      } else if (type === "true-false") {
                        setCurrentQuestion({
                          ...baseQuestion,
                          correctAnswer: "true"
                        });
                      } else if (type === "fill-in-blank") {
                        setCurrentQuestion({
                          ...baseQuestion,
                          possibleAnswers: [""]
                        });
                      }
                    }}
                  >
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="true-false">True/False</option>
                    <option value="fill-in-blank">Fill in the Blank</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={currentQuestion.title}
                    onChange={(e) => updateQuestionField("title", e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Points</label>
                  <input
                    type="number"
                    className="form-control"
                    value={currentQuestion.points}
                    onChange={(e) => updateQuestionField("points", parseInt(e.target.value) || 0)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Question</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={currentQuestion.question}
                    onChange={(e) => updateQuestionField("question", e.target.value)}
                  />
                </div>

                {currentQuestion.type === "multiple-choice" && (
                  <div className="mb-3">
                    <label className="form-label">Choices</label>
                    {currentQuestion.choices?.map((choice: any, idx: number) => (
                      <div key={idx} className="input-group mb-2">
                        <div className="input-group-text">
                          <input
                            type="radio"
                            checked={choice.isCorrect}
                            onChange={() => updateChoice(idx, "isCorrect", true)}
                          />
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          value={choice.text}
                          onChange={(e) => updateChoice(idx, "text", e.target.value)}
                          placeholder={`Choice ${idx + 1}`}
                        />
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => removeChoice(idx)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button className="btn btn-sm btn-secondary" onClick={addChoice}>
                      + Add Choice
                    </button>
                  </div>
                )}

                {currentQuestion.type === "true-false" && (
                  <div className="mb-3">
                    <label className="form-label">Correct Answer</label>
                    <div className="form-check">
                      <input
                        type="radio"
                        id="answer-true"
                        className="form-check-input"
                        checked={currentQuestion.correctAnswer === "true"}
                        onChange={() => updateQuestionField("correctAnswer", "true")}
                      />
                      <label htmlFor="answer-true" className="form-check-label">True</label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        id="answer-false"
                        className="form-check-input"
                        checked={currentQuestion.correctAnswer === "false"}
                        onChange={() => updateQuestionField("correctAnswer", "false")}
                      />
                      <label htmlFor="answer-false" className="form-check-label">False</label>
                    </div>
                  </div>
                )}

                {currentQuestion.type === "fill-in-blank" && (
                  <div className="mb-3">
                    <label className="form-label">Possible Answers (case insensitive)</label>
                    {currentQuestion.possibleAnswers?.map((answer: string, idx: number) => (
                      <div key={idx} className="input-group mb-2">
                        <input
                          type="text"
                          className="form-control"
                          value={answer}
                          onChange={(e) => updatePossibleAnswer(idx, e.target.value)}
                          placeholder={`Answer ${idx + 1}`}
                        />
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => removePossibleAnswer(idx)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button className="btn btn-sm btn-secondary" onClick={addPossibleAnswer}>
                      + Add Answer
                    </button>
                  </div>
                )}

                <div className="d-flex gap-2">
                  <button className="btn btn-success" onClick={saveQuestion}>
                    Save Question
                  </button>
                  <button className="btn btn-secondary" onClick={cancelQuestionEdit}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <hr />
      <div className="d-flex justify-content-end gap-2">
        <button className="btn btn-secondary" onClick={handleCancel}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleSave}>
          Save
        </button>
        <button className="btn btn-success" onClick={handleSaveAndPublish}>
          Save & Publish
        </button>
      </div>
    </div>
  );
}