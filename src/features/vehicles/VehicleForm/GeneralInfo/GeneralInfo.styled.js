import styled from 'styled-components';

export const FormGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 24px;
`;

export const Label = styled.label`
  display: block;
  font-size: 12px;
  color: #64748b;
  margin-bottom: 4px;
  font-weight: 600;
`;

export const Input = styled.input`
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  width: 100%;
  box-sizing: border-box;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 1px #2563eb;
  }
`;
