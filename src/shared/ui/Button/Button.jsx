import React from 'react';
import { StyledButton } from './Button.styled';

export const Button = ({ children, variant = 'primary', ...props }) => {
  return (
    <StyledButton $variant={variant} {...props}>
      {children}
    </StyledButton>
  );
};
