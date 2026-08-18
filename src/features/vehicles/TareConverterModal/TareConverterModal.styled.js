import styled from 'styled-components';

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(15, 23, 42, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
`;

export const ModalContainer = styled.div`
  background: white;
  border-radius: 12px;
  width: 95%;
  max-width: 900px;
  height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

  /* === АДАПТАЦІЯ ДЛЯ МОБІЛОК === */
  @media (max-width: 768px) {
    width: 100%;
    height: 100vh;
    border-radius: 0;
    max-width: 100%;
  }
`;

export const Header = styled.div`
  padding: 16px 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: bold;
  color: #0f172a;
`;

export const CloseBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;

  &:hover {
    background: #e2e8f0;
    color: #0f172a;
  }
`;

export const ModalBody = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;

  /* === АДАПТАЦІЯ ДЛЯ МОБІЛОК === */
  @media (max-width: 768px) {
    flex-direction: column;
    overflow-y: auto;
  }
`;

export const Sidebar = styled.div`
  width: 250px;
  padding: 16px; // Зменшили падінг
  background: #f8fafc;
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 100%;
    padding: 10px;
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
  }
`;
export const ContentArea = styled.div`
  flex: 1;
  padding: 24px;
  background: white;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

export const InputGroup = styled.div`
  margin-bottom: 10px; // Зменшили відступ
`;

export const Label = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 6px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  font-size: 14px;
  box-sizing: border-box;
  outline: none;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`;
export const ActionsRow = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  width: 100%;
`;
export const NoAccessToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #dc2626;
  font-weight: bold;
  margin-bottom: 20px;
  user-select: none;
`;

export const SaveBtn = styled.button`
  width: 100%;
  padding: 10px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 10px;
  transition: background 0.2s;
  font-size: 14px;
  &:hover {
    background: #059669;
  }
`;

export const PrintBtn = styled.button`
  padding: 8px 16px;
  background: #475569;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.2s;

  &:hover {
    background: #334155;
  }
`;

export const TabBtn = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  ${({ $active }) =>
    $active
      ? `
    border: none;
    background: #e0e7ff;
    color: #4f46e5;
  `
      : `
    border: 1px solid #cbd5e1;
    background: white;
    color: #64748b;
  `}

  &:hover {
    ${({ $active }) => !$active && `background: #f1f5f9;`}
  }
`;

export const TabHeader = styled.div`
  display: flex;
  flex-direction: column; // На мобілці робимо 2 поверхи
  gap: 8px;
  margin-bottom: 16px;

  @media (min-width: 500px) {
    flex-direction: row; // На десктопі повертаємо в 1 рядок
  }
`;

export const PrintContainer = styled.div`
  overflow-y: auto;
  flex: 1;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: center;
`;

export const Thead = styled.thead`
  background: #f8fafc;
  position: sticky;
  top: 0;
`;

export const Th = styled.th`
  padding: 12px;
  border-bottom: 2px solid #e2e8f0;
  color: #475569;
  font-weight: 600;
`;

export const Tr = styled.tr`
  border-bottom: 1px solid #f1f5f9;
  &:hover {
    background: #f8fafc;
  }
`;

export const Td = styled.td`
  padding: 10px;
  color: #0f172a;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #64748b;
  text-align: center;

  h3 {
    margin-bottom: 8px;
    color: #334155;
  }
  p {
    font-size: 14px;
  }
`;
export const ColumnsContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
`;

export const ColumnTable = styled.table`
  border-collapse: collapse;
  text-align: center;
  border: 1px solid #cbd5e1;
  width: 130px; /* При 130px + 130px + 10px gap = 270px воно точно влізе в 475px */
  background: white;

  th {
    padding: 4px;
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    font-size: 11px;
    color: #475569;
  }

  td {
    padding: 2px 4px;
    border: 1px solid #cbd5e1;
    font-size: 11px;
    color: #0f172a;
  }
`;
