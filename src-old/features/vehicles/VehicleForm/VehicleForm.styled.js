import styled from 'styled-components';

export const FormWrapper = styled.div`
  max-width: 900px; /* Обмежимо ширину форми для зручного читання */
  margin: 0 auto;
  padding: 24px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

export const FormTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 24px;
  font-size: 24px;
  color: #1e293b;
  border-bottom: 2px solid #f1f5f9;
  padding-bottom: 12px;
`;

export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
`;

export const Button = styled.button`
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: #ffffff;
  color: #475569;
  border: 1px solid #cbd5e1;

  &:hover {
    background-color: #f8fafc;
    color: #1e293b;
  }
`;

export const SaveButton = styled(Button)`
  background-color: #3b82f6;
  color: #ffffff;
  border-color: #3b82f6;

  &:hover {
    background-color: #2563eb;
    border-color: #2563eb;
    color: #ffffff;
  }
`;
