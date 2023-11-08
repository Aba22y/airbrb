import axios from 'axios';
import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, TextField, Divider, FormControl, Select, InputLabel, MenuItem } from '@mui/material';

export function Editlisting (props) {
  const { id } = useParams();
  const [listingDetails, setListingDetails] = React.useState({ metadata: {} })

  React.useEffect(() => {
    const fetchListingData = async () => {
      try {
        const listingData = await axios.get(`http://localhost:5005/listings/${id}`)
        console.log(listingData.data.listing)
        setListingDetails(listingData.data.listing)
      } catch (error) {
        props.setError(error.response.data.error)
      }
    }
    fetchListingData()
  }, [])

  return (
    <Container maxWidth="sm">
        <Typography variant="h4" gutterBottom>
          Listing Edit
        </Typography>
        <Typography variant="body1" sx={ { display: 'flex', alignItems: 'center' } } >
          Title: {listingDetails.title}
          <Divider orientation="vertical" sx={ { m: 4 } } flexItem />
          <TextField
          label="New title"
          variant="outlined"
          margin="normal"
          />
        </Typography>
        <Typography variant="body1" sx={ { display: 'flex', alignItems: 'center' } }>
          Address: {listingDetails.address}
          <Divider orientation="vertical" sx={ { m: 4 } } flexItem />
          <TextField
          label="New address"
          variant="outlined"
          margin="normal"
          />
        </Typography>
        <Typography variant="body1">
          Current image:
          <Container>
            <img src={listingDetails.thumbnail ? listingDetails.thumbnail : 'https://static.thenounproject.com/png/340719-200.png'} style={{ maxWidth: '20%', maxHeight: '20%' }} />
          </Container>
          <TextField
          type="file"
          variant="outlined"
          margin="normal"
          />
        </Typography>
        <Typography variant="body1" sx={ { display: 'flex', alignItems: 'center' } }>
          Price: ${listingDetails.price}
          <Divider orientation="vertical" sx={ { m: 4 } } flexItem />
          <TextField
          label="New Price"
          variant="outlined"
          margin="normal"
          />
        </Typography>
        <Typography variant="body1">
          Type: {listingDetails.metadata.type}
          <FormControl margin='normal'>
          <InputLabel id="demo-simple-select-label">Type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={''}
            label="Type"
          >
            <MenuItem value={'House'}>House</MenuItem>
            <MenuItem value={'Apartment'}>Apartment</MenuItem>
            <MenuItem value={'Guest House'}>Guest House</MenuItem>
            <MenuItem value={'Hotel'}>Hotel</MenuItem>
          </Select>
        </FormControl>
        </Typography>
        <Typography variant="body1" sx={ { display: 'flex', alignItems: 'center' } }>
          Ammenities:{listingDetails.metadata.amenities}
          <Divider orientation="vertical" sx={ { m: 4 } } flexItem />
          <TextField
          label="New Price"
          variant="outlined"
          margin="normal"
          />
        </Typography>
    </Container>
  )
}
// TODO: finish this page, fix up amenities and address storage
