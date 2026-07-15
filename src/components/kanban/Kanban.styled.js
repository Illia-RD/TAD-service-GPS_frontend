import styled from 'styled-components';

export const BoardContainer = styled.div`
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding-bottom: 20px;
  align-items: flex-start;
  min-height: 70vh;
`;

export const ColumnWrapper = styled.div`
  background: #f8fafc;
  border-radius: 10px;
  min-width: 320px;
  width: 320px;
  padding: 15px;
  border: 1px solid #e2e8f0;
`;

export const ColumnHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;

  h3 {
    font-size: 15px;
    color: #475569;
    margin: 0;
  }

  span {
    background: #e2e8f0;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: bold;
    color: #475569;
  }
`;
