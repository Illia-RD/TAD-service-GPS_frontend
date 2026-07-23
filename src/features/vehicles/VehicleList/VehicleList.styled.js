import styled from 'styled-components';

export const ListWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

export const ControlsContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

export const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;

  &:hover {
    background: #1d4ed8;
  }
`;

export const ViewModeButton = styled.button`
  padding: 10px;
  cursor: pointer;
  background: ${props => (props.$active ? '#e2e8f0' : 'transparent')};
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #475569;
  transition: all 0.2s;

  &:hover {
    background: #f1f5f9;
  }
`;
