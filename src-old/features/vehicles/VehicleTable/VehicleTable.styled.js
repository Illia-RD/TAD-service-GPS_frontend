import styled from 'styled-components';

export const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  /* Щоб скролбар виглядав акуратно */
  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 13px; /* Трохи менший шрифт, щоб більше влізло */
`;

export const Th = styled.th`
  background-color: #f8fafc;
  color: #475569;
  font-weight: 600;
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap; /* Заголовки не переносяться */
  &.sticky-left {
    position: sticky;
    left: 0;
    z-index: 10;
    background-color: #f8fafc;
    box-shadow: inset -1px 0 0 #e2e8f0; /* Тонка лінія-розділювач */
  }
  &.sticky-right {
    position: sticky;
    right: 0;
    z-index: 10;
    background-color: #f8fafc;
    box-shadow: inset 1px 0 0 #e2e8f0;
  }
`;

export const Td = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  color: #1e293b;
  vertical-align: top; /* Вирівнюємо по верху, бо елементів може бути кілька */
  /* ДОДАЄМО КЛАСИ ДЛЯ ЗАКРІПЛЕННЯ */
  &.sticky-left {
    position: sticky;
    left: 0;
    z-index: 5;
    background-color: inherit; /* Успадковує колір ховеру від Tr */
    box-shadow: inset -1px 0 0 #e2e8f0;
  }
  &.sticky-right {
    position: sticky;
    right: 0;
    z-index: 5;
    background-color: inherit;
    box-shadow: inset 1px 0 0 #e2e8f0;
  }
`;

export const Tr = styled.tr`
  background-color: #ffffff;
  &:hover {
    background-color: #f8fafc;
  }
  &:last-child td {
    border-bottom: none;
  }
`;

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
`;

export const StackedItem = styled.div`
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 6px 10px;
  margin-bottom: 6px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const ExpandBtn = styled.button`
  background: none;
  border: none;
  color: #2563eb;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  padding: 4px 0 0 0;
  display: inline-flex;
  align-items: center;

  &:hover {
    text-decoration: underline;
  }
`;

export const ActionBtn = styled.button`
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s;

  &:hover {
    background: #e2e8f0;
    color: #0f172a;
  }
`;
