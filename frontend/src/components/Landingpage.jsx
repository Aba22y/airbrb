import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Paper,
  Backdrop,
  Stack,
  Box,
  Container,
  Typography,
  Divider,
  Rating,
  TextField,
  Button
} from '@mui/material';
import { parse } from 'date-fns';
import { Link } from 'react-router-dom';
import { getAvgRating } from './helpers';
import Image from 'material-ui-image'
import axios from 'axios';

export function Landingpage (props) {
  // used to determine what pricing to load on listing page
  const [pstay, setPstay] = React.useState('false');
  // published listings
  const [listings, setListings] = React.useState([]);
  const [displayList, setDisplayList] = React.useState([]);

  const [searchString, setString] = React.useState('');
  const [searchBedMin, setBedMin] = React.useState('');
  const [searchBedMax, setBedMax] = React.useState('');
  const [searchSDate, setSDate] = React.useState('');
  const [searchEDate, setEDate] = React.useState('');
  const [searchPriceMin, setPriceMin] = React.useState('');
  const [searchPriceMax, setPriceMax] = React.useState('');
  const [searchRating, setRating] = React.useState('');

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
            const spot = fullDetails.data.listing;
            if (spot.published) {
              spot.id = listing.id;
              pubList.push(spot);
            }
          } catch (error) {
            props.setError(error.response.data.error);
          }
        }
        setListings(pubList);
        setDisplayList(pubList);
      } catch (error) {
        props.setError(error.response.data.error);
      }
    }
    pubListings();
  }, [])

  const cancelFilter = () => {
    setOpen(false);
    setPriceMax('');
    setPriceMin('');
    setSDate('');
    setEDate('');
    setBedMax('');
    setBedMin('');
    setRating('');
  }

  const search = () => {
    let searchArray = [...listings];
    // narrow results by search string
    if (searchString) {
      searchArray = searchArray.filter((element) => {
        return (element.title.includes(searchString) || element.address.includes(searchString));
      })
    }
    // narrow results by number of beds
    if (searchBedMin && searchBedMax) {
      searchArray = searchArray.filter((element) => {
        const elementBeds = parseInt(element.metadata.nbed, 10);
        return (elementBeds >= parseInt(searchBedMin, 10) && elementBeds <= parseInt(searchBedMax, 10));
      })
    }
    // narrow results by price
    if (searchPriceMin && searchPriceMax) {
      searchArray = searchArray.filter((element) => {
        return (element.price <= searchPriceMax && element.price >= searchPriceMin);
      })
    }
    // sort results by search rating
    if (searchRating) {
      searchArray.sort((a, b) => {
        return (searchRating === 'Highest') ? getAvgRating(a) - getAvgRating(b) : getAvgRating(b) - getAvgRating(a);
      })
    }
    // narrow results by end and start date
    if (searchEDate && searchSDate) {
      setPstay('true');
      searchArray = searchArray.filter((element) => {
        let display = false;
        for (const date of element.availability) {
          const start = parse(date.start, 'dd LLLL y', new Date());
          const end = parse(date.end, 'dd LLLL y', new Date());
          if (start >= new Date(searchSDate) && end <= new Date(searchEDate)) display = true;
        }
        return display;
      })
    } else {
      setPstay('false');
    }
    setDisplayList(searchArray);
  }

  return (
    <div>
      {/* filter window */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <Paper>
          <form onSubmit={(event) => {
            event.preventDefault()
            setOpen(false)
          }}>
            <Typography component={'span'}>Number of Bedrooms</Typography>
            <Stack direction='row'>
              <TextField id="min-bed" label="Min" variant="outlined" onChange={(event) => setBedMin(event.target.value)}/>
              <TextField id="max-bed" label="Max" variant="outlined" onChange={(event) => setBedMax(event.target.value)}/>
            </Stack>
            <Typography component={'span'}>Availability</Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Stack direction='row'>
                  <Typography component={'span'}>
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
              <InputLabel id="demo-simple-select-label">Sort by</InputLabel>
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

      {/* search bar */}
      <Stack direction="row" spacing={3}>
        <Container>
          <TextField label="Search for listing" variant="outlined" onChange={(event) => setString(event.target.value)} fullWidth/>
          <div style={{ maxWidth: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Typography>Bedrooms: {(searchBedMin && searchBedMax) && `${searchBedMin} - ${searchBedMax}` } </Typography>
            <Typography>Dates: {(searchSDate && searchEDate) && `${searchSDate} - ${searchEDate}` }</Typography>
            <Typography>Price: {(searchPriceMin && searchPriceMax) && `${searchPriceMin} - ${searchPriceMax}` }</Typography>
            <Typography>Rating: {(searchRating) && `${searchRating}` }</Typography>
          </div>
        </Container>
        <Stack>
          <Button variant="outlined" onClick={() => search()}>Search</Button>
          <Button variant="outlined" onClick={() => setOpen(true)}>Filter</Button>
        </Stack>
      </Stack>

      {/* listings */}
      <div style={{ height: '75vh', maxWidth: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ height: '100%', maxWidth: '100%', overflowX: 'auto', mb: 3 }}>
          <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />} sx={{ mb: 3 }}>
            {displayList.map((listing) => {
              return (
                <Box key={listing.id}>
                  <Container maxWidth="sm">
                  <Stack spacing={2}>
                    <Typography variant="h4">
                    {listing.title}
                    </Typography>
                    <Image src={listing.thumbnail ? listing.thumbnail : 'https://static.thenounproject.com/png/340719-200.png'} />
                    <Rating name="read-only" value={getAvgRating(listing.reviews)} readOnly />
                    <Typography variant="body1">
                      {listing.reviews.length} Reviews
                    </Typography>
                    <Button variant="outlined" component={Link} to={`/generallisting/${listing.id}/${pstay}`}>View</Button>
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
