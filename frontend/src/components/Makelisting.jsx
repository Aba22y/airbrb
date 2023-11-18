import * as React from 'react';
import { InputAdornment, Container, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getBase64, isValidAddress } from './helpers';
import axios from 'axios';

export function Makelisting (props) {
  const [title, setTitle] = React.useState(undefined);
  const [address, setAddress] = React.useState(undefined);
  const [price, setPrice] = React.useState(undefined);
  const [thumbnail, setThumbnail] = React.useState('');
  const [type, setType] = React.useState(undefined);
  const [nbath, setNbath] = React.useState(undefined);
  const [nbed, setNbed] = React.useState(undefined);
  const [amenities, setAmenities] = React.useState(undefined);

  const navigate = useNavigate();

  // Ensures all details are entered correctly
  // and creates a new, unpublished listing
  const createListing = async () => {
    try {
      const metadata = (!type || !nbath || isNaN(nbath) || !nbed || isNaN(nbed) || !amenities)
        ? undefined
        : { type, nbath, nbed, amenities, propertyImages: [] };
      if (!isValidAddress(address)) {
        setAddress(undefined);
      }
      await axios.post('http://localhost:5005/listings/new',
        {
          title,
          address,
          price,
          thumbnail,
          metadata
        },
        { headers: { Authorization: `Bearer ${props.token}` } }
      );
      console.log('listing made');
      navigate('/mylistings');
    } catch (error) {
      props.setError(error.response.data.error);
    }
  }

  // form used to create a listing
  return (
    <Container>
      <form onSubmit={ (event) => {
        event.preventDefault();
        createListing();
      }}>
        <TextField
          label="Title"
          variant="outlined"
          margin="normal"
          fullWidth
          onChange={(event) => setTitle(event.target.value)}
        />
        <TextField
          label="Street, City, State, Postcode, Country"
          variant="outlined"
          margin="normal"
          fullWidth
          onChange={(event) => setAddress(event.target.value)}
        />
        <TextField
          label="Price"
          variant="outlined"
          margin="normal"
          fullWidth
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>
          }}
          onChange={(event) => setPrice(event.target.value)}
        />
        <TextField
          type="file"
          fullWidth
          margin='normal'
          onChange={async (event) => {
            const image = await getBase64(event.target.files[0]);
            setThumbnail(image);
          }}
        />
        <FormControl fullWidth margin='normal'>
          <InputLabel id="demo-simple-select-label">Type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            value={type}
            label="Type"
            onChange={(event) => setType(event.target.value)}
          >
            <MenuItem value={'House'}>House</MenuItem>
            <MenuItem value={'Apartment'}>Apartment</MenuItem>
            <MenuItem value={'Guest House'}>Guest House</MenuItem>
            <MenuItem value={'Hotel'}>Hotel</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Number of Bathrooms"
          variant="outlined"
          margin="normal"
          fullWidth
          onChange={(event) => setNbath(event.target.value)}
        />
        <TextField
          label="Number of Beds"
          variant="outlined"
          margin="normal"
          fullWidth
          onChange={(event) => setNbed(event.target.value)}
        />
        <TextField
          label="Amenities (seperate each item with '-')"
          variant="outlined"
          margin="normal"
          fullWidth
          onChange={(event) => setAmenities((event.target.value).split('-'))}
        />
        <Button variant="contained" type='submit'>Make Listing</Button>
      </form>
    </Container>
  );
}
