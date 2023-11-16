import * as React from 'react';
import { Button, Stack, Box, Container, Typography, Rating, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Image from 'material-ui-image'

export function Mylisting (props) {
  const [listings, setListings] = React.useState([]);

  // no dependancy list, means this runs during the first render
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5005/listings');
        const allListings = response.data.listings;
        const myListingsPromise = allListings
          .filter(listing => listing.owner === localStorage.getItem('email'))
          .map(async (listing) => {
            const details = await axios.get(`http://localhost:5005/listings/${listing.id}`);
            const listingData = details.data.listing;
            listingData.id = listing.id;
            return listingData;
          });
        const myListings = await Promise.all(myListingsPromise)
        console.log(myListings)
        setListings(myListings)
      } catch (error) {
        props.setError('Error fetching listings')
      }
    };

    fetchData();
  }, [])

  return (
    <div style={{ height: '75vh', maxWidth: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ height: '100%', maxWidth: '100%', overflowX: 'auto', mb: 3 }}>
        <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />} sx={{ mb: 3 }}>
          {listings.map((listing) => {
            return (
              <Box key={listing.id}>
                <Container maxWidth="sm">
                <Stack spacing={2}>
                  <Typography variant="h4">
                  {listing.title}
                  </Typography>
                  <Typography variant="body1">
                  Type: {listing.metadata.type}
                  </Typography>
                  <Typography variant="body1">
                  Beds: {listing.metadata.nbed}
                  </Typography>
                  <Typography variant="body1">
                  Bathrooms: {listing.metadata.nbath}
                  </Typography>
                  <Image src={listing.thumbnail ? listing.thumbnail : 'https://static.thenounproject.com/png/340719-200.png'} />
                  <Rating name="read-only" value={0} readOnly />
                  <Typography variant="body1">
                    0 Reviews
                  </Typography>
                  <Typography variant="body1">
                    $ {listing.price}
                  </Typography>
                </Stack>
                <Button variant="outlined" component={Link} to={`/editlisting/${listing.id}`}>Edit</Button>
                <Button variant="outlined" component={Link} to={`/publish/${listing.id}`}>Post</Button>
                <Button variant="outlined" component={Link} to={`/bookinginfo/${listing.id}`}>Bookings</Button>
                </Container>
              </Box>
            )
          })}
        </Stack>
      </div>
      <Button variant="contained" component={Link} to="/makelisting">Make listing</Button>
    </div>
  )
}
