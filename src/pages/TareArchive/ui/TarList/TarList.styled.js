import styled from 'styled-components';

export const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const TarRow = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr 150px 120px 60px;
  align-items: center;
  padding: 12px 16px;
  background: ${({ $selected, theme }) =>
    $selected
      ? theme.colors?.surfaceAlt || '#e8f0fe'
      : theme.colors?.surface || '#fff'};
  border: 1px solid
    ${({ $selected, theme }) =>
      $selected
        ? theme.colors?.primary?.main || '#007bff'
        : theme.colors?.border || '#ccc'};
  border-radius: ${({ theme }) => theme.radii?.md || '8px'};
  cursor: pointer;
  user-select: none;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border-color: ${({ theme }) => theme.colors?.primary?.main || '#007bff'};
  }

  @media (max-width: 768px) {
    grid-template-columns: 40px 1fr;
    .hide-on-mobile {
      display: none;
    }
  }
`;

export const FileName = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.text?.primary || '#333'};
`;

export const FileMeta = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors?.text?.muted || '#777'};
  margin-top: 4px;
`;

export const ActionIconBtn = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors?.text?.muted || '#777'};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors?.primary?.main || '#007bff'};
    background: rgba(0, 0, 0, 0.05);
  }
`;
