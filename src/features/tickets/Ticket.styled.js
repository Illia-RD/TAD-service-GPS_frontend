import styled from 'styled-components';


// --- Стилі Картки ---
export const CardContainer = styled.div`
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 5px solid ${props => props.priorityColor || '#3b82f6'};
  margin-bottom: 12px;
  cursor: grab;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 12px;
  color: #64748b;
`;

export const BadgeGroup = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
`;

export const Badge = styled.span`
  background: ${props => props.bg || '#f1f5f9'};
  color: ${props => props.color || '#475569'};
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
`;

export const CardTitle = styled.h4`
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #1e293b;
  line-height: 1.4;
`;

export const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #94a3b8;
  border-top: 1px solid #f1f5f9;
  padding-top: 10px;
`;
