import styled from 'styled-components';

export const SectionContainer = styled.div`
  margin-bottom: 32px;
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const SectionTitle = styled.h3`
  margin: 0;
  color: #1e293b;
  font-size: 18px;
`;

/* НОВЕ: Контейнер для кнопок-вкладок */
export const TabsHeader = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  overflow-x: auto;
  padding-bottom: 4px;

  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
`;

/* НОВЕ: Сама кнопка-вкладка */
export const TabButton = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  border: 1px solid ${props => (props.$active ? '#0284c7' : '#e2e8f0')};
  background-color: ${props => (props.$active ? '#f0f9ff' : '#ffffff')};
  color: ${props => (props.$active ? '#0369a1' : '#475569')};
  transition: all 0.2s;

  &:hover {
    background-color: ${props => (props.$active ? '#f0f9ff' : '#f8fafc')};
  }
`;

/* НОВЕ: Кнопка додавання у вигляді вкладки */
export const AddTabButton = styled(TabButton)`
  border: 1px dashed #94a3b8;
  background-color: transparent;
  color: #0284c7;

  &:hover {
    background-color: #f0f9ff;
    border-color: #0284c7;
  }
`;

/* Перейменовано TrackerCard на TabContent */
export const TabContent = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  background-color: #f8fafc;
`;

/* Перейменовано TrackerHeader на TabContentHeader */
export const TabContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 8px;

  h4 {
    margin: 0;
    color: #334155;
    font-size: 16px;
  }
`;

export const FormGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #475569;
`;

export const Input = styled.input`
  box-sizing: border-box;
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 14px;
  color: #1e293b;
  outline: none;
  background-color: #ffffff;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

export const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #fef2f2;
  }
`;

export const Button = styled.button`
  background-color: #e0f2fe;
  color: #0284c7;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;

  &:hover {
    background-color: #bae6fd;
  }
`;
