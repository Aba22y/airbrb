import React from 'react';
import axios from 'axios';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Chip, Button, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export function Publish (props) {
  const { id } = useParams();
  const navigate = useNavigate()
  const [availability, setAvailability] = React.useState([])
  const [publicStatus, setPublishStatus] = React.useState(null)
  const [sdate, setSdate] = React.useState(null);
  const [edate, setEdate] = React.useState(null);

  React.useEffect(() => {
    const fetchAvailabilityData = async () => {
      try {
        const listingData = await axios.get(`http://localhost:5005/listings/${id}`)
        setAvailability(listingData.data.listing.availability)
        setPublishStatus(listingData.data.listing.published)
      } catch (error) {
        props.setError(error.response.data.error)
      }
    }
    fetchAvailabilityData()
  }, [])

  async function unpublish () {
    try {
      await axios.put(`http://localhost:5005/listings/unpublish/${id}`)
      navigate('/mylistings')
    } catch (error) {
      props.setError(error.response.data.error)
    }
  }

  async function publish () {
    try {
      await axios.put(`http://localhost:5005/listings/publish/${id}`, { availability })
      navigate('/mylistings')
    } catch (error) {
      props.setError(error.response.data.error)
    }
  }

  const handleDelete = (index) => {
    const updatedArray = availability.filter((element, elementIndex) => elementIndex !== index);
    setAvailability(updatedArray);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant='h4'>Publish form</Typography>
      <Container>
        {availability.map((date, index) => {
          console.log(date)
          return (
            <Chip
              key={index}
              label={`${date.start}-${date.end}`}
              variant="outlined"
              onDelete={() => handleDelete(index)}
            />
          )
        })}
         <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Container label="Start Date">
            <DatePicker value={sdate} onChange={(value) => setSdate(value)} />
          </Container>
          <Container label="End Date">
            <DatePicker value={edate} onChange={(value) => setEdate(value)} />
          </Container>
          <Button
          variant="outlined"
          onClick={() => {
            const updatedArray = availability
            updatedArray.push({ start: sdate, end: edate })
            setAvailability(updatedArray)
          }}>
            Add
          </Button>
         </LocalizationProvider>
      </Container>
      {publicStatus
        ? <Button variant='contained' onClick={() => unpublish()}>Unpublish</Button>
        : <Button variant='contained' disabled>Unpublish</Button>
      }
      <Button variant='contained' onClick={() => publish()}>Publish</Button>
    </Container>
  )
}
