import React from 'react';
import { Button } from '@mui/material';

export function FuncButton (props) {
  return (
    <div>
        {props.enabled
          ? <Button
          onClick={props.function}
          type={props.submit ? 'submit' : 'button'}
          color={props.color}
          variant="contained">{props.text}</Button>
          : <Button
          onClick={props.function}
          type={props.submit ? 'submit' : 'button'}
          color={props.color}
          variant="contained"
          disabled>{props.text}</Button>}
    </div>
  )
}
