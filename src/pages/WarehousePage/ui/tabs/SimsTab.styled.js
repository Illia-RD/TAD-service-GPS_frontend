import styled from 'styled-components';

export const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;

  th,
  td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    font-size: 14px;
  }

  th {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

export const Badge = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background: ${({ theme }) => theme.colors.primary}20;
  color: ${({ theme }) => theme.colors.primary};
`;

export const EmptyRow = styled.td`
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const FormWrapper = styled.form`
  padding: 24px;
`;

export const FormTitle = styled.h3`
  margin-bottom: 16px;
`;

export const FieldGroup = styled.div`
  margin-bottom: 16px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const ActionsRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;
