import * as React from 'react';
import { Button, Container, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export function Login (props) {
  console.log(props)
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const navigate = useNavigate();

  const signIn = async () => {
    try {
      const res = await axios.post('http://localhost:5005/user/auth/login', { email, password })
      const data = await res.data
      const success = await res.status

      console.log('Status Code:', success);
      props.setToken(data.token);
      localStorage.setItem('email', email)
      navigate('/')
      return res
    } catch (error) {
      props.setError(error.response.data.error)
      return error.response;
    }
  }

  return (
    <Container maxWidth="sm">
        <form onSubmit={ async (event) => {
          event.preventDefault()
          return signIn()
        }}>
            <Typography variant="h4" gutterBottom>
                Login
            </Typography>
            <TextField id="outlined-basic" label="Username" variant="outlined" fullWidth sx={{ mb: 2 }} onChange={(event) => setEmail(event.target.value)} />
            <TextField id="outlined-basic" label="Password" variant="outlined" type='password' fullWidth sx={{ mb: 2 }} onChange={(event) => setPassword(event.target.value)} />
            <Button variant="contained" type="submit" sx={{ m: 1 }}>Sign in</Button>
            <Button variant="contained" sx={{ m: 1 }}>Register</Button>
        </form>
    </Container>
  )
}
