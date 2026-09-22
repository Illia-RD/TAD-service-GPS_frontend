import styled from 'styled-components';

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.xl};
  box-shadow: ${({ theme }) => theme.shadows.md};
  border-left: 5px solid ${({ theme }) => theme.colors.primary.main};
  display: flex;
  flex-direction: column;
  transition: all 0.2s;
  overflow: hidden;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.lg};
    transform: translateY(-2px);
  }
`;

export const CardBody = styled.div`
  padding: 20px;
  flex: 1;
`;

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
`;

export const TitleBlock = styled.div`
  flex: 1;
  min-width: 0; /* Дозволяє обрізати довгий текст всередині flex */
`;

export const Title = styled.h3`
  margin: 0 0 4px 0;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const SubTitle = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.secondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const BadgeContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
`;

export const Badge = styled.span`
  background: ${({ theme }) => theme.colors.surfaceAlt};
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: 12px;
  font-weight: 600;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  font-size: 13px;
  margin-bottom: 16px;

  div {
    color: ${({ theme }) => theme.colors.text.secondary};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  strong {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

export const EquipmentFooter = styled.div`
  background: ${({ theme }) => theme.colors.surfaceAlt};
  padding: 12px 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.secondary};

  span {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  b {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

export const ActionRow = styled.div`
  display: flex;
  gap: 8px;
`;
