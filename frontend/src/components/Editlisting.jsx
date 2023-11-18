import axios from 'axios';
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBase64, isValidAddress } from './helpers';
import { Button, Container, Typography, TextField, Divider, FormControl, Select, InputLabel, MenuItem } from '@mui/material';

export function Editlisting (props) {
  const { id } = useParams();
  const [listingDetails, setListingDetails] = React.useState({ metadata: {} });
  const [title, setTitle] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [thumbnail, setThumbnail] = React.useState(null);
  const [price, setPrice] = React.useState('');
  const [type, setType] = React.useState('');
  const [nbath, setNbath] = React.useState('');
  const [nbed, setNbed] = React.useState('');
  const [amenities, setAmenities] = React.useState([]);
  const [propertyImages, setPImages] = React.useState([]);
  const navigate = useNavigate();

  // get the current listing details
  React.useEffect(() => {
    const fetchListingData = async () => {
      try {
        const listingData = await axios.get(`http://localhost:5005/listings/${id}`);
        setListingDetails(listingData.data.listing);
      } catch (error) {
        props.setError(error.response.data.error);
      }
    }
    fetchListingData();
  }, [])

  // upon saving this function change details
  const updateDetails = async () => {
    try {
      const metadata = listingDetails.metadata;
      // make sure field is not empty and is different
      for (const [key, data] of [['type', type], ['nbath', nbath], ['nbed', nbed]]) {
        if (data !== '' && metadata[key] !== data) {
          metadata[key] = data;
        }
      }
      // change amenities
      if (amenities.length !== 0) {
        metadata.amenities = amenities;
      }
      if (propertyImages.length !== 0) {
        metadata.propertyImages = propertyImages;
      }
      await axios.put(`http://localhost:5005/listings/${id}`, {
        title,
        address,
        thumbnail,
        price,
        metadata
      },
      { headers: { Authorization: `Bearer ${props.token}` } });
      navigate('/mylistings');
    } catch (error) {
      props.setError(error.response.data.error);
    }
  }

  return (
    <Container maxWidth="sm">
        <Typography variant="h4" gutterBottom>
          Listing Edit
        </Typography>

        <Typography component={'span'} variant="body1" sx={ { display: 'flex', alignItems: 'center' } } >
          Title: {listingDetails.title}
          <Divider orientation="vertical" sx={ { m: 4 } } flexItem />
          <TextField
          label="New title"
          variant="outlined"
          margin="normal"
          onChange={(event) => setTitle(event.target.value)}
          />
        </Typography>

        <Typography component={'span'} variant="body1" sx={ { display: 'flex', alignItems: 'center' } }>
          Address: {listingDetails.address}
          <Divider orientation="vertical" sx={ { m: 4 } } flexItem />
          <TextField
          label="Street, City, State, Postcode, Country"
          variant="outlined"
          margin="normal"
          onChange={(event) => {
            if (isValidAddress(event.target.value)) {
              setAddress(event.target.value);
            } else {
              setAddress('');
            }
          }}
          />
        </Typography>

        <Typography component={'span'} variant="body1">
          Current image:
          <Container>
            <img src={listingDetails.thumbnail ? listingDetails.thumbnail : 'https://static.thenounproject.com/png/340719-200.png'} style={{ maxWidth: '20%', maxHeight: '20%' }} />
          </Container>
          <TextField
          type="file"
          variant="outlined"
          margin="normal"
          onChange={async (event) => {
            const image = await getBase64(event.target.files[0]);
            setThumbnail(image);
          }}
          />
        </Typography>

        <Typography component={'span'} variant="body1" sx={ { display: 'flex', alignItems: 'center' } }>
          Price: ${listingDetails.price}
          <Divider orientation="vertical" sx={ { m: 4 } } flexItem />
          <TextField
          label="New Price"
          variant="outlined"
          margin="normal"
          onChange={(event) => setPrice(event.target.value)}
          />
        </Typography>

        <Typography component={'span'} variant="body1">
          Type: {listingDetails.metadata.type}
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
        </Typography>

        <Typography component={'span'} variant="body1" sx={ { display: 'flex', alignItems: 'center' } }>
          Number of beds: {listingDetails.metadata.nbed}
          <TextField
          label="#Beds"
          variant="outlined"
          margin="normal"
          onChange={(event) => setNbed(event.target.value)}
          />
          <Divider orientation="vertical" sx={ { m: 4 } } flexItem />
          Number of bathrooms: {listingDetails.metadata.nbath}
          <TextField
          label="#Bathrooms"
          variant="outlined"
          margin="normal"
          onChange={(event) => setNbath(event.target.value)}
          />
        </Typography>

        <Typography component={'span'} variant="body1" sx={ { display: 'flex', alignItems: 'center' } }>
          Ammenities:{listingDetails.metadata.amenities}
          <Divider orientation="vertical" sx={ { m: 4 } } flexItem />
          <TextField
          label="Amenities (seperate each item with '-')"
          variant="outlined"
          margin="normal"
          onChange={(event) => setAmenities((event.target.value).split('-'))}
          />
        </Typography>

        <Typography component={'span'} variant="body1">
          List of Images:
          <input
          type='file'
          multiple
          style={ { marginLeft: '5%' } }
          onChange={async (event) => {
            const files = Array.from(event.target.files);
            const newImageForm = await Promise.all(files.map(getBase64));
            setPImages(newImageForm);
          }} />
        </Typography>

        <Button
        variant="contained"
        type="submit"
        sx={{ mt: 2 }}
        onClick={() => updateDetails()}>
          Save changes
        </Button>
    </Container>
  )
}
