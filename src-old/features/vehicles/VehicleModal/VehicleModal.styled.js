import styled from 'styled-components';

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: white;
  /* Додали padding-top 50px, щоб хрестик не залазив на заголовок форми */
  padding: 50px 24px 24px 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 32px; /* Зробили хрестик значно більшим */
  line-height: 1;
  color: #64748b;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #0f172a;
  }
`;
