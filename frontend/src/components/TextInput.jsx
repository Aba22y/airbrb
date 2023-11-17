import React from 'react';
import { TextField } from '@mui/material';

export function TextInput (props) {
  return (
    <TextField label={props.label} onChange={props.function} sx={{ m: 1 }} variant="outlined"/>
  );
}
