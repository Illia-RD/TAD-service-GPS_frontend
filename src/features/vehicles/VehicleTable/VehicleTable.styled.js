import styled from 'styled-components';

export const TableContainer = styled.div`
  overflow-x: auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

export const Th = styled.th`
  background: #f8fafc;
  color: #64748b;
  font-weight: 600;
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 14px;
`;

export const Td = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  color: #1e293b;
  font-size: 14px;
  vertical-align: middle;
`;

export const Badge = styled.span`
  background: #e2e8f0;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  color: #1e293b;
  display: inline-block;

  &.primary {
    background: #dbeafe;
    color: #1e40af;
  }
`;

export const ActionButton = styled.button`
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  padding: 0;
  transition: all 0.2s;

  &:hover {
    background: #e2e8f0;
    color: #0f172a;
  }
`;
