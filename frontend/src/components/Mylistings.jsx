import * as React from 'react';
import { Button, Stack, Box, Container, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

export function Mylisting (props) {
  const [listings, setListings] = React.useState([]);

  // no dependancy list, means this runs during the first render
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5005/listings');
        setListings(response.data.listings);
      } catch (error) {
        props.setError('Error fetching listings:')
      }
    };

    fetchData();
  }, [])

  return (
    <>
      <Stack direction="row" spacing={2}>
        {listings.map((listing) => {
          return (
            <Box key={listing.id}>
              <Container maxWidth="sm">
              <Stack spacing={2}>
                <Typography variant="h1">
                 {listing.title}
                </Typography>
                <Typography>
                 {listing.owner}
                </Typography>
              </Stack>
              </Container>
            </Box>
          )
        })}
      </Stack>
      <Button color="inherit" component={Link} to="/makelisting">Login</Button>
    </>
  )
}
