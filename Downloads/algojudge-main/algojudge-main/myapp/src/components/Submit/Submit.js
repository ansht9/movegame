import React, { useState } from 'react';
import axios from 'axios';
import './Submit.css';

const SubmitForm = () => {
  const [questionData, setQuestionData] = useState({
    statement: '',
    name: '',
    code: '',
    difficulty: 'Easy',
  });

  const [testCaseData, setTestCaseData] = useState({
    input: '',
    output: '',
    questionCode: '',
  });

  const [submittingQuestion, setSubmittingQuestion] = useState(false);
  const [submittingTestCase, setSubmittingTestCase] = useState(false);
  const [questionResponse, setQuestionResponse] = useState('');
  const [testCaseResponse, setTestCaseResponse] = useState('');

  const handleQuestionChange = (e) => {
    setQuestionData({ ...questionData, [e.target.name]: e.target.value });
  };

  const handleTestCaseChange = (e) => {
    setTestCaseData({ ...testCaseData, [e.target.name]: e.target.value });
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    setSubmittingQuestion(true);

    const formData = new URLSearchParams();
    formData.append("statement", questionData.statement);
    formData.append("name", questionData.name);
    formData.append("code", questionData.code);
    formData.append("difficulty", questionData.difficulty);

    try {
      const token = localStorage.getItem('accessToken'); // Retrieve token from localStorage
      console.log('Retrieved token:', token); // Debugging line to check token retrieval
      if (!token) {
        throw new Error('No token found in localStorage');
      }

      const response = await axios.post('https://ojproject.algojudge.xyz/questions/api/submit/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setQuestionResponse('Question submitted successfully');
    } catch (error) {
      console.error('Error submitting question:', error.response ? error.response.data : error.message);
      setQuestionResponse('Error submitting question');
    } finally {
      setSubmittingQuestion(false);
    }
  };

  const handleTestCaseSubmit = async (e) => {
    e.preventDefault();
    setSubmittingTestCase(true);

    const formData = new URLSearchParams();
    formData.append("input", testCaseData.input);
    formData.append("output", testCaseData.output);
    formData.append("questionCode", testCaseData.questionCode);

    try {
      const token = localStorage.getItem('accessToken'); // Retrieve token from localStorage
      console.log('Retrieved token:', token); // Debugging line to check token retrieval
      if (!token) {
        throw new Error('No token found in localStorage');
      }

      const response = await axios.post('https://ojproject.algojudge.xyz/questions/api/submittest', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',

        },
      });
      setTestCaseResponse('Test case submitted successfully');
    } catch (error) {
      console.error('Error submitting test case:', error.response ? error.response.data : error.message);
      setTestCaseResponse('Error submitting test case');
    } finally {
      setSubmittingTestCase(false);
    }
  };

  return (
    <div className="submit-form-container">
      <h2 className="submit-form-title">Submit Question</h2>
      <form onSubmit={handleQuestionSubmit} className="submit-form-content">
        <label>
          Statement:
          <textarea name="statement" value={questionData.statement} onChange={handleQuestionChange} required />
        </label>
        <label>
          Name:
          <input type="text" name="name" value={questionData.name} onChange={handleQuestionChange} required />
        </label>
        <label>
          Code:
          <input type="text" name="code" value={questionData.code} onChange={handleQuestionChange} required />
        </label>
        <label>
          Difficulty:
          <select name="difficulty" value={questionData.difficulty} onChange={handleQuestionChange} required>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </label>
        <button type="submit" className="submit-button" disabled={submittingQuestion}>
          {submittingQuestion ? "Submitting..." : "Submit Question"}
        </button>
        {questionResponse && <div className="response">{questionResponse}</div>}
      </form>

      <h2 className="submit-form-title">Submit Test Case</h2>
      <form onSubmit={handleTestCaseSubmit} className="submit-form-content">
        <label>
          Input:
          <textarea name="input" value={testCaseData.input} onChange={handleTestCaseChange} required />
        </label>
        <label>
          Output:
          <textarea name="output" value={testCaseData.output} onChange={handleTestCaseChange} required />
        </label>
        <label>
          Question Code (Should be same as the code used for the question):
          <input type="text" name="questionCode" value={testCaseData.questionCode} onChange={handleTestCaseChange} required />
        </label>
        <button type="submit" className="submit-button" disabled={submittingTestCase}>
          {submittingTestCase ? "Submitting..." : "Submit Test Case"}
        </button>
        {testCaseResponse && <div className="response">{testCaseResponse}</div>}
      </form>
    </div>
  );
};

export default SubmitForm;
