import React, { useState, useEffect } from 'react';
import { equipmentApi } from '@/shared/api/equipmentApi';
import { Button } from '@/shared/ui/Button/Button';
import { Input, Select } from '@/shared/ui/Input/Input';
import { Modal } from '@/shared/ui/Modal/Modal';
import { api } from '@/shared/api/axiosInstance';
import {
  Table,
  Badge,
  SimCell,
  HeaderWrapper,
  FormWrapper,
  FieldGroup,
  Label,
  ActionsRow,
} from './TrackersTab.styled';

export const TrackersTab = () => {
  const [trackers, setTrackers] = useState([]);
  const [freeSims, setFreeSims] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignModalTracker, setAssignModalTracker] = useState(null);
  const [selectedSimId, setSelectedSimId] = useState('');

  const [formData, setFormData] = useState({
    model: '',
    serial_number: '',
    imei: '',
    sent_id: '',
    status: 'new',
  });

  const loadData = async () => {
    try {
      const [trackersData, simsData] = await Promise.all([
        equipmentApi.getArchiveTrackers(),
        equipmentApi.getArchiveSims(),
      ]);
      setTrackers(trackersData);
      setFreeSims(simsData);
    } catch (err) {
      console.error('Помилка завантаження даних складу трекерів:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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

  return (
    <div>
      <HeaderWrapper>
        <h3>Вільні трекери на складі ({trackers.length})</h3>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          + Прийняти трекер
        </Button>
      </HeaderWrapper>

      <Table>
        <thead>
          <tr>
            <th>Модель</th>
            <th>Серійний номер</th>
            <th>IMEI</th>
            <th>SENT ID</th>
            <th>СІМ-карта</th>
            <th>Статус</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {trackers.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', color: '#888' }}>
                Склад трекерів порожній
              </td>
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
                  <td>
                    {activeSim ? (
                      <SimCell>
                        <span style={{ color: '#10b981', fontWeight: 500 }}>
                          📱 {activeSim.phone_number}
                        </span>
                        <Button
                          variant="danger"
                          style={{ padding: '2px 6px', fontSize: '10px' }}
                          onClick={() => handleUnassignSim(activeSim.id)}
                        >
                          Витягнути
                        </Button>
                      </SimCell>
                    ) : (
                      <Button
                        variant="outline"
                        style={{ padding: '2px 8px', fontSize: '11px' }}
                        onClick={() => setAssignModalTracker(t)}
                      >
                        + Вставити СІМ
                      </Button>
                    )}
                  </td>
                  <td>
                    <Badge>{t.status}</Badge>
                  </td>
                  <td>—</td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>

      {/* Модалка приходу трекера */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <FormWrapper onSubmit={handleCreate}>
            <h3 style={{ marginBottom: '16px' }}>Прихід трекера на склад</h3>

            <FieldGroup>
              <Label>Модель</Label>
              <Input
                required
                value={formData.model}
                onChange={e =>
                  setFormData({ ...formData, model: e.target.value })
                }
                placeholder="Напр. FMC125, FMC650"
              />
            </FieldGroup>

            <FieldGroup>
              <Label>Серійний номер</Label>
              <Input
                value={formData.serial_number}
                onChange={e =>
                  setFormData({ ...formData, serial_number: e.target.value })
                }
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
                Зберегти на склад
              </Button>
            </ActionsRow>
          </FormWrapper>
        </Modal>
      )}

      {/* Модалка прив'язки СІМ-карти */}
      {assignModalTracker && (
        <Modal onClose={() => setAssignModalTracker(null)}>
          <div style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '16px' }}>
              Вставити СІМ-карту в трекер (IMEI: {assignModalTracker.imei})
            </h3>

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
