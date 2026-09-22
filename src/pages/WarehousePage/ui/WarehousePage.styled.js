import styled from 'styled-components';

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const TabsHeader = styled.div`
  display: flex;
  gap: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding-bottom: 8px;
`;

export const TabBtn = styled.button`
  background: none;
  border: none;
  padding: 8px 16px;
  font-size: 15px;
  font-weight: 500;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.text.secondary};
  border-bottom: 2px solid
    ${({ $active, theme }) => ($active ? theme.colors.primary : 'transparent')};
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: -9px;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const TabContent = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 20px;
  min-height: 400px;
`;
