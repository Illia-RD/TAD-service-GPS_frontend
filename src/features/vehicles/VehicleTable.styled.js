import styled from 'styled-components';

export const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 1200px; /* Зробив ширше, щоб було куди скролити */
`;

export const Th = styled.th`
  background: #f8fafc;
  padding: 12px;
  text-align: left;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
`;

export const StickyTh = styled(Th)`
  position: sticky;
  z-index: 10; /* Підняв z-index */
  background: #f8fafc;
`;

export const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
`;

export const StickyTd = styled(Td)`
  position: sticky;
  z-index: 5;
  background: white; /* Це лікує налізання тексту! */
`;

export const Tr = styled.tr`
  &:hover td {
    background: #f1f5f9;
  }
  /* Щоб при наведенні липкі комірки теж підсвічувалися */
  &:hover ${StickyTd} {
    background: #f1f5f9;
  }
`;
