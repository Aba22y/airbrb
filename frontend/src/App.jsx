import React from 'react';
import { Login } from './components/Login'
import { Register } from './components/Register'
import { Dashboard } from './components/Dashboard'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Banner } from './components/Banner';

function LandingPage () {
  return (
    <h1>
      Hello World!
    </h1>
  )
}

function App () {
  // ensure state awareness of token
  const [token, setToken] = React.useState(null);
  return (
    <>
      <Router>
      <Banner token={token} setToken={setToken}/>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login token={token} setToken={setToken}/>} />
          <Route path="/register" element={<Register token={token} setToken={setToken} />} />
          <Route path="/dashboard" element={<Dashboard token={token} setToken={setToken}/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
