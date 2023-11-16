import axios from 'axios';
import { useParams } from 'react-router-dom';
import React from 'react';
import { Button, Container, List, ListItem, Typography } from '@mui/material';
import { parse, intervalToDuration, isThisYear, endOfYear } from 'date-fns';

export function Bookinginfo (props) {
  const { id } = useParams();
  const [listing, setListing] = React.useState({})
  const [bookings, setBookings] = React.useState([])
  const [totalBookedDays, setBookedDays] = React.useState(0)
  const [profit, setProfit] = React.useState(0)

  React.useEffect(() => {
    const fetchListingData = async () => {
      try {
        const listingData = await axios.get(`http://localhost:5005/listings/${id}`)
        if (props.token) {
          const allBookingsRes = await axios.get('http://localhost:5005/bookings', { headers: { Authorization: `Bearer ${props.token}` } })
          const allBookings = allBookingsRes.data.bookings
          const userBookings = allBookings.filter((element) => {
            return element.listingId === id
          })
          setBookings(userBookings)
        }
        setListing(listingData.data.listing)
      } catch (error) {
        props.setError(error.response.data.error)
      }
    }
    fetchListingData()
  }, [])

  const getDaysThisYear = (date1, date2) => {
    const start = parse(date1, 'dd LLLL y', new Date())
    const end = parse(date2, 'dd LLLL y', new Date())

    if (!isThisYear(start)) {
      return 0;
    } else if (!isThisYear(end)) {
      return getDaysThisYear(date1, endOfYear(new Date()));
    }

    const { days } = intervalToDuration({
      start,
      end
    })
    return parseInt(days, 10)
  }

  React.useEffect(() => {
    let totalMoney = 0
    let totalDays = 0
    bookings.forEach((booking) => {
      if (booking.status === 'accepted') {
        totalDays += getDaysThisYear(booking.dateRange.start, booking.dateRange.end)
        totalMoney += getDaysThisYear(booking.dateRange.start, booking.dateRange.end) * parseInt(listing.price, 10)
      }
    })
    setProfit(totalMoney)
    setBookedDays(totalDays)
  })

  const getOnlineTime = (date) => {
    const listingDate = new Date(date);
    const currentDate = new Date();

    const timeDifference = currentDate - listingDate;
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    return (`Days: ${days}, Hours: ${hours}`);
  }

  const decideBookingStatus = async (bookingId, status) => {
    try {
      await axios.put(`http://localhost:5005/bookings/${status}/${bookingId}`,
        {},
        { headers: { Authorization: `Bearer ${props.token}` } });
      const updatedBookings = bookings.map((booking) => {
        if (booking.id === bookingId) {
          booking.status = status === 'accept' ? 'accepted' : 'declined'
        }
        return booking
      })
      setBookings(updatedBookings)
    } catch (error) {
      props.setError(error.response.data.error)
    }
  }

  return (
    <Container maxWidth="sm">
      <Typography variant='h3'>{listing.title}</Typography>
      <Typography variant='h5'>Time since published - {getOnlineTime(listing.postedOn)}</Typography>
      <List>
        {bookings.map((element, index) => {
          return (
          <ListItem key={index}>
            <Typography variant='body1'>By: {element.owner}, From: {element.dateRange.start}, To: {element.dateRange.end}, Status: {element.status}</Typography>
            {element.status === 'pending'
              ? <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant='contained'
              sx={{ backgroundColor: '#4CAF50' }}
              onClick={() => decideBookingStatus(element.id, 'accept')}>Accept</Button>

              <Button variant='contained'
              sx={{ backgroundColor: '#FF0000' }}
              onClick={() => decideBookingStatus(element.id, 'decline')}>Decline</Button>
              </div>
              : <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant='contained' disabled>Accept</Button>

              <Button variant='contained' disabled>Decline</Button>
              </div>
            }
          </ListItem>
          )
        })}
      </List>
      <Typography variant='h5'>Profit: ${profit}, Booked for {totalBookedDays} days</Typography>
    </Container>
  )
}
