import React from 'react';
import { Login } from './components/Login'
import { Register } from './components/Register'
import { Dashboard } from './components/Dashboard'
import { Alert } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Banner } from './components/Banner';
import { Mylisting } from './components/Mylistings';
import { Makelisting } from './components/Makelisting';
import { Editlisting } from './components/Editlisting';
import { Publish } from './components/Publish';
import { Landingpage } from './components/Landingpage';

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
          <Route path="/" element={<Landingpage token={token} setToken={setToken} setError={setError}/>} />
          <Route path="/login" element={<Login token={token} setToken={setToken} setError={setError}/>} />
          <Route path="/register" element={<Register token={token} setToken={setToken} setError={setError} />} />
          <Route path="/dashboard" element={<Dashboard token={token} setToken={setToken}/>} />
          <Route path="/mylistings" element={<Mylisting token={token} setToken={setToken} setError={setError}/>} />
          <Route path="/makelisting" element={<Makelisting token={token} setToken={setToken} setError={setError}/>} />
          <Route path="/editlisting/:id" element={<Editlisting token={token} setToken={setToken} setError={setError}/>} />
          <Route path="/publish/:id" element={<Publish token={token} setToken={setToken} setError={setError}/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
