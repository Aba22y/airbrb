import {
  Container,
  Rating,
  TextField,
  Snackbar,
  Alert,
  Typography,
  Stack,
  Divider,
  Button,
  Backdrop,
  Paper,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import React, { useState } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { useNavigate, useParams } from 'react-router-dom';
import { intervalToDuration, parse, format } from 'date-fns';
import axios from 'axios';
import { ListingReview } from './ListingReview';

export function GeneralListing (props) {
  let { id, pstay } = useParams();
  const navigate = useNavigate()
  const [bookStart, setBookStart] = useState(null);
  const [bookEnd, setBookEnd] = useState(null);
  const [listing, setListingDetails] = React.useState({ metadata: { propertyImages: [], amenities: [] }, availability: [], reviews: [] });
  const [userBookings, setUserBookings] = React.useState([]);

  const [openBooking, setOpenBooking] = React.useState(false);
  const [bookSuccess, setBookSuccess] = React.useState(false);

  const [openReview, setOpenReview] = React.useState(false);
  const [idToReview, setIdToReview] = React.useState('');
  const [comment, setComment] = React.useState('');
  const [rating, setRating] = React.useState(0);

  pstay = (pstay === 'true');
  // get a listing and all of its bookings
  React.useEffect(() => {
    const fetchListingData = async () => {
      try {
        const listingData = await axios.get(`http://localhost:5005/listings/${id}`);
        if (props.token) {
          const allBookingsRes = await axios.get('http://localhost:5005/bookings', { headers: { Authorization: `Bearer ${props.token}` } });
          const allBookings = allBookingsRes.data.bookings;
          const userBookings = allBookings.filter((element) => {
            return element.owner === localStorage.getItem('email');
          })
          setUserBookings(userBookings);
        }
        setListingDetails(listingData.data.listing);
      } catch (error) {
        props.setError(error.response.data.error);
      }
    }
    fetchListingData();
  }, [])

  // get number of days in an range
  const getDays = (date1, date2) => {
    const { days } = intervalToDuration({
      start: date1,
      end: date2
    });
    return parseInt(days, 10);
  }

  return (
    <Container maxWidth="sm">
      <Snackbar open={bookSuccess} autoHideDuration={6000} onClose={() => setBookSuccess(false)}>
        <Alert severity="success" sx={{ width: '100%' }}>
          Booking made successfully!
        </Alert>
      </Snackbar>

      <Typography variant='h4'> {listing.title}</Typography>
      <Typography variant='body1'>Type: {listing.metadata.type}</Typography>
      <Typography variant='body1'>Address: {listing.address}</Typography>
      <Typography variant='body1'>Amenities: {listing.metadata.amenities.toString()}</Typography>
      <Typography variant='body1'>Number of Beds: {listing.metadata.nbed}</Typography>
      <Typography variant='body1'>Number of Bathrooms: {listing.metadata.nbath}</Typography>
      <Typography component={'span'} variant='body1'>Price: {pstay
        ? listing.availability.map((element, index) => {
          const date1 = parse(element.start, 'dd LLLL y', new Date());
          const date2 = parse(element.end, 'dd LLLL y', new Date());
          return (
            <Typography key={index}>{`Staying ${index + 1}: ${element.start} to ${element.end} $${getDays(date1, date2) * parseInt(listing.price, 10)}`}</Typography>
          );
        })
        : <Typography>$ {`${listing.price}`} per night</Typography>}
      </Typography>

      {/* images */}
      <ImageList sx={{ width: 500, height: 300 }} cols={3} rowHeight={164}>
        <ImageListItem>
          <img
            src={listing.thumbnail}
            loading="lazy"
          />
        </ImageListItem>
        {listing.metadata.propertyImages.map((item, index) => (
          <ImageListItem key={`image ${index}`}>
            <img
              src={item}
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList>

      {/* reviews */}
      <Container>
        <div style={{ height: '100%', maxWidth: '100%', overflowX: 'auto', mb: 3 }}>
          <Stack direction="row" spacing={2} divider={<Divider flexItem />}>
            {listing.reviews.map((review, index) => {
              return (
                <ListingReview key={index} rating={review.rating} comment={review.comment}/>
              );
            })}
          </Stack>
        </div>
      </Container>

      {/* bookings made by the user */}
      <List
          sx={{
            width: '100%',
            bgcolor: 'background.paper',
            position: 'relative',
            overflow: 'auto',
            maxHeight: 300,
            '& ul': { padding: 0 },
          }}>
            {userBookings.map((element, index) => {
              return (
                <ListItem key={index}>
                  <ListItemText primary={`Booking from ${element.dateRange.start} to ${element.dateRange.end} - Status ${element.status}`} />
                  {element.status === 'pending'
                    ? <Button variant='contained' disabled>Review</Button>
                    : <Button variant='contained' onClick={() => {
                      setIdToReview(element.id);
                      setOpenReview(true);
                    }}>Review</Button>
                  }
                </ListItem>
              );
            })}
      </List>

      {/* opens Booking menu */}
      {props.token &&
      <div>
        <Button variant="contained" onClick={() => setOpenBooking(true)}>Make Booking</Button>
      </div>
      }

      {/* rating menu */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openReview}
      >
        <Paper>
          <Typography variant='body1'>{rating}/5</Typography>
          <Rating
          value={rating}
          onChange={(event, newValue) => {
            setRating(newValue);
          }}
          />
          <TextField
          id="outlined-multiline-static"
          label="Comment"
          multiline
          rows={2}
          fullWidth
          onChange={(event) => setComment(event.target.value)}
          />
          <Button variant='outline' onClick={async () => {
            try {
              const review = { rating, comment };
              await axios.put(`http://localhost:5005/listings/${id}/review/${idToReview}`,
                { review },
                { headers: { Authorization: `Bearer ${props.token}` } }
              );
              setOpenReview(false);
              navigate('/')
            } catch (error) {
              props.setError(error.response.data.error);
            }
          }}> Submit Review </Button>
        </Paper>
      </Backdrop>

      {/* make a booking request */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBooking}
      >
        <Paper>
          <Typography variant='h4'>New booking</Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack direction='row'>
              <Typography component={'span'} variant='body1'>
                From:
                <DatePicker id="start-date" value={null} onChange={(value) => setBookStart(new Date(value))} />
                To:
                <DatePicker id="end-date" value={null} onChange={(value) => setBookEnd(new Date(value))} />
              </Typography>
            </Stack>
          </LocalizationProvider>
          <Button variant='outline' onClick={async () => {
            try {
              const totalPrice = getDays(bookStart, bookEnd) * parseInt(listing.price, 10);
              const date1 = format(bookStart, 'dd LLLL y');
              const date2 = format(bookEnd, 'dd LLLL y');
              const dateRange = { start: date1, end: date2 };
              await axios.post(`http://localhost:5005/bookings/new/${id}`,
                { dateRange, totalPrice },
                { headers: { Authorization: `Bearer ${props.token}` } });
              setBookSuccess(true);
              navigate('/')
            } catch (error) {
              props.setError(error.response.data.error);
            }
          }}>Create</Button>
          <Button variant='outline' onClick={() => setOpenBooking(false)}>Close</Button>
        </Paper>
      </Backdrop>
    </Container>
  )
}
