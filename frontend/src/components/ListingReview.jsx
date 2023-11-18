import { Rating, Typography } from '@mui/material';
import React from 'react';

export function ListingReview (props) {
  return (
    <div>
      <Rating name="read-only" value={props.rating} readOnly />
      <Typography>{props.comment}</Typography>
    </div>
  )
}
