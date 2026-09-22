import styled from 'styled-components';

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
