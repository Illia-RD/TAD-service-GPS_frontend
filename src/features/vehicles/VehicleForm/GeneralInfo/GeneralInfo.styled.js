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
  box-sizing: border-box; /* <--- Додаємо це */
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 14px;
  color: #1e293b;
  outline: none;
  background-color: #ffffff;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
  }

  &::placeholder {
    color: #94a3b8;
  }
`;
export const Select = styled.select`
  box-sizing: border-box; /* <--- Додаємо це */
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 14px;
  color: #1e293b;
  outline: none;
  background-color: #ffffff;

  &:focus {
    border-color: #3b82f6;
  }
`;
