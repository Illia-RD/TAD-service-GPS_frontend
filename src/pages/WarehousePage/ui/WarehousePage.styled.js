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
  padding: 8px 16px;
  border: none;
  background: transparent;

  /* Активний текст - яскравий основний, неактивний - приглушений (muted) з твоєї теми */
  color: ${({ $active, theme }) =>
    $active ? theme.colors.text.primary : theme.colors.text.muted};

  /* Лінія підкреслення */
  border-bottom: 2px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.primary.main : 'transparent'};

  font-weight: ${({ $active }) => ($active ? '700' : '500')};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
    background: ${({ theme }) => theme.colors.surfaceAlt};
    border-radius: 6px 6px 0 0;
  }
`;
export const TabContent = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 20px;
  min-height: 400px;
`;
