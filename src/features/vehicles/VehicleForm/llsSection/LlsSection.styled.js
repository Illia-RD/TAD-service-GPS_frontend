import styled from 'styled-components';

export const SectionContainer = styled.div`
  margin-bottom: 24px;
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
`;

export const SensorCard = styled.div`
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
`;

export const SensorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;

  h4 {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: #475569;
  }
`;

export const FormGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  font-size: 13px;
  color: #334155;
`;

export const Input = styled.input`
  box-sizing: border-box; /* <--- Додаємо це */
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

export const Select = styled.select`
  box-sizing: border-box; /* <--- Додаємо це */
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 14px;
  color: #1e293b;
  outline: none;
  background-color: #ffffff;

  &:focus {
    border-color: #3b82f6;
  }
`;

export const Button = styled.button`
  background-color: #f1f5f9;
  color: #3b82f6;
  border: 1px dashed #94a3b8;
  border-radius: 6px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  transition: all 0.2s;

  &:hover {
    background-color: #e2e8f0;
    border-color: #3b82f6;
  }
`;

export const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;

  &:hover {
    background-color: #fee2e2;
  }
`;

// Заглушка для файлу тарування
export const FileStub = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border: 1px dashed #94a3b8;
  border-radius: 6px;
  background-color: #ffffff;
  color: #64748b;
  font-size: 13px;
  cursor: not-allowed; /* Поки що неактивно */

  svg {
    stroke: #94a3b8;
  }
`;
