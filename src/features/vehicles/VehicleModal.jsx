import React from 'react';
import { Overlay, ModalContent, CloseButton } from './VehicleModal.styled';

export const VehicleModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <Overlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        {children}
      </ModalContent>
    </Overlay>
  );
};
