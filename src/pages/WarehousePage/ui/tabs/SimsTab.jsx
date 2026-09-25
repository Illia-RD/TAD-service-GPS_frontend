import React, { useState, useEffect } from 'react';
import CreatableSelect from 'react-select/creatable';
import { History } from 'lucide-react';
import { equipmentApi } from '@/shared/api/equipmentApi';
import { dictionariesApi } from '@/shared/api/dictionariesApi';
import { Button } from '@/shared/ui/Button/Button';
import { Input } from '@/shared/ui/Input/Input';
import { Modal } from '@/shared/ui/Modal/Modal';
import { useTheme } from 'styled-components';
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
  CardBadges,
  CardExpandedContent,
  ActionButtonCell,
  HistoryButton,
  FormWrapper,
  FormTitle,
  FieldGroup,
  Label,
  ActionsRow,
  CardOperator,
} from './SimsTab.styled';

export const SimsTab = () => {
  const { theme } = useTheme();
  const [sims, setSims] = useState([]);
  const [operators, setOperators] = useState([]);
  const [networkStatuses, setNetworkStatuses] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState(null); // Для мобілок

  const [formData, setFormData] = useState({
    short_id: '',
    phone_number: '',
    iccid: '',
    operator: '',
    network_status: 'Призупинена',
  });

  const loadData = async () => {
    try {
      const [simsData, opsData, statusesData] = await Promise.all([
        equipmentApi.getArchiveSims(),
        dictionariesApi.getSimOperators().catch(() => []),
        dictionariesApi.getSimNetworkStatuses().catch(() => []),
      ]);
      setSims(simsData);
      setOperators(opsData.map(op => ({ value: op.name, label: op.name })));
      setNetworkStatuses(
        statusesData.map(s => ({ value: s.name, label: s.name }))
      );
    } catch (err) {
      console.error('Помилка завантаження СІМ-карт:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateOperator = async inputValue => {
    try {
      const newOp = await dictionariesApi.createSimOperator(inputValue);
      setOperators(prev => [...prev, { value: newOp.name, label: newOp.name }]);
      setFormData(prev => ({ ...prev, operator: newOp.name }));
    } catch (error) {
      console.error('Помилка створення оператора', error);
      alert('Не вдалося створити оператора');
    }
  };

  const handleCreateStatus = async inputValue => {
    try {
      const newStatus =
        await dictionariesApi.createSimNetworkStatus(inputValue);
      setNetworkStatuses(prev => [
        ...prev,
        { value: newStatus.name, label: newStatus.name },
      ]);
      setFormData(prev => ({ ...prev, network_status: newStatus.name }));
    } catch (error) {
      console.error('Помилка створення статусу', error);
      alert('Не вдалося створити статус');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await equipmentApi.createSim(formData);
      setIsModalOpen(false);
      setFormData({
        short_id: '',
        phone_number: '',
        iccid: '',
        operator: '',
        network_status: 'Призупинена',
      });
      loadData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Помилка збереження СІМ-карти');
    }
  };

  const toggleCard = id => {
    setExpandedCardId(expandedCardId === id ? null : id);
  };

  const selectStyles = {
    control: base => ({
      ...base,
      backgroundColor: theme?.colors?.surface || '#ffffff',
      borderColor: theme?.colors?.border || '#e5e7eb',
      minHeight: '38px',
    }),
    singleValue: base => ({
      ...base,
      color: theme?.colors?.text?.primary || '#ffffff', // <-- Виправлено
    }),
    input: base => ({
      ...base,
      color: theme?.colors?.text?.primary || '#ffffff', // <-- ДОДАНО (для вводу тексту)
    }),
    menu: base => ({
      ...base,
      backgroundColor: theme?.colors?.surface || '#ffffff',
      zIndex: 9999,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused
        ? theme?.colors?.background || '#374151'
        : 'transparent',
      color: theme?.colors?.text?.primary || '#ffffff', // <-- Виправлено
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

      {/* --- DESKTOP VIEW (Таблиця) --- */}
      <DesktopView>
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Оператор</th>
              <th>Номер телефону</th>
              <th>ICCID</th>
              <th>Стан (Фізичний)</th>
              <th>Статус мережі</th>
              <th style={{ textAlign: 'right' }}>Дії</th>
            </tr>
          </thead>
          <tbody>
            {sims.length === 0 ? (
              <tr>
                <EmptyRow colSpan="7">Склад СІМ-карт порожній</EmptyRow>
              </tr>
            ) : (
              sims.map(sim => (
                <tr key={sim.id}>
                  <td>
                    <strong>{sim.short_id || '—'}</strong>
                  </td>
                  <td>{sim.operator || '—'}</td>
                  <td>{sim.phone_number}</td>
                  <td style={{ fontSize: '12px' }}>{sim.iccid || '—'}</td>
                  <td>
                    <Badge $variant={sim.condition}>
                      {sim.condition === 'new' ? 'Нова' : 'Б/В'}
                    </Badge>
                  </td>
                  <td>
                    <Badge>{sim.network_status || '—'}</Badge>
                  </td>
                  <ActionButtonCell>
                    <HistoryButton
                      disabled
                      title="Історія рухів з'явиться пізніше"
                      onClick={e => e.stopPropagation()}
                    >
                      Історія
                    </HistoryButton>
                  </ActionButtonCell>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </DesktopView>

      {/* --- MOBILE VIEW (Картки) --- */}
      <MobileView>
        {sims.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px', color: '#888' }}>
            Склад СІМ-карт порожній
          </div>
        ) : (
          sims.map(sim => (
            <Card key={sim.id} onClick={() => toggleCard(sim.id)}>
              <CardHeader>
                <CardTitle>{sim.short_id || `СІМ #${sim.id}`}</CardTitle>
                <CardBadges>
                  <Badge $variant={sim.condition}>
                    {sim.condition === 'new' ? 'Нова' : 'Б/В'}
                  </Badge>
                  <Badge>{sim.network_status}</Badge>
                </CardBadges>
              </CardHeader>

              <CardOperator>
                {sim.operator || 'Невідомий оператор'}
              </CardOperator>

              {expandedCardId === sim.id && (
                <CardExpandedContent>
                  <div>
                    <strong>Номер:</strong> {sim.phone_number}
                  </div>
                  <div>
                    <strong>ICCID:</strong> {sim.iccid || '—'}
                  </div>

                  <div
                    style={{
                      marginTop: '8px',
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}
                  >
                    {/* onClick зупиняє спливання події, щоб картка не згорнулась при кліку на кнопку */}
                    <HistoryButton
                      disabled
                      title="Історія рухів (у розробці...)"
                      onClick={e => e.stopPropagation()}
                    >
                      <History size={16} />
                    </HistoryButton>
                  </div>
                </CardExpandedContent>
              )}
            </Card>
          ))
        )}
      </MobileView>

      {/* --- МОДАЛКА ДОДАВАННЯ СІМ-КАРТИ --- */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <FormWrapper onSubmit={handleSubmit}>
            <FormTitle>Додати СІМ-карту</FormTitle>

            <FieldGroup>
              <Label>Короткий ID</Label>
              <Input
                value={formData.short_id}
                onChange={e =>
                  setFormData({ ...formData, short_id: e.target.value })
                }
                placeholder="Залиште пустим для авто-генерації"
              />
            </FieldGroup>

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
              <Label>Статус мережі</Label>
              <CreatableSelect
                isClearable
                placeholder="Активна, Призупинена..."
                options={networkStatuses}
                value={
                  networkStatuses.find(
                    s => s.value === formData.network_status
                  ) || null
                }
                onChange={newValue =>
                  setFormData({
                    ...formData,
                    network_status: newValue ? newValue.value : '',
                  })
                }
                onCreateOption={handleCreateStatus}
                styles={selectStyles}
                formatCreateLabel={inputValue => `Створити "${inputValue}"`}
              />
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
