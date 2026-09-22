import styled from 'styled-components';

export const AppContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

export const Nav = styled.nav`
  display: flex;
  gap: 10px;
`;

export const TabButton = styled.button`
  padding: 10px 20px;
  font-size: 15px;
  font-weight: 600;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  transition: all 0.2s;

  background-color: ${({ $active, theme }) =>
    $active ? theme.colors.primary.main : theme.colors.surfaceAlt};
  color: ${({ $active, theme }) =>
    $active ? '#ffffff' : theme.colors.text.secondary};

  &:hover {
    background-color: ${({ $active, theme }) =>
      $active ? theme.colors.primary.hover : theme.colors.border};
  }
`;

export const ThemeToggleBtn = styled.button`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text.primary};
  padding: 8px 16px;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderFocus};
  }
`;
