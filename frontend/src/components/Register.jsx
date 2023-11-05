import * as React from 'react';
import { Button, Container, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export function Register (props) {
  console.log(props)
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [cpassword, setCPassword] = React.useState('')
  const [name, setName] = React.useState('')
  const navigate = useNavigate();

  const registerUser = async () => {
    try {
      if (cpassword !== password) {
        console.error('Error: Password does not match');
        return;
      }
      const res = await axios.post('http://localhost:5005/user/auth/register', { email, password, name })
      const success = await res.status
      console.log('Status Code:', success);
      navigate('/login')
      return res
    } catch (error) {
      console.error('Error:', error);
      return error.response;
    }
  }

  return (
    <Container maxWidth="sm">
        <form onSubmit={ async (event) => {
          event.preventDefault()
          return registerUser()
        }}>
            <Typography variant="h4" gutterBottom>
                Register
            </Typography>
            <TextField id="outlined-basic" label="Email" variant="outlined" fullWidth sx={{ mb: 2 }} onChange={(event) => setEmail(event.target.value)} />
            <TextField id="outlined-basic" label="Password" variant="outlined" type='password' fullWidth sx={{ mb: 2 }} onChange={(event) => setPassword(event.target.value)} />
            <TextField id="outlined-basic" label="Confirm-Password" variant="outlined" type='password' fullWidth sx={{ mb: 2 }} onChange={(event) => setCPassword(event.target.value)} />
            <TextField id="outlined-basic" label="Name" variant="outlined" fullWidth sx={{ mb: 2 }} onChange={(event) => setName(event.target.value)} />
            <Button variant="contained" type="submit" sx={{ m: 1 }}>Create</Button>
        </form>
    </Container>
  )
}
