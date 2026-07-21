import styled from 'styled-components';

export const AppContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial,
    sans-serif;
  background-color: #f1f5f9;
  min-height: 100vh;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e2e8f0;
`;

export const Title = styled.h1`
  color: #1e293b;
  margin: 0;
  font-size: 24px;
`;

export const Nav = styled.nav`
  display: flex;
  gap: 10px;
`;

export const TabButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  background-color: ${props => (props.$active ? '#2563eb' : '#e2e8f0')};
  color: ${props => (props.$active ? 'white' : '#64748b')};

  &:hover {
    background-color: ${props => (props.$active ? '#1d4ed8' : '#cbd5e1')};
  }
`;
