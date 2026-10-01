import styled from 'styled-components';

export const BarContainer = styled.div`
  display: none; /* НА ПК ЗНОСИМО ПОВНІСТЮ */

  /* НА МОБІЛЦІ ВІДОБРАЖАЄМО ПОВЕРХ УСЬОГО */
  @media (max-width: 768px) {
    display: ${({ $show }) => ($show ? 'flex' : 'none')};
    position: fixed;
    bottom: 24px; /* Плаває знизу екрана */
    left: 5%;
    width: 90%;
    background: ${({ theme }) => theme.colors?.surface || '#fff'};
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    border: 2px solid ${({ theme }) => theme.colors?.primary?.main || '#007bff'};
    border-radius: 12px;
    padding: 12px 16px;
    align-items: center;
    justify-content: space-between;
    z-index: 1000;
  }
`;

export const ActionsGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

export const ActionBtn = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${({ theme, $color }) =>
    $color || theme.colors?.text?.primary || '#333'};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;

  &:hover {
    opacity: 0.7;
  }
`;

export const CountBadge = styled.div`
  background: ${({ theme }) => theme.colors?.primary?.main || '#007bff'};
  color: #fff;
  font-weight: bold;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
`;
