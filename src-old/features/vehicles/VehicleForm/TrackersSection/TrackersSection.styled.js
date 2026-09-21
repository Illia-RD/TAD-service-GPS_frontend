import styled from 'styled-components';

export const SectionContainer = styled.div`
  margin-bottom: 24px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
`;

export const SectionHeader = styled.div`
  background: #f8fafc;
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: #0f172a;
`;

export const TrackerItemBox = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  background: #fafafa;
  &:last-child {
    border-bottom: none;
  }
`;

export const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #2563eb;
  background: none;
  border: none;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 8px 12px;
  &:hover {
    background: #eff6ff;
    border-radius: 6px;
  }
`;

export const RemoveBtn = styled.button`
  background: #fee2e2;
  color: #ef4444;
  border: none;
  border-radius: 6px;
  padding: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: #fca5a5;
  }
`;
