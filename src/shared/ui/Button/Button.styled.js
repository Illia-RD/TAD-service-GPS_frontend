import styled, { css } from 'styled-components';

export const StyledButton = styled.button`
  padding: 10px 20px;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  border: none;

  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'primary':
        return css`
          background: ${theme.colors.primary.main};
          color: #ffffff;
          &:hover {
            background: ${theme.colors.primary.hover};
          }
        `;
      case 'danger':
        return css`
          background: ${theme.colors.status.error};
          color: #ffffff;
          &:hover {
            background: ${theme.colors.status.errorBg};
            color: ${theme.colors.status.error};
          }
        `;
      case 'outline':
        return css`
          background: transparent;
          border: 1px solid ${theme.colors.border};
          color: ${theme.colors.text.secondary};
          &:hover {
            background: ${theme.colors.surfaceAlt};
            color: ${theme.colors.text.primary};
          }
        `;
      default:
        return css`
          background: ${theme.colors.surfaceAlt};
          color: ${theme.colors.text.primary};
          &:hover {
            background: ${theme.colors.border};
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
