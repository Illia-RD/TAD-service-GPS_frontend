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

  @media (max-width: 768px) {
    padding: 0; /* На мобілці на весь екран */
  }
`;

export const ModalContainer = styled.div`
  background: white;
  border-radius: 12px;
  width: 95%;
  max-width: 1000px;
  height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;

  @media (max-width: 768px) {
    width: 100%;
    height: 100dvh; /* dvh вирішує проблему з панеллю Safari/Chrome */
    border-radius: 0;
  }
`;

export const Header = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: bold;
  color: #0f172a;

  @media (max-width: 768px) {
    font-size: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
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

  @media (max-width: 768px) {
    flex-direction: column; /* На мобілці сайдбар стає шапкою */
  }
`;

export const Sidebar = styled.div`
  width: 260px;
  padding: 20px;
  background: #f8fafc;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 100%;
    padding: 12px 16px;
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
    flex-shrink: 0;
  }
`;

export const SettingsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr; /* Три інпути в один рядок на мобілці */
    gap: 8px;
  }
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  white-space: nowrap;
`;

export const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  font-size: 14px;
  outline: none;
  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
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
  font-size: 14px;
  @media (max-width: 768px) {
    margin-bottom: 12px;
  }
`;

export const ContentArea = styled.div`
  flex: 1;
  padding: 20px;
  background: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 12px;
    padding-bottom: 80px; /* Місце для нижньої панелі кнопок */
  }
`;

export const TabHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
`;

export const TabGroup = styled.div`
  display: flex;
  gap: 6px;
  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr; /* Таби на всю ширину */
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
      ? `border: none; background: #e0e7ff; color: #4f46e5;`
      : `border: 1px solid #cbd5e1; background: white; color: #64748b;`}
  &:hover {
    ${({ $active }) => !$active && `background: #f1f5f9;`}
  }
`;

/* Обгортка для друку / таблиць */
export const PrintContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  padding: 16px;

  @media (max-width: 768px) {
    padding: 0;
    border: none;
    background: transparent;
  }
`;

/* ПК версія: колонки */
export const ColumnsContainer = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: flex-start;
`;

export const ColumnTable = styled.table`
  border-collapse: collapse;
  text-align: center;
  border: 1px solid #cbd5e1;
  width: 140px;
  background: white;

  th {
    padding: 6px;
    background: #e2e8f0;
    border: 1px solid #cbd5e1;
    font-size: 12px;
    font-weight: bold;
  }
  td {
    padding: 4px;
    border: 1px solid #cbd5e1;
    font-size: 12px;
  }
`;

/* Мобільна версія: одна суцільна таблиця зі Sticky Header */
export const MobileTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  overflow: hidden;

  th {
    padding: 10px;
    background: #e2e8f0;
    border: 1px solid #cbd5e1;
    font-size: 13px;
    font-weight: bold;
    position: sticky;
    top: 0; /* Прилипає до верху при скролі */
    z-index: 10;
  }
  td {
    padding: 8px;
    border: 1px solid #cbd5e1;
    font-size: 14px;
  }
`;

/* Нижня панель дій для мобілки */
export const MobileBottomBar = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 8px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    padding: 12px;
    border-top: 1px solid #e2e8f0;
    box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.05);
    z-index: 20;
  }
`;

export const ActionBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  color: white;
  background: ${({ $color }) => $color || '#475569'};

  &:hover {
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    padding: 10px;
    font-size: 13px;
  }
`;
