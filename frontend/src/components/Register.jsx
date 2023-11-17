import * as React from 'react';
import { Button, Container, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export function Register (props) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [cpassword, setCPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const navigate = useNavigate();

  // ensure that passwords match and email is valid
  // if so, create an account and navigate to the landing page
  const registerUser = async () => {
    try {
      const emailformat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (cpassword !== password) {
        props.setError('Password does not match');
        return;
      } else if (!emailformat.test(email)) {
        props.setError('Please enter a valid email');
        return;
      }
      await axios.post('http://localhost:5005/user/auth/register', { email, password, name });
      console.log('Account created');
      navigate('/login');
    } catch (error) {
      props.setError(error.response.data.error);
    }
  }

  return (
    <Container maxWidth="sm">
        <form onSubmit={ async (event) => {
          event.preventDefault();
          registerUser();
        }}>
            <Typography variant="h4" gutterBottom>
                Register
            </Typography>

            <TextField
            label="Email"
            variant="outlined"
            fullWidth sx={{ mb: 2 }}
            onChange={(event) => setEmail(event.target.value)} />

            <TextField
            label="Password"
            variant="outlined"
            type='password'
            fullWidth
            sx={{ mb: 2 }}
            onChange={(event) => setPassword(event.target.value)} />

            <TextField
            label="Confirm-Password"
            variant="outlined"
            type='password'
            fullWidth
            sx={{ mb: 2 }}
            error={password !== cpassword}
            onChange={(event) => setCPassword(event.target.value)} />

            <TextField
            label="Name"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            onChange={(event) => setName(event.target.value)} />

            <Button variant="contained" type="submit" sx={{ m: 1 }}>Create</Button>
        </form>
    </Container>
  );
}
