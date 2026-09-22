import styled from 'styled-components';

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.borderFocus};
    border-radius: 4px;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 14px;
`;

export const Th = styled.th`
  background: ${({ theme }) => theme.colors.surfaceAlt};
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: 16px;
  font-weight: 600;
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
  white-space: nowrap;

  &.sticky-left {
    position: sticky;
    left: 0;
    z-index: 10;
    box-shadow: inset -1px 0 0 ${({ theme }) => theme.colors.border};
  }

  &.sticky-right {
    position: sticky;
    right: 0;
    z-index: 10;
    box-shadow: inset 1px 0 0 ${({ theme }) => theme.colors.border};
  }
`;

export const Td = styled.td`
  padding: 16px;
  color: ${({ theme }) => theme.colors.text.primary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  vertical-align: top;

  &.sticky-left {
    position: sticky;
    left: 0;
    z-index: 5;
    background: ${({ theme }) => theme.colors.surface};
    box-shadow: inset -1px 0 0 ${({ theme }) => theme.colors.border};
  }

  &.sticky-right {
    position: sticky;
    right: 0;
    z-index: 5;
    background: ${({ theme }) => theme.colors.surface};
    box-shadow: inset 1px 0 0 ${({ theme }) => theme.colors.border};
  }
`;

export const Tr = styled.tr`
  &:hover {
    background: ${({ theme }) => theme.colors.surfaceAlt};
  }

  &:hover td.sticky-left,
  &:hover td.sticky-right {
    background: ${({ theme }) => theme.colors.surfaceAlt};
  }
`;

export const SecondaryText = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 4px;
`;

export const EquipmentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
`;
