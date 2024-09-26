import React from "react";
import "./qlist.css";
import { useNavigate } from "react-router-dom";

function QuestionList() {
  const navigate = useNavigate();

  const handleNavigateToSubmit = () => {
    navigate("/submit");
  };

  const handleNavigateToQuestion = (questionId) => {
    navigate(`/questions/${questionId}`);
  };

  const handleNavigateToQuestion2 = (questionId) => {
    navigate(`/questions2/${questionId}`);
  };

  return (
    <div className="q-list-container">
  <button className="submit-button" onClick={handleNavigateToSubmit}>
    Submit a Question
  </button>
  <h2 className="q-list-title">Available Questions</h2>
  <div className="q-list">
    <div className="q-item">
      <div className="q-info">
        <span className="q-name">questions part 1</span>
      </div>
      <button className="q-link" onClick={() => handleNavigateToQuestion('question1')}>
        Solve
      </button>
    </div>
    <div className="q-item">
      <div className="q-info">
        <span className="q-name">questions part 2</span>
      </div>
      <button className="q-link" onClick={() => handleNavigateToQuestion2('question1')}>
        Solve
      </button>
    </div>
  </div>
</div>

  );
}

export default QuestionList;
