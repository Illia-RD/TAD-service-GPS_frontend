import React, { useState, useEffect } from 'react';
import CreatableSelect from 'react-select/creatable';
import { History, Smartphone } from 'lucide-react';
import { useTheme } from 'styled-components';

import { equipmentApi } from '@/shared/api/equipmentApi';
import { dictionariesApi } from '@/shared/api/dictionariesApi';
import { api } from '@/shared/api/axiosInstance';
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
  SimCell,
} from './TrackersTab.styled';

export const TrackersTab = () => {
  const theme = useTheme();
  const [trackers, setTrackers] = useState([]);
  const [freeSims, setFreeSims] = useState([]);
  const [models, setModels] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignModalTracker, setAssignModalTracker] = useState(null);
  const [selectedSimId, setSelectedSimId] = useState('');
  const [expandedCardId, setExpandedCardId] = useState(null);

  const [formData, setFormData] = useState({
    model: '',
    serial_number: '',
    imei: '',
    sent_id: '',
    status: 'new',
  });

  const loadData = async () => {
    try {
      const [trackersData, simsData, modelsData] = await Promise.all([
        equipmentApi.getArchiveTrackers(),
        equipmentApi.getArchiveSims(),
        dictionariesApi.getTrackerModels().catch(() => []),
      ]);
      setTrackers(trackersData);
      setFreeSims(simsData);
      setModels(modelsData.map(m => ({ value: m.name, label: m.name })));
    } catch (err) {
      console.error('Помилка завантаження даних складу трекерів:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateModel = async inputValue => {
    try {
      const newModel = await dictionariesApi.createTrackerModel(inputValue);
      setModels(prev => [
        ...prev,
        { value: newModel.name, label: newModel.name },
      ]);
      setFormData(prev => ({ ...prev, model: newModel.name }));
    } catch (error) {
      console.error('Помилка створення моделі трекера', error);
      alert('Не вдалося створити модель');
    }
  };

  const handleCreate = async e => {
    e.preventDefault();
    try {
      await equipmentApi.createTracker(formData);
      setIsModalOpen(false);
      setFormData({
        model: '',
        serial_number: '',
        imei: '',
        sent_id: '',
        status: 'new',
      });
      loadData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Помилка створення трекера');
    }
  };

  const handleAssignSim = async () => {
    if (!selectedSimId || !assignModalTracker) return;
    try {
      await api.post(
        `/equipment/sim-cards/${selectedSimId}/assign/${assignModalTracker.id}`
      );
      setAssignModalTracker(null);
      setSelectedSimId('');
      loadData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Помилка привʼязки СІМ-карти');
    }
  };

  const handleUnassignSim = async simId => {
    try {
      await api.post(`/equipment/sim-cards/${simId}/unassign`);
      loadData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Помилка зняття СІМ-карти');
    }
  };

  const toggleCard = id => {
    setExpandedCardId(expandedCardId === id ? null : id);
  };

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

  // Компонент рендеру блоку СІМ-карти, щоб не дублювати код для таблиці та мобілок
  const renderSimBlock = (t, activeSim) => {
    if (activeSim) {
      return (
        <SimCell onClick={e => e.stopPropagation()}>
          <span className="sim-number">
            <Smartphone size={14} /> {activeSim.phone_number}
          </span>
          <Button
            variant="danger"
            style={{ padding: '4px 8px', fontSize: '11px' }}
            onClick={() => handleUnassignSim(activeSim.id)}
          >
            Витягнути
          </Button>
        </SimCell>
      );
    }
    return (
      <Button
        variant="outline"
        style={{ padding: '4px 12px', fontSize: '12px', width: '100%' }}
        onClick={e => {
          e.stopPropagation();
          setAssignModalTracker(t);
        }}
      >
        + Вставити СІМ
      </Button>
    );
  };

  return (
    <div>
      <HeaderWrapper>
        <h3>Вільні трекери на складі ({trackers.length})</h3>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          + Прийняти трекер
        </Button>
      </HeaderWrapper>

      {/* --- DESKTOP VIEW --- */}
      <DesktopView>
        <Table>
          <thead>
            <tr>
              <th>Модель</th>
              <th>Серійний номер</th>
              <th>IMEI</th>
              <th>SENT ID</th>
              <th style={{ width: '250px' }}>СІМ-карта</th>
              <th>Статус</th>
              <th style={{ textAlign: 'right' }}>Дії</th>
            </tr>
          </thead>
          <tbody>
            {trackers.length === 0 ? (
              <tr>
                <EmptyRow colSpan="7">Склад трекерів порожній</EmptyRow>
              </tr>
            ) : (
              trackers.map(t => {
                const activeSim =
                  t.sim_cards && t.sim_cards.length > 0 ? t.sim_cards[0] : null;
                return (
                  <tr key={t.id}>
                    <td>
                      <strong>{t.model || '—'}</strong>
                    </td>
                    <td>{t.serial_number || '—'}</td>
                    <td>{t.imei}</td>
                    <td>{t.sent_id || '—'}</td>
                    <td>{renderSimBlock(t, activeSim)}</td>
                    <td>
                      <Badge $variant={t.status}>
                        {t.status === 'new'
                          ? 'Новий'
                          : t.status === 'repair'
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
                );
              })
            )}
          </tbody>
        </Table>
      </DesktopView>

      {/* --- MOBILE VIEW --- */}
      <MobileView>
        {trackers.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '24px',
              color: theme.colors.text.secondary,
            }}
          >
            Склад трекерів порожній
          </div>
        ) : (
          trackers.map(t => {
            const activeSim =
              t.sim_cards && t.sim_cards.length > 0 ? t.sim_cards[0] : null;
            return (
              <Card key={t.id} onClick={() => toggleCard(t.id)}>
                <CardHeader>
                  <CardTitle>{t.imei}</CardTitle>
                  <CardBadges>
                    <Badge $variant={t.status}>
                      {t.status === 'new'
                        ? 'Новий'
                        : t.status === 'repair'
                          ? 'В ремонті'
                          : 'Б/В'}
                    </Badge>
                  </CardBadges>
                </CardHeader>

                <CardSubtitle>
                  {t.model || '—'} | С/Н: {t.serial_number || '—'}
                </CardSubtitle>

                {expandedCardId === t.id && (
                  <CardExpandedContent>
                    <div>
                      <strong>SENT ID:</strong> {t.sent_id || '—'}
                    </div>

                    <div style={{ marginTop: '8px' }}>
                      <strong style={{ display: 'block', marginBottom: '8px' }}>
                        СІМ-карта:
                      </strong>
                      {renderSimBlock(t, activeSim)}
                    </div>

                    <div
                      style={{
                        marginTop: '12px',
                        display: 'flex',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <HistoryButton
                        disabled
                        onClick={e => e.stopPropagation()}
                      >
                        <History size={16} />
                      </HistoryButton>
                    </div>
                  </CardExpandedContent>
                )}
              </Card>
            );
          })
        )}
      </MobileView>

      {/* --- Модалка приходу трекера --- */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <FormWrapper onSubmit={handleCreate}>
            <FormTitle>Прихід трекера на склад</FormTitle>

            <FieldGroup>
              <Label>Модель</Label>
              <CreatableSelect
                isClearable
                placeholder="Виберіть або створіть..."
                options={models}
                value={models.find(m => m.value === formData.model) || null}
                onChange={newValue =>
                  setFormData({
                    ...formData,
                    model: newValue ? newValue.value : '',
                  })
                }
                onCreateOption={handleCreateModel}
                styles={selectStyles}
                formatCreateLabel={inputValue => `Створити "${inputValue}"`}
              />
            </FieldGroup>

            <FieldGroup>
              <Label>Серійний номер</Label>
              <Input
                value={formData.serial_number}
                onChange={e =>
                  setFormData({ ...formData, serial_number: e.target.value })
                }
                placeholder="Напр. 12345678"
              />
            </FieldGroup>

            <FieldGroup>
              <Label>IMEI (обов'язково)</Label>
              <Input
                required
                value={formData.imei}
                onChange={e =>
                  setFormData({ ...formData, imei: e.target.value })
                }
                placeholder="15 цифр"
              />
            </FieldGroup>

            <FieldGroup>
              <Label>SENT ID</Label>
              <Input
                value={formData.sent_id}
                onChange={e =>
                  setFormData({ ...formData, sent_id: e.target.value })
                }
                placeholder="Напр. ABCDEF123"
              />
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
                Зберегти на склад
              </Button>
            </ActionsRow>
          </FormWrapper>
        </Modal>
      )}

      {/* --- Модалка прив'язки СІМ-карти --- */}
      {assignModalTracker && (
        <Modal onClose={() => setAssignModalTracker(null)}>
          <div style={{ padding: '24px' }}>
            <FormTitle style={{ marginBottom: '16px' }}>
              Вставити СІМ-карту в трекер (IMEI: {assignModalTracker.imei})
            </FormTitle>

            <FieldGroup>
              <Label>Виберіть вільну СІМ-карту зі складу</Label>
              <Select
                value={selectedSimId}
                onChange={e => setSelectedSimId(e.target.value)}
              >
                <option value="">-- Виберіть номер --</option>
                {freeSims.map(sim => (
                  <option key={sim.id} value={sim.id}>
                    {sim.phone_number} ({sim.operator || 'Без оператора'})
                  </option>
                ))}
              </Select>
            </FieldGroup>

            <ActionsRow>
              <Button
                type="button"
                variant="outline"
                onClick={() => setAssignModalTracker(null)}
              >
                Скасувати
              </Button>
              <Button variant="primary" onClick={handleAssignSim}>
                Вставити СІМ
              </Button>
            </ActionsRow>
          </div>
        </Modal>
      )}
    </div>
  );
};
