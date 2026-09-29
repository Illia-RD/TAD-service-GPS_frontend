import styled from 'styled-components';

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;

  label {
    font-size: 14px;
    color: ${({ theme }) => theme.colors?.text?.muted || '#555'};
  }
`;

export const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors?.border || '#ccc'};
  border-radius: 6px;
  font-size: 14px;
  background: ${({ theme }) => theme.colors?.background || '#fff'};
  color: ${({ theme }) => theme.colors?.text?.primary || '#000'};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors?.primary?.main || '#007bff'};
  }
`;

export const SaveBtn = styled.button`
  width: 100%;
  padding: 10px;
  background: ${({ theme }) => theme.colors?.primary?.main || '#007bff'};
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;
