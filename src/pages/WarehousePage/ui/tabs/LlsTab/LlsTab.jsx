import React, { useState, useEffect } from 'react';
import CreatableSelect from 'react-select/creatable';
import { History } from 'lucide-react';
import { useTheme } from 'styled-components';

import { equipmentApi } from '@/shared/api/equipmentApi';
import { dictionariesApi } from '@/shared/api/dictionariesApi';
import { Button } from '@/shared/ui/Button/Button';
import { Input, Select } from '@/shared/ui/Input/Input';
import { Modal } from '@/shared/ui/Modal/Modal';

import {
  HeaderWrapper,
  DesktopView,
  MobileView,
  Table,
  Badge,
  EmptyRow,
  Card,
  CardHeader,
  CardTitle,
  CardSubtitle,
  CardBadges,
  CardExpandedContent,
  ActionButtonCell,
  HistoryButton,
  FormWrapper,
  FormTitle,
  FieldGroup,
  Label,
  ActionsRow,
} from './LlsTab.styled';

export const LlsTab = () => {
  const theme = useTheme();
  const [llsList, setLlsList] = useState([]);
  const [models, setModels] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState(null);

  const [formData, setFormData] = useState({
    serial_number: '',
    lls_model: '', // <--- Виправлено
    lls_height: '', // <--- Виправлено
    connection_type: 'rs-485',
    status: 'new',
  });

  const loadData = async () => {
    try {
      const [llsData, modelsData] = await Promise.all([
        equipmentApi.getArchiveLls(),
        dictionariesApi.getLlsModels().catch(() => []),
      ]);
      setLlsList(llsData);
      setModels(modelsData.map(m => ({ value: m.name, label: m.name })));
    } catch (err) {
      console.error('Помилка завантаження ДВРП:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateModel = async inputValue => {
    try {
      const newModel = await dictionariesApi.createLlsModel(inputValue);
      setModels(prev => [
        ...prev,
        { value: newModel.name, label: newModel.name },
      ]);
      setFormData(prev => ({ ...prev, lls_model: newModel.name })); // <--- Виправлено
    } catch (error) {
      console.error('Помилка створення моделі ДВРП', error);
      alert('Не вдалося створити модель');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        lls_height: formData.lls_height
          ? parseInt(formData.lls_height, 10)
          : null, // <--- Виправлено
      };

      await equipmentApi.createLls(payload);
      setIsModalOpen(false);
      setFormData({
        serial_number: '',
        lls_model: '',
        lls_height: '',
        connection_type: 'rs-485',
        status: 'new',
      }); // <--- Виправлено
      loadData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Помилка збереження ДВРП');
    }
  };

  const toggleCard = id => {
    setExpandedCardId(expandedCardId === id ? null : id);
  };

  // Стилі для react-select (строго по нашій темі)
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: theme.colors.surface,
      borderColor: state.isFocused
        ? theme.colors.borderFocus
        : theme.colors.border,
      minHeight: '38px',
      boxShadow: 'none',
      '&:hover': { borderColor: theme.colors.borderFocus },
    }),
    singleValue: base => ({ ...base, color: theme.colors.text.primary }),
    input: base => ({ ...base, color: theme.colors.text.primary }),
    menu: base => ({
      ...base,
      backgroundColor: theme.colors.surface,
      border: `1px solid ${theme.colors.border}`,
      boxShadow: theme.shadows.md,
      zIndex: 9999,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused
        ? theme.colors.surfaceAlt
        : 'transparent',
      color: theme.colors.text.primary,
      cursor: 'pointer',
      '&:active': {
        backgroundColor: theme.colors.primary.main,
        color: theme.colors.primary.contrastText,
      },
    }),
    clearIndicator: base => ({
      ...base,
      color: theme.colors.text.muted,
      '&:hover': { color: theme.colors.text.primary },
    }),
    dropdownIndicator: base => ({
      ...base,
      color: theme.colors.text.muted,
      '&:hover': { color: theme.colors.text.primary },
    }),
  };

  return (
    <div>
      <HeaderWrapper>
        <h3>Вільні ДВРП на складі ({llsList.length})</h3>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          + Додати ДВРП
        </Button>
      </HeaderWrapper>

      {/* --- DESKTOP VIEW --- */}
      <DesktopView>
        <Table>
          <thead>
            <tr>
              <th>С/Н</th>
              <th>Модель</th>
              <th>Висота (мм)</th>
              <th>Інтерфейс</th>
              <th>Стан</th>
              <th style={{ textAlign: 'right' }}>Дії</th>
            </tr>
          </thead>
          <tbody>
            {llsList.length === 0 ? (
              <tr>
                <EmptyRow colSpan="6">Склад ДВРП порожній</EmptyRow>
              </tr>
            ) : (
              llsList.map(sensor => (
                <tr key={sensor.id}>
                  <td>
                    <strong>{sensor.serial_number}</strong>
                  </td>
                  <td>{sensor.lls_model || '—'}</td>
                  <td>{sensor.lls_height || '—'}</td>
                  <td>
                    <Badge>{sensor.connection_type}</Badge>
                  </td>
                  <td>
                    <Badge $variant={sensor.status}>
                      {sensor.status === 'new'
                        ? 'Новий'
                        : sensor.status === 'repair'
                          ? 'В ремонті'
                          : 'Б/В'}
                    </Badge>
                  </td>
                  <ActionButtonCell>
                    <HistoryButton
                      disabled
                      title="Історія рухів (у розробці...)"
                      onClick={e => e.stopPropagation()}
                    >
                      <History size={16} />
                    </HistoryButton>
                  </ActionButtonCell>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </DesktopView>

      {/* --- MOBILE VIEW --- */}
      <MobileView>
        {llsList.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '24px',
              color: theme.colors.text.secondary,
            }}
          >
            Склад ДВРП порожній
          </div>
        ) : (
          llsList.map(sensor => (
            <Card key={sensor.id} onClick={() => toggleCard(sensor.id)}>
              <CardHeader>
                <CardTitle>{sensor.serial_number}</CardTitle>
                <CardBadges>
                  <Badge $variant={sensor.status}>
                    {sensor.status === 'new'
                      ? 'Новий'
                      : sensor.status === 'repair'
                        ? 'В ремонті'
                        : 'Б/В'}
                  </Badge>
                </CardBadges>
              </CardHeader>

              <CardSubtitle>
                {sensor.lls_model || 'Невідома модель'}
              </CardSubtitle>

              {expandedCardId === sensor.id && (
                <CardExpandedContent>
                  <div>
                    <strong>Висота:</strong>{' '}
                    {sensor.lls_height ? `${sensor.lls_height} мм` : '—'}
                  </div>
                  <div>
                    <strong>Інтерфейс:</strong> {sensor.connection_type}
                  </div>

                  <div
                    style={{
                      marginTop: '8px',
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <HistoryButton disabled onClick={e => e.stopPropagation()}>
                      <History size={16} />
                    </HistoryButton>
                  </div>
                </CardExpandedContent>
              )}
            </Card>
          ))
        )}
      </MobileView>

      {/* --- ФОРМА ДОДАВАННЯ --- */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <FormWrapper onSubmit={handleSubmit}>
            <FormTitle>Додати ДВРП (LLS)</FormTitle>

            <FieldGroup>
              <Label>Серійний номер</Label>
              <Input
                required
                value={formData.serial_number}
                onChange={e =>
                  setFormData({ ...formData, serial_number: e.target.value })
                }
                placeholder="Введіть с/н..."
              />
            </FieldGroup>

            <FieldGroup>
              <Label>Модель</Label>
              <CreatableSelect
                isClearable
                placeholder="Виберіть або створіть..."
                options={models}
                value={models.find(m => m.value === formData.lls_model) || null} // <--- Виправлено
                onChange={newValue =>
                  setFormData({
                    ...formData,
                    lls_model: newValue ? newValue.value : '',
                  })
                } // <--- Виправлено
                onCreateOption={handleCreateModel}
                styles={selectStyles}
                formatCreateLabel={inputValue => `Створити "${inputValue}"`}
              />
            </FieldGroup>

            <FieldGroup>
              <Label>Висота (мм)</Label>
              <Input
                type="number"
                value={formData.lls_height} // <--- Виправлено
                onChange={e =>
                  setFormData({ ...formData, lls_height: e.target.value })
                } // <--- Виправлено
                placeholder="Наприклад: 700"
              />
            </FieldGroup>

            <FieldGroup>
              <Label>Інтерфейс підключення</Label>
              <Select
                value={formData.connection_type}
                onChange={e =>
                  setFormData({ ...formData, connection_type: e.target.value })
                }
              >
                <option value="rs-485">RS-485</option>
                <option value="rs-232">RS-232</option>
                <option value="frequency">Частотний</option>
                <option value="bluetooth">Bluetooth</option>
              </Select>
            </FieldGroup>

            <FieldGroup>
              <Label>Стан</Label>
              <Select
                value={formData.status}
                onChange={e =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="new">Новий</option>
                <option value="in_stock">Б/В (На складі)</option>
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
