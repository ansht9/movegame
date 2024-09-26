import React, { useState } from "react";
import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material-darker.css';
import "./qdetail.css";
import "./simpleComponent.js";
import Navbar from "./Navbar";
import SimpleComponent from "./simpleComponent.js";
import "./bottombar.js";

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="modal-close-button" onClick={onClose}>X</button>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
}

function QuestionDetail() {
  const [codeInput, setCodeInput] = useState("// Type your Move code here\n");
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [questionIndex, setQuestionIndex] = useState(1); // State to track the current question

  // Questions and corresponding correct answers
  const questions = [
    {
      questionId: "question1",
      title: "Question 1",
      description: "Declare a simple smart contract in Move",
      correctCode: "module metaschool::calculator {}",
    },
    {
      questionId: "question2",
      title: "Question 2",
      description: "Make a struct in Move",
      correctCode: `struct Parcel {
    address sender;
    address receiver;
    u64 shipmentPrice;
    bool delivered;
}`,
    },
  ];

  const questions2 = [
    {
      questionId: "question1",
      title: "Question 1",
      description: "Declare a simple smart contract in Move part 2",
      correctCode: "module metaschool::calculator {}",
    },
    {
      questionId: "question2",
      title: "Question 2",
      description: "Make a struct in Move part 2",
      correctCode: `struct Parcel {
    address sender;
    address receiver;
    u64 shipmentPrice;
    bool delivered;
}`,
    },
  ];

  const handleSubmit = () => {
    setSubmitting(true);
    const normalizedUserCode = normalizeCode(codeInput);
    const correctCode = normalizeCode(questions[questionIndex - 1].correctCode);

    const result = normalizedUserCode === correctCode ? "Correct! The code matches." : "Incorrect! The code doesn't match.";
    setModalContent(result);
    setIsModalOpen(true);
    setSubmitting(false);
  };

  const normalizeCode = (code) => {
    const normalized = code.replace(/[\s\uFEFF\xA0]+/g, ' ').trim();
    return normalized;
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleNextQuestion = () => {
    setQuestionIndex(questionIndex + 1); // Move to the next question
    setCodeInput("// Type your Move code here\n");
    setModalContent(""); // Reset modal content
  };

  return (
    <div className="q-detail-container">
      <h1 className="q-detail-title">Code Submission</h1>
      <Navbar />
      <div className="middle">
        <div className="question">
          <h2>{questions[questionIndex - 1].title}</h2>
          <p>{questions[questionIndex - 1].description}</p>
        </div>

        <div className="solution">
          <CodeMirror
            key={codeInput} // Adding a key to force rerender
            value={codeInput}
            options={{
              mode: 'javascript',
              theme: "material-darker",
              lineNumbers: true,
              indentUnit: 4,
              indentWithTabs: true,
            }}
            onChange={(editor, data, value) => {
              setCodeInput(editor.getValue());
            }}
          />

          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Checking..." : "Check"}
          </button>

          {/* Add the Next Question button */}
          <button
            className="next-question-button"
            onClick={handleNextQuestion}
            disabled={questionIndex >= questions.length} // Disable if no more questions
          >
            Next Question
          </button>

          <bottombar />
          <Modal isOpen={isModalOpen} onClose={closeModal}>
            {modalContent}
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default QuestionDetail;
