import React, { useEffect } from 'react';
import { Overlay, ModalBox } from './Modal.styled';

export const Modal = ({ children, onClose }) => {
  // Закриття модалки по кнопці Escape
  useEffect(() => {
    const handleEsc = e => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Закриття при кліку на темний фон (overlay)
  const handleOverlayClick = e => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <Overlay onClick={handleOverlayClick}>
      <ModalBox>{children}</ModalBox>
    </Overlay>
  );
};
