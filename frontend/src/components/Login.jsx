import * as React from 'react';
import { Container, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FuncButton } from './FuncButton';
import axios from 'axios';

export function Login (props) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();

  // create token, store email, and navigate to the landing page
  const signIn = async () => {
    try {
      const res = await axios.post('http://localhost:5005/user/auth/login', { email, password });
      const data = await res.data;

      console.log('Logged in');
      props.setToken(data.token);
      localStorage.setItem('email', email);
      navigate('/');
    } catch (error) {
      props.setError(error.response.data.error);
    }
  }

  return (
    <Container maxWidth="sm">
        <form onSubmit={ async (event) => {
          event.preventDefault();
          signIn();
        }}>
            <Typography variant="h4" gutterBottom>
                Login
            </Typography>
            <TextField
            label="Username"
            variant="outlined"
            fullWidth sx={{ mb: 2 }}
            onChange={(event) => setEmail(event.target.value)} />
            <TextField
            label="Password"
            variant="outlined"
            type='password'
            fullWidth sx={{ mb: 2 }}
            onChange={(event) => setPassword(event.target.value)} />
            <FuncButton enabled={true} submit={true} color={'primary'} text={'Sign In'}/>
        </form>
    </Container>
  )
}
