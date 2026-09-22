import React from 'react';
import { StyledInput, StyledSelect } from './Input.styled';

export const Input = props => {
  return <StyledInput {...props} />;
};

export const Select = props => {
  return <StyledSelect {...props} />;
};
