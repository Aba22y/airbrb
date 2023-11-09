import * as React from 'react';
import { InputAdornment, Container, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Convert image to base64, taken from assignment3
export function getBase64 (file) {
  const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg']
  const valid = validFileTypes.find(type => type === file.type);
  if (!valid) {
    throw Error('provided file is not a png, jpg or jpeg image.');
  }
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      resolve(fileReader.result)
    }
    fileReader.onerror = (err) => {
      reject(err)
    }

    fileReader.readAsDataURL(file)
  })
}

export function Makelisting (props) {
  const [title, setTitle] = React.useState('')
  const [address, setAddress] = React.useState('')
  const [price, setPrice] = React.useState(0)
  const [thumbnail, setThumbnail] = React.useState(null)
  const [type, setType] = React.useState('')
  const [nbath, setNbath] = React.useState(0)
  const [nbed, setNbed] = React.useState(0)
  const [amenities, setAmenities] = React.useState([])

  const navigate = useNavigate();

  const createListing = async () => {
    try {
      await axios.post('http://localhost:5005/listings/new',
        {
          title,
          address,
          price,
          thumbnail,
          metadata: { type, nbath, nbed, amenities, propertyImages: [] }
        },
        { headers: { Authorization: `Bearer ${props.token}` } }
      )
      console.log('listing made')
      navigate('/mylistings')
    } catch (error) {
      props.setError(error.response.data.error)
    }
  }

  return (
    <Container>
      <form onSubmit={ (event) => {
        event.preventDefault()
        createListing()
      }}>
        <TextField id="outlined-basic"
          label="Title"
          variant="outlined"
          margin="normal"
          fullWidth
          onChange={(event) => setTitle(event.target.value)}
        />
        <TextField id="outlined-basic"
          label="Address"
          variant="outlined"
          margin="normal"
          fullWidth
          onChange={(event) => setAddress(event.target.value)}
        />
        <TextField id="outlined-basic"
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
            const image = await getBase64(event.target.files[0])
            setThumbnail(image)
          }}
        />
        <FormControl fullWidth margin='normal'>
          <InputLabel id="demo-simple-select-label">Type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
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
        <TextField id="outlined-basic"
          label="Number of Bathrooms"
          variant="outlined"
          margin="normal"
          fullWidth
          onChange={(event) => setNbath(event.target.value)}
        />
        <TextField id="outlined-basic"
          label="Number of Bedrooms"
          variant="outlined"
          margin="normal"
          fullWidth
          onChange={(event) => setNbed(event.target.value)}
        />
        <TextField id="outlined-basic"
          label="Amenities"
          variant="outlined"
          margin="normal"
          fullWidth
          onChange={(event) => setAmenities(event.target.value)}
        />
        <Button variant="contained" type='submit'>Make Listing</Button>
      </form>
    </Container>
  )
}
