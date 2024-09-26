import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm/LoginForm';
import Registration from './components/Register/Register';
import QuestionDetail from './components/Question/qdetail';
import QueDetail from './components/Question/quedetail';
import QuestionList from './components/Question/qlist';
import SubmitForm from './components/Submit/Submit';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/questions" element={<QuestionList />} />
        <Route path="/questions/:code" element={<QuestionDetail />} />
        <Route path="/questions2/:code" element={<QueDetail />} />
        {/* <Route path="/questions2/:code" element={<QuestionDetail />} /> */}
        <Route path="/submit" element={<SubmitForm />} />
      </Routes>
    </Router>
  );
}

export default App;
