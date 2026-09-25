import styled from 'styled-components';

export const AppContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  flex-direction: column;
  font-family: 'Inter', sans-serif;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  position: relative; /* Важливо для абсолютного позиціонування мобільного меню */
  z-index: 50;

  h2 {
    margin: 0;
    font-size: 20px;
    color: ${({ theme }) => theme.colors.text.primary};
  }

  @media (max-width: 768px) {
    padding: 12px 16px;
  }
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;
export const BurgerButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 24px;
  cursor: pointer;
  padding: 4px;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
export const Nav = styled.nav`
  display: flex;
  gap: 8px;

  @media (max-width: 768px) {
    display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: ${({ theme }) => theme.colors.surface};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    padding: 16px;
    gap: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    z-index: 999; /* Важливо: щоб меню було поверх усього! */
  }
`;
export const TabButton = styled.button`
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary.main : 'transparent'};

  /* Тепер тягнемо контрастний колір прямо з теми */
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary.contrastText : theme.colors.text.primary};

  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: ${({ $active }) => ($active ? '600' : '500')};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ $active, theme }) =>
      $active ? theme.colors.primary.hover : theme.colors.surfaceAlt};
    color: ${({ $active, theme }) =>
      $active ? theme.colors.primary.contrastText : theme.colors.text.primary};
  }

  @media (max-width: 768px) {
    width: 100%;
    text-align: left;
    padding: 12px 16px;
  }
`;
export const ThemeToggleBtn = styled.button`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text.primary};
  padding: 6px 12px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }

  @media (max-width: 768px) {
    /* На мобілці кнопку теми можна залишити біля бургера */
    padding: 6px 8px;
  }
  display: flex;
  align-items: center;

  .theme-icon-only {
    display: none;
  }

  @media (max-width: 768px) {
    padding: 6px 8px;
    .theme-text {
      display: none;
    }
    .theme-icon-only {
      display: block;
      font-size: 16px;
    }
  }
`;
