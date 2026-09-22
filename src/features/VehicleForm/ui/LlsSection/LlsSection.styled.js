import styled from 'styled-components';

export const LlsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;
`;

export const LlsCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 16px;
  position: relative;
`;

export const LlsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px dashed ${({ theme }) => theme.colors.border};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;
