import styled from 'styled-components';

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
`;

export const ModalBox = styled.div`
  background: white;
  border-radius: 12px;
  width: 450px;
  padding: 24px;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
`;

export const CloseBtn = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  &:hover {
    color: #0f172a;
  }
`;

export const Title = styled.h3`
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #0f172a;
  font-size: 18px;
`;

export const Tabs = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 12px;
`;

export const TabBtn = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  background: ${({ $active }) => ($active ? '#eff6ff' : 'transparent')};
  color: ${({ $active }) => ($active ? '#2563eb' : '#64748b')};
`;

export const FormGroup = styled.div`
  margin-bottom: 12px;
`;

export const Row = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  > div {
    flex: 1;
  }
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 4px;
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
`;

export const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
  outline: none;
  &:focus {
    border-color: #3b82f6;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
  outline: none;
  background: white;
  &:focus {
    border-color: #3b82f6;
  }
`;

export const ActionButton = styled.button`
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  background: ${({ $color }) => $color || '#3b82f6'};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  font-size: 14px;
  &:disabled {
    opacity: 0.7;
    cursor: wait;
  }
`;
