import styled from 'styled-components';

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  width: 100%;
`;

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    margin: 0;
    color: ${({ theme }) => theme.colors?.text?.primary || '#333'};
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
`;
