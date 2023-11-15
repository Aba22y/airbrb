import * as React from 'react';
import { Button, Box, AppBar, Toolbar, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

// remember, the token passed in is passed by value, but the function changes the original
// value which calls a render of the parent that has a cascading render effect on its children
export function Banner (props) {
  const navigate = useNavigate();
  return (
        <Box sx={{ flexGrow: 1, mb: 2 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant='h3' sx ={{ mr: 3 }}>AIRBRB</Typography>
                {props.token
                  ? (<>
                    <Button color="inherit" component={Link} to="/">Dashboard</Button>
                    <Button color="inherit" component={Link} to="/mylistings">My Listings</Button>
                    <Button color="inherit" onClick={() => {
                      props.setToken(null)
                      navigate('/login');
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
