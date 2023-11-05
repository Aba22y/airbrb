import * as React from 'react';
import { Button, Box, AppBar, Toolbar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

export function Banner (props) {
  const navigate = useNavigate();

  return (
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
                {props.token
                  ? (<>
                    <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
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
