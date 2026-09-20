import React, { useState, useEffect } from 'react';
import { X, HardDrive, Plus, Check } from 'lucide-react';
import { vehiclesApi } from '../../services/vehiclesApi';
import { dictionariesApi } from '../../services/dictionariesApi';

import {
  Overlay,
  ModalContainer,
  CloseBtn,
  Title,
  Tabs,
  TabBtn,
  FormGroup,
  Label,
  Input,
  Select,
  ActionButton,
  Row,
} from './TrackerModal.styled';

export const TrackerModal = ({ vehicle, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('warehouse');

  const [inventory, setInventory] = useState([]);
  const [selectedTrackerId, setSelectedTrackerId] = useState('');

  const [trackerModels, setTrackerModels] = useState([]);
  const [newTracker, setNewTracker] = useState({
    imei: '',
    model: '',
    serial_number: '',
    sent_id: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trackers, models] = await Promise.all([
          vehiclesApi.getInventoryTrackers(),
          dictionariesApi.trackerModels.getAll(),
        ]);

        setInventory(trackers.filter(t => !t.vehicle_id));
        setTrackerModels(models);
      } catch (error) {
        console.error('Помилка завантаження даних:', error);
      }
    };
    fetchData();
  }, []);

  const handleAssignWarehouse = async () => {
    if (!selectedTrackerId) return alert('Виберіть трекер зі списку');
    setIsLoading(true);
    try {
      await vehiclesApi.assignTracker(selectedTrackerId, vehicle.id);
      onUpdate();
      onClose();
    } catch (error) {
      alert("Помилка прив'язки");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAndAssign = async e => {
    e.preventDefault();
    if (!newTracker.imei || !newTracker.model)
      return alert("IMEI та Модель обов'язкові");
    setIsLoading(true);
    try {
      const created = await vehiclesApi.createTracker(newTracker);
      await vehiclesApi.assignTracker(created.id, vehicle.id);
      onUpdate();
      onClose();
    } catch (error) {
      alert('Помилка створення трекера');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <CloseBtn onClick={onClose}>
          <X size={20} />
        </CloseBtn>

        <Title>
          <HardDrive size={20} color="#3b82f6" />
          Додати трекер на {vehicle.plate}
        </Title>

        <Tabs>
          <TabBtn
            $active={activeTab === 'warehouse'}
            onClick={() => setActiveTab('warehouse')}
          >
            Зі складу ({inventory.length})
          </TabBtn>
          <TabBtn
            $active={activeTab === 'new'}
            onClick={() => setActiveTab('new')}
          >
            Новий трекер
          </TabBtn>
        </Tabs>

        {activeTab === 'warehouse' && (
          <div>
            <FormGroup>
              <Label>Вільні трекери:</Label>
              <Select
                value={selectedTrackerId}
                onChange={e => setSelectedTrackerId(e.target.value)}
              >
                <option value="">-- Оберіть трекер --</option>
                {inventory.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.model} (IMEI: {t.imei})
                  </option>
                ))}
              </Select>
            </FormGroup>

            <ActionButton
              $color="#3b82f6"
              onClick={handleAssignWarehouse}
              disabled={isLoading}
            >
              <Check size={16} /> Прив'язати вибраний
            </ActionButton>
          </div>
        )}

        {activeTab === 'new' && (
          <form onSubmit={handleCreateAndAssign}>
            <FormGroup>
              <Label>Модель (із довідника):</Label>
              <Select
                value={newTracker.model}
                onChange={e =>
                  setNewTracker({ ...newTracker, model: e.target.value })
                }
                required
              >
                <option value="">-- Оберіть модель --</option>
                {trackerModels.map(m => (
                  <option key={m.id} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>IMEI:</Label>
              <Input
                placeholder="Обов'язково"
                value={newTracker.imei}
                onChange={e =>
                  setNewTracker({ ...newTracker, imei: e.target.value })
                }
                required
              />
            </FormGroup>

            <Row>
              <div>
                <Label>SENT ID (Європа):</Label>
                <Input
                  placeholder="Якщо є"
                  value={newTracker.sent_id}
                  onChange={e =>
                    setNewTracker({ ...newTracker, sent_id: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Серійник (S/N):</Label>
                <Input
                  placeholder="Заводський"
                  value={newTracker.serial_number}
                  onChange={e =>
                    setNewTracker({
                      ...newTracker,
                      serial_number: e.target.value,
                    })
                  }
                />
              </div>
            </Row>

            <ActionButton type="submit" $color="#10b981" disabled={isLoading}>
              <Plus size={16} /> Створити і Прив'язати
            </ActionButton>
          </form>
        )}
      </ModalContainer>
    </Overlay>
  );
};
