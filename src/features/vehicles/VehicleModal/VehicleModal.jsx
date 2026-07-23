import React, { useEffect } from 'react';
import { Overlay, ModalContent, CloseButton } from './VehicleModal.styled';

export const VehicleModal = ({ isOpen, onClose, children }) => {
  // Закриття по Escape
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    // Закриття по кліку на темний фон (Overlay)
    <Overlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        {children}
      </ModalContent>
    </Overlay>
  );
};
