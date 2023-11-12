import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { FormControl, InputLabel, Select, MenuItem, InputAdornment, Paper, Backdrop, Stack, Box, Container, Typography, Divider, Rating, TextField, Button } from '@mui/material';
import Image from 'material-ui-image'
import axios from 'axios';

export function Landingpage (props) {
  // published listings
  const [listings, setListings] = React.useState([])

  const [searchBedMin, setBedMin] = React.useState('')
  const [searchBedMax, setBedMax] = React.useState('')
  const [searchSDate, setSDate] = React.useState('')
  const [searchEDate, setEDate] = React.useState('')
  const [searchPriceMin, setPriceMin] = React.useState('')
  const [searchPriceMax, setPriceMax] = React.useState('')
  const [searchRating, setRating] = React.useState('')

  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const pubListings = async () => {
      try {
        const pubList = [];
        const res = await axios.get('http://localhost:5005/listings');
        const listings = res.data.listings;
        for (const listing of listings) {
          try {
            const fullDetails = await axios.get(`http://localhost:5005/listings/${listing.id}`);
            // only if published
            if (fullDetails.data.listing.published) {
              pubList.push(fullDetails.data.listing);
            }
          } catch (error) {
            props.setError(error.response.data.error);
          }
        }
        setListings(pubList);
      } catch (error) {
        props.setError(error.response.data.error);
      }
    }
    pubListings()
  }, [])

  const cancelFilter = () => {
    setOpen(false)
    setPriceMax('')
    setPriceMin('')
    setSDate('')
    setEDate('')
    setBedMax('')
    setBedMin('')
    setRating('')
  }

  return (
    <div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <Paper>
          <form onSubmit={(event) => {
            event.preventDefault()
            setOpen(false)
          }}>
            <Typography>Number of Bedrooms</Typography>
            <Stack direction='row'>
              <TextField id="min-bed" label="Min" variant="outlined" onChange={(event) => setBedMin(event.target.value)}/>
              <TextField id="max-bed" label="Max" variant="outlined" onChange={(event) => setBedMax(event.target.value)}/>
            </Stack>
            <Typography>Availability</Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Stack direction='row'>
                  <Typography>
                    From:
                    <DatePicker id="start-date" value={null} onChange={(value) => setSDate(value)} />
                    To:
                    <DatePicker id="end-date" value={null} onChange={(value) => setEDate(value)} />
                  </Typography>
                </Stack>
            </LocalizationProvider>
            <Typography>Price Range</Typography>
            <Stack direction='row'>
              <TextField id="price-min"
                label="Min"
                variant="outlined"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>
                }}
                onChange={(event) => setPriceMin(event.target.value)}
              />
              <TextField id="price-max"
                label="Max"
                variant="outlined"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>
                }}
                onChange={(event) => setPriceMax(event.target.value)}
              />
            </Stack>
            <Typography>Rating</Typography>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Age</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={searchRating}
                label="Sort By"
                onChange={(event) => setRating(event.target.value)}
              >
                <MenuItem value={'Highest'}>Highest</MenuItem>
                <MenuItem value={'Lowest'}>Lowest</MenuItem>
              </Select>
            </FormControl>
            <Button variant="outlined" type='submit'>Submit</Button>
            <Button variant="outlined" onClick={() => cancelFilter()}>Exit</Button>
          </form>
        </Paper>
      </Backdrop>

      <Stack direction="row" spacing={3}>
        <Container>
          <Typography><TextField label="Search for listing" variant="outlined" fullWidth/></Typography>
          <div style={{ maxWidth: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Typography>Bedrooms: {(searchBedMin && searchBedMax) && `${searchBedMin} - ${searchBedMax}` } </Typography>
            <Typography>Dates: {(searchSDate && searchEDate) && `${searchSDate} - ${searchEDate}` }</Typography>
            <Typography>Price: {(searchPriceMin && searchPriceMax) && `${searchPriceMin} - ${searchPriceMax}` }</Typography>
            <Typography>Rating: {(searchRating) && `${searchRating}` }</Typography>
          </div>
        </Container>
        <Stack>
          <Button variant="outlined">Search</Button>
          <Button variant="outlined" onClick={() => setOpen(true)}>Filter</Button>
        </Stack>
      </Stack>

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
                  </Stack>
                  </Container>
                </Box>
              )
            })}
          </Stack>
        </div>
      </div>
    </div>
  )
}