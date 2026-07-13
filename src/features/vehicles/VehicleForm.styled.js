import styled from 'styled-components';

export const FormWrapper = styled.form`
  background: white;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

export const SectionTitle = styled.h3`
  font-size: 16px;
  color: #1e293b;
  margin-bottom: 16px;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 8px;
  margin-top: 24px;
`;

export const FormGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 15px;
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
`;

export const Select = styled.select`
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  width: 100%;
  background: white;
`;

export const Button = styled.button`
  margin-top: 20px;
  padding: 12px 24px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  width: 100%;
  &:hover {
    background: #1d4ed8;
  }
`;
