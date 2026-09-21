import styled from 'styled-components';

export const TrashContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

export const Header = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h2 {
    margin: 0;
    font-size: 20px;
    color: #0f172a;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

export const TabsWrapper = styled.div`
  display: flex;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
`;

export const TabButton = styled.button`
  flex: 1;
  padding: 14px;
  border: none;
  background: ${props => (props.$active ? '#eff6ff' : 'transparent')};
  color: ${props => (props.$active ? '#2563eb' : '#64748b')};
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-bottom: ${props =>
    props.$active ? '2px solid #2563eb' : '2px solid transparent'};
  transition: all 0.2s;

  &:hover {
    background: ${props => (props.$active ? '#eff6ff' : '#f1f5f9')};
  }
`;

export const ContentWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background: #f8fafc;
  min-height: 400px;
`;

export const EmptyState = styled.div`
  text-align: center;
  color: #94a3b8;
  padding: 60px 20px;
  font-size: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

export const TrashItemCard = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  padding: 16px 20px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  strong {
    color: #0f172a;
    font-size: 15px;
  }

  .date {
    font-size: 13px;
    color: #ef4444;
  }

  .sub-text {
    font-size: 13px;
    color: #64748b;
  }
`;

export const RestoreBtn = styled.button`
  background: #dcfce7;
  border: 1px solid #bbf7d0;
  color: #166534;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  transition: all 0.2s;

  &:hover {
    background: #bbf7d0;
  }
`;

export const WarningBanner = styled.div`
  padding: 14px 24px;
  background: #fffbeb;
  border-top: 1px solid #fde047;
  font-size: 13px;
  color: #92400e;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;
