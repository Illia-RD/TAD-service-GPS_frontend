import React, { useState, useEffect } from 'react';

import { equipmentApi } from '@/shared/api/equipmentApi';
import { Button } from '@/shared/ui/Button/Button';
import { Input, Select } from '@/shared/ui/Input/Input';
import { Modal } from '@/shared/ui/Modal/Modal';

import { Table, Badge } from './SimsTab.styled';

export const SimsTab = () => {
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
        equipmentApi.getOperators().catch(() => []),
      ]);
      setSims(simsData);
      setOperators(opsData);
    } catch (err) {
      console.error('Помилка завантаження СІМ-карт:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h3>Вільні СІМ-карти на складі ({sims.length})</h3>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          + Додати СІМ-карту
        </Button>
      </div>

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
              <td colSpan="4" style={{ textAlign: 'center', color: '#888' }}>
                Склад СІМ-карт порожній
              </td>
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
          <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '16px' }}>Додати СІМ-карту</h3>

            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              >
                Номер телефону
              </label>
              <Input
                required
                value={formData.phone_number}
                onChange={e =>
                  setFormData({ ...formData, phone_number: e.target.value })
                }
                placeholder="+380..."
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              >
                ICCID
              </label>
              <Input
                value={formData.iccid}
                onChange={e =>
                  setFormData({ ...formData, iccid: e.target.value })
                }
                placeholder="8938..."
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              >
                Оператор
              </label>
              <Select
                value={formData.operator}
                onChange={e =>
                  setFormData({ ...formData, operator: e.target.value })
                }
              >
                <option value="">-- Виберіть оператора --</option>
                {operators.map(op => (
                  <option key={op.id} value={op.name}>
                    {op.name}
                  </option>
                ))}
              </Select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              >
                Статус
              </label>
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
            </div>

            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
              }}
            >
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
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
