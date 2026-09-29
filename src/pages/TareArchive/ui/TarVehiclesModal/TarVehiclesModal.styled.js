import styled from 'styled-components';

export const VehiclesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const VehicleItem = styled.li`
  padding: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors?.border || '#eee'};
  display: flex;
  flex-direction: column;
  gap: 4px;

  &:last-child {
    border-bottom: none;
  }
`;

export const VehiclePlate = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.text?.primary || '#333'};
`;

export const TankInfo = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors?.text?.muted || '#777'};
`;

export const EmptyState = styled.p`
  color: ${({ theme }) => theme.colors?.text?.muted || '#777'};
  text-align: center;
  padding: 20px 0;
`;
