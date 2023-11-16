import React from 'react';
import { Button } from '@mui/material';

export function ButtonStandard (props) {
  return (
    <div>
        {props.enabled
          ? <Button type={props.submit ? 'submit' : 'button'} color={props.color} variant="contained">{props.text}</Button>
          : <Button color={props.color} variant="contained" disabled>{props.text}</Button>}
    </div>
  )
}
