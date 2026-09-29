import styled from 'styled-components';

export const ActionBarWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.colors?.surfaceAlt || '#e8f0fe'};
  padding: 12px 16px;
  border-radius: ${({ theme }) => theme.radii?.md || '8px'};
  border: 1px solid ${({ theme }) => theme.colors?.primary?.main || '#007bff'};
  animation: slideDown 0.2s ease-out;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const SelectionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.text?.primary || '#333'};
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

export const ActionBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  color: ${({ $danger, theme }) =>
    $danger ? 'red' : theme.colors?.text?.primary || '#333'};
  transition: all 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: ${({ $danger, theme }) =>
      $danger ? 'darkred' : theme.colors?.primary?.main || '#007bff'};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;
