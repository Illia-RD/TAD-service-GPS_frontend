import styled from 'styled-components';

export const FormWrapper = styled.form`
  background: white;
  /* Видалили зайві падінги та бордери, бо вони є в модалці */
`;

export const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e2e8f0;
`;

export const FormTitle = styled.h3`
  margin: 0;
  font-size: 20px;
  color: #1e293b;
`;

export const SectionTitle = styled.h4`
  font-size: 16px;
  color: #1e293b;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
  margin-top: 32px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
`;

export const Button = styled.button`
  flex: 1;
  padding: 12px 24px;
  background: ${props => (props.$secondary ? '#94a3b8' : '#2563eb')};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;

  &:hover {
    background: ${props => (props.$secondary ? '#64748b' : '#1d4ed8')};
  }
`;
