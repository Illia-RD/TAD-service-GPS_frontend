import styled from 'styled-components';

export const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
`;

export const DesktopView = styled.div`
  display: none;
  @media (min-width: 768px) {
    display: block;
  }
`;

export const MobileView = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  @media (min-width: 768px) {
    display: none;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;

  th,
  td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    font-size: 14px;
    color: ${({ theme }) => theme.colors.text.primary};
  }

  th {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

export const EmptyRow = styled.td`
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: 24px !important;
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:active {
    background: ${({ theme }) => theme.colors.surfaceAlt};
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

export const CardTitle = styled.div`
  font-weight: 700;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const CardSubtitle = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 8px;
`;

export const CardBadges = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

export const CardExpandedContent = styled.div`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.primary};

  strong {
    color: ${({ theme }) => theme.colors.text.secondary};
    font-weight: 500;
  }
`;

export const Badge = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;

  background: ${({ theme, $variant }) => {
    switch ($variant) {
      case 'new':
        return theme.colors.status.infoBg;
      case 'in_stock':
      case 'used':
        return theme.colors.status.warningBg;
      case 'repair':
        return theme.colors.status.errorBg;
      default:
        return theme.colors.primary.light;
    }
  }};

  color: ${({ theme, $variant }) => {
    switch ($variant) {
      case 'new':
        return theme.colors.status.info;
      case 'in_stock':
      case 'used':
        return theme.colors.status.warning;
      case 'repair':
        return theme.colors.status.error;
      default:
        return theme.colors.primary.main;
    }
  }};
`;

export const ActionButtonCell = styled.td`
  text-align: right !important;
`;

export const HistoryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.colors.primary.main};
    border-color: ${({ theme }) => theme.colors.primary.main};
    background: ${({ theme }) => theme.colors.primary.light};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.surfaceAlt};
    color: ${({ theme }) => theme.colors.border};
    cursor: not-allowed;
  }
`;

export const FormWrapper = styled.form`
  padding: 24px;
`;

export const FormTitle = styled.h3`
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const FieldGroup = styled.div`
  margin-bottom: 16px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const ActionsRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;
