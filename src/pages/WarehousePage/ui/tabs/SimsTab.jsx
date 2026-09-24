import React, { useState, useEffect } from 'react';
import CreatableSelect from 'react-select/creatable';

import { equipmentApi } from '@/shared/api/equipmentApi';
import { dictionariesApi } from '@/shared/api/dictionariesApi';
import { Button } from '@/shared/ui/Button/Button';
import { Input, Select } from '@/shared/ui/Input/Input';
import { Modal } from '@/shared/ui/Modal/Modal';
import { useTheme } from 'styled-components';
import {
  HeaderWrapper,
  Table,
  Badge,
  EmptyRow,
  FormWrapper,
  FormTitle,
  FieldGroup,
  Label,
  ActionsRow,
} from './SimsTab.styled';

export const SimsTab = () => {
  const { theme } = useTheme();
  const [sims, setSims] = useState([]);
  const [operators, setOperators] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    phone_number: '',
    iccid: '',
    operator: '',
    status: 'new',
  });

  const loadData = async () => {
    try {
      const [simsData, opsData] = await Promise.all([
        equipmentApi.getArchiveSims(),
        dictionariesApi.getSimOperators().catch(() => []),
      ]);
      setSims(simsData);

      // Форматуємо для react-select { value, label }
      setOperators(opsData.map(op => ({ value: op.name, label: op.name })));
    } catch (err) {
      console.error('Помилка завантаження СІМ-карт:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateOperator = async inputValue => {
    try {
      // Створюємо оператора на бекенді
      const newOp = await dictionariesApi.createSimOperator(inputValue);
      const newOption = { value: newOp.name, label: newOp.name };

      // Додаємо в список і вибираємо
      setOperators(prev => [...prev, newOption]);
      setFormData(prev => ({ ...prev, operator: newOp.name }));
    } catch (error) {
      console.error('Помилка створення оператора', error);
      alert('Не вдалося створити оператора');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await equipmentApi.createSim(formData);
      setIsModalOpen(false);
      setFormData({ phone_number: '', iccid: '', operator: '', status: 'new' });
      loadData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Помилка збереження СІМ-карти');
    }
  };

  // Стилі для react-select щоб він не вибивався з нашої теми
  // Безпечні стилі для react-select із фолбеками на випадок відсутності теми
  const selectStyles = {
    control: base => ({
      ...base,
      backgroundColor: theme?.colors?.surface || '#ffffff',
      borderColor: theme?.colors?.border || '#e5e7eb',
      minHeight: '38px',
    }),
    singleValue: base => ({
      ...base,
      color: theme?.colors?.text?.primary || '#111827',
    }),
    menu: base => ({
      ...base,
      backgroundColor: theme?.colors?.surface || '#ffffff',
      zIndex: 9999,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused
        ? theme?.colors?.background || '#f3f4f6'
        : 'transparent',
      color: theme?.colors?.text?.primary || '#111827',
      cursor: 'pointer',
    }),
  };

  return (
    <div>
      <HeaderWrapper>
        <h3>Вільні СІМ-карти на складі ({sims.length})</h3>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          + Додати СІМ-карту
        </Button>
      </HeaderWrapper>

      <Table>
        <thead>
          <tr>
            <th>Номер телефону</th>
            <th>ICCID</th>
            <th>Оператор</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {sims.length === 0 ? (
            <tr>
              <EmptyRow colSpan="4">Склад СІМ-карт порожній</EmptyRow>
            </tr>
          ) : (
            sims.map(sim => (
              <tr key={sim.id}>
                <td>
                  <strong>{sim.phone_number}</strong>
                </td>
                <td>{sim.iccid || '—'}</td>
                <td>{sim.operator || '—'}</td>
                <td>
                  <Badge>{sim.status}</Badge>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <FormWrapper onSubmit={handleSubmit}>
            <FormTitle>Додати СІМ-карту</FormTitle>

            <FieldGroup>
              <Label>Номер телефону</Label>
              <Input
                required
                value={formData.phone_number}
                onChange={e =>
                  setFormData({ ...formData, phone_number: e.target.value })
                }
                placeholder="+380..."
              />
            </FieldGroup>

            <FieldGroup>
              <Label>ICCID</Label>
              <Input
                value={formData.iccid}
                onChange={e =>
                  setFormData({ ...formData, iccid: e.target.value })
                }
                placeholder="8938..."
              />
            </FieldGroup>

            <FieldGroup>
              <Label>Оператор</Label>
              <CreatableSelect
                isClearable
                placeholder="Виберіть або створіть..."
                options={operators}
                value={
                  operators.find(op => op.value === formData.operator) || null
                }
                onChange={newValue =>
                  setFormData({
                    ...formData,
                    operator: newValue ? newValue.value : '',
                  })
                }
                onCreateOption={handleCreateOperator}
                styles={selectStyles}
                formatCreateLabel={inputValue => `Створити "${inputValue}"`}
              />
            </FieldGroup>

            <FieldGroup>
              <Label>Статус</Label>
              <Select
                value={formData.status}
                onChange={e =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="new">Новий</option>
                <option value="in_stock">На складі (Б/В)</option>
                <option value="repair">В ремонті</option>
              </Select>
            </FieldGroup>

            <ActionsRow>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Скасувати
              </Button>
              <Button type="submit" variant="primary">
                Зберегти
              </Button>
            </ActionsRow>
          </FormWrapper>
        </Modal>
      )}
    </div>
  );
};
