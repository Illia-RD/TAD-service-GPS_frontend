import styled from 'styled-components';

export const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

export const TarRow = styled.div`
  display: grid;
  /* 6 колонок: Зірочка | Основна зона | Око | Редагувати | Авто | Видалити */
  grid-template-columns: 40px 1fr 50px 50px 50px 50px;
  align-items: stretch;
  background: ${({ $selected, theme }) =>
    $selected
      ? theme.colors?.surfaceAlt || '#e8f0fe'
      : theme.colors?.surface || '#fff'};

  /* Чітке виділення без зміщення розмірів */
  border: 1px solid
    ${({ $selected, theme }) =>
      $selected
        ? theme.colors?.primary?.main || '#007bff'
        : theme.colors?.border || '#ccc'};
  box-shadow: ${({ $selected, theme }) =>
    $selected
      ? `0 0 0 1px ${theme.colors?.primary?.main || '#007bff'}`
      : 'none'};

  border-radius: ${({ theme }) => theme.radii?.md || '8px'};
  cursor: default;
  user-select: none;
  transition: all 0.2s;
  min-height: 56px;
  width: 100%;
  position: relative;

  &:hover {
    border-color: ${({ theme }) => theme.colors?.primary?.main || '#007bff'};
  }

  @media (max-width: 768px) {
    grid-template-columns: 40px 1fr;
    padding-right: 16px;

    border: 2px solid
      ${({ $selected, theme }) =>
        $selected ? theme.colors?.primary?.main || '#007bff' : 'transparent'};
    box-shadow: none;
    background: ${({ $selected, theme }) =>
      $selected
        ? theme.colors?.surfaceAlt || '#f0f7ff'
        : theme.colors?.surface || '#fff'};

    .hide-on-mobile {
      display: none !important;
    }
  }
`;

export const Cell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  cursor: pointer;
`;

export const MobileCheckIndicator = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    position: absolute;
    top: 10px;
    right: 10px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 2px solid
      ${({ $selected, theme }) =>
        $selected
          ? theme.colors?.primary?.main || '#007bff'
          : theme.colors?.border || '#cbd5e1'};
    background: ${({ $selected, theme }) =>
      $selected
        ? theme.colors?.primary?.main || '#007bff'
        : 'rgba(255, 255, 255, 0.8)'};
    align-items: center;
    justify-content: center;
    opacity: ${({ $show }) => ($show ? 1 : 0)};
    transition: all 0.2s ease;
    pointer-events: none;
    z-index: 2;
  }
`;

export const MainInfoCell = styled.div`
  display: grid;
  grid-template-columns: 1fr 180px 120px;
  align-items: center;
  gap: 16px;
  padding: 8px 12px;
  height: 100%;
  cursor: pointer;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    padding: 12px 8px;
  }
`;

export const FileName = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.text?.primary || '#333'};
  word-break: break-word;
`;

export const FileMeta = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors?.text?.muted || '#777'};
  white-space: normal;
`;

export const ActionIconBtn = styled.button`
  background: transparent;
  border: none;
  border-left: 1px solid ${({ theme }) => theme.colors?.border || '#eee'};
  cursor: pointer;
  color: ${({ theme }) => theme.colors?.text?.muted || '#777'};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  transition: all 0.2s;
  border-radius: 0;

  &:hover {
    color: ${({ theme, $color }) =>
      $color || theme.colors?.primary?.main || '#007bff'};
    background: rgba(0, 0, 0, 0.05);
  }

  &:last-child {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }
`;
