import styled from 'styled-components';

export const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
`;
export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  label {
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 4px;
    color: #475569;
  }
`;
export const Input = styled.input`
  padding: 8px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  outline: none;
  &:focus {
    border-color: #3b82f6;
  }
`;
export const Select = styled.select`
  padding: 8px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  outline: none;
  &:focus {
    border-color: #3b82f6;
  }
`;
export const SectionTitle = styled.h5`
  margin: 8px 0 4px;
  color: #1e293b;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 4px;
`;
export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
`;
export const SubmitButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  &:hover {
    background: #2563eb;
  }
  &:disabled {
    background: #94a3b8;
  }
`;
export const CancelButton = styled.button`
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #cbd5e1;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  &:hover {
    background: #e2e8f0;
  }
`;
