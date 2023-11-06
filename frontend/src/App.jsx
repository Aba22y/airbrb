import React from 'react';
import { Login } from './components/Login'
import { Register } from './components/Register'
import { Dashboard } from './components/Dashboard'
import { Alert } from '@mui/material';
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
  // error message
  const [error, setError] = React.useState('')
  return (
    <>
      {error !== '' &&
      <Alert severity="error" onClose={() => { setError('') }}>{error}</Alert>
      }
      <Router>
      <Banner token={token} setToken={setToken}/>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login token={token} setToken={setToken} setError={setError}/>} />
          <Route path="/register" element={<Register token={token} setToken={setToken} setError={setError} />} />
          <Route path="/dashboard" element={<Dashboard token={token} setToken={setToken}/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
