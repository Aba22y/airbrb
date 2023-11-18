import * as React from 'react';
import { Button, Box, AppBar, Toolbar, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// this banner changes depending on the login status of the user
export function Banner (props) {
  const navigate = useNavigate();
  // checks if a token exists
  return (
        <Box sx={{ flexGrow: 1, mb: 2 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant='h3' sx ={{ mr: 3 }}>AIRBRB</Typography>
              <Button color="inherit" component={Link} to="/">Dashboard</Button>
              {props.token
                ? (<>
                    <Button color="inherit" component={Link} to="/mylistings">My Listings</Button>
                    <Button color="inherit" onClick={() => {
                      try {
                        axios.post('http://localhost:5005/user/auth/logout',
                          {},
                          { headers: { Authorization: `Bearer ${props.token}` } }
                        );
                        props.setToken(null);
                        localStorage.removeItem('email');
                        navigate('/login');
                      } catch (error) {
                        props.setError(error.response.data.error);
                      }
                    }}>Logout</Button>
                    </>)
                : (<>
                    <Button color="inherit" component={Link} to="/login">Login</Button>
                    <Button color="inherit" component={Link} to="/register">Register</Button>
                    </>
                  )
              }
            </Toolbar>
          </AppBar>
        </Box>
  );
}
