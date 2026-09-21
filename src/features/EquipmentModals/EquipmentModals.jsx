import React, { useState, useEffect } from 'react';
import { X, HardDrive, CreditCard, Plus, Check } from 'lucide-react';
import CreatableSelect from 'react-select/creatable';
import { vehiclesApi } from '../../services/vehiclesApi';
import {
  Overlay,
  ModalBox,
  CloseBtn,
  Title,
  Tabs,
  TabBtn,
  FormGroup,
  Row,
  Label,
  Input,
  Select,
  ActionButton,
} from './EquipmentModals.styled';

const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? '#3b82f6' : '#cbd5e1',
    borderRadius: '6px',
    boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
    '&:hover': { borderColor: '#3b82f6' },
    fontSize: '14px',
    minHeight: '38px',
  }),
  menu: provided => ({
    ...provided,
    fontSize: '14px',
    zIndex: 9999,
  }),
};

// === МОДАЛКА 1: ТРЕКЕРИ ===
export const TrackerManagerModal = ({ dicts, onClose, onSelect }) => {
  const [activeTab, setActiveTab] = useState('warehouse');
  const [inventory, setInventory] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [newTracker, setNewTracker] = useState({
    imei: '',
    model: '',
    serial_number: '',
    sent_id: '',
  });

  useEffect(() => {
    vehiclesApi
      .getInventoryTrackers()
      .then(data => setInventory(data.filter(t => !t.vehicle_id)))
      .catch(err => console.error('Помилка завантаження складу трекерів', err));
  }, []);

  const handleSelectWarehouse = () => {
    const found = inventory.find(t => String(t.id) === String(selectedId));
    if (found) {
      onSelect(found);
      onClose();
    }
  };

  const handleCreate = async e => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    try {
      const created = await vehiclesApi.createTracker(newTracker);
      onSelect(created);
      onClose();
    } catch (error) {
      alert('Помилка створення трекера');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <ModalBox onClick={e => e.stopPropagation()}>
        <CloseBtn type="button" onClick={onClose}>
          <X size={20} />
        </CloseBtn>
        <Title>
          <HardDrive size={20} color="#3b82f6" /> Прив'язати трекер
        </Title>
        <Tabs>
          <TabBtn
            type="button"
            $active={activeTab === 'warehouse'}
            onClick={() => setActiveTab('warehouse')}
          >
            Зі складу ({inventory.length})
          </TabBtn>
          <TabBtn
            type="button"
            $active={activeTab === 'new'}
            onClick={() => setActiveTab('new')}
          >
            Створити новий
          </TabBtn>
        </Tabs>

        {activeTab === 'warehouse' ? (
          <div>
            <FormGroup>
              <Label>Вільні трекери:</Label>
              <Select
                value={selectedId}
                onChange={e => setSelectedId(e.target.value)}
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
              type="button"
              disabled={!selectedId}
              onClick={handleSelectWarehouse}
            >
              <Check size={16} /> Прив'язати зі складу
            </ActionButton>
          </div>
        ) : (
          <div>
            <FormGroup>
              <Label>Модель (пошук або створення):</Label>
              <CreatableSelect
                isClearable
                options={dicts?.trackerModels || []}
                value={
                  newTracker.model
                    ? { value: newTracker.model, label: newTracker.model }
                    : null
                }
                onChange={selectedOption =>
                  setNewTracker({
                    ...newTracker,
                    model: selectedOption ? selectedOption.value : '',
                  })
                }
                placeholder="Оберіть або введіть модель..."
                styles={customSelectStyles}
                formatCreateLabel={inputValue => `Створити "${inputValue}"`}
              />
            </FormGroup>

            <Row>
              <div>
                <Label>IMEI:</Label>
                <Input
                  placeholder="Обов'язково"
                  value={newTracker.imei}
                  onChange={e =>
                    setNewTracker({ ...newTracker, imei: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Серійник (S/N):</Label>
                <Input
                  placeholder="Обов'язково"
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

            <FormGroup>
              <Label>SENT ID (Для Європи):</Label>
              <Input
                placeholder="Необов'язкове поле"
                value={newTracker.sent_id}
                onChange={e =>
                  setNewTracker({ ...newTracker, sent_id: e.target.value })
                }
              />
            </FormGroup>

            <ActionButton
              type="button"
              $color="#10b981"
              disabled={
                isLoading ||
                !newTracker.model ||
                !newTracker.imei ||
                !newTracker.serial_number
              }
              onClick={handleCreate}
            >
              <Plus size={16} /> Створити і прив'язати
            </ActionButton>
          </div>
        )}
      </ModalBox>
    </Overlay>
  );
};

// === МОДАЛКА 2: СІМ-КАРТИ ===
export const SimManagerModal = ({ trackerId, dicts, onClose, onSelect }) => {
  const [activeTab, setActiveTab] = useState('warehouse');
  const [inventory, setInventory] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [newSim, setNewSim] = useState({
    phone_number: '',
    iccid: '',
    operator: '',
  });

  useEffect(() => {
    vehiclesApi
      .getInventorySims()
      .then(data => setInventory(data.filter(s => !s.tracker_id)))
      .catch(err => console.error('Помилка завантаження сімок', err));
  }, []);

  const handleSelectWarehouse = async () => {
    setIsLoading(true);
    try {
      await vehiclesApi.assignSimCard(selectedId, trackerId);
      const found = inventory.find(s => String(s.id) === String(selectedId));
      onSelect(found);
      onClose();
    } catch (error) {
      alert("Помилка прив'язки СІМ");
    }
  };

  const handleCreate = async e => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    try {
      const created = await vehiclesApi.createSimCard(newSim);
      await vehiclesApi.assignSimCard(created.id, trackerId);
      onSelect(created);
      onClose();
    } catch (error) {
      alert('Помилка створення СІМ');
    }
  };

  return (
    <Overlay onClick={onClose}>
      <ModalBox onClick={e => e.stopPropagation()}>
        <CloseBtn type="button" onClick={onClose}>
          <X size={20} />
        </CloseBtn>
        <Title>
          <CreditCard size={20} color="#8b5cf6" /> Вставити СІМ-карту
        </Title>
        <Tabs>
          <TabBtn
            type="button"
            $active={activeTab === 'warehouse'}
            onClick={() => setActiveTab('warehouse')}
          >
            Вільні з архіву ({inventory.length})
          </TabBtn>
          <TabBtn
            type="button"
            $active={activeTab === 'new'}
            onClick={() => setActiveTab('new')}
          >
            Нова СІМ
          </TabBtn>
        </Tabs>

        {activeTab === 'warehouse' ? (
          <div>
            <FormGroup>
              <Label>Вільні СІМ-карти:</Label>
              <Select
                value={selectedId}
                onChange={e => setSelectedId(e.target.value)}
              >
                <option value="">-- Оберіть СІМ --</option>
                {inventory.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.phone_number} ({s.operator})
                  </option>
                ))}
              </Select>
            </FormGroup>
            <ActionButton
              type="button"
              $color="#8b5cf6"
              disabled={!selectedId || isLoading}
              onClick={handleSelectWarehouse}
            >
              <Check size={16} /> Прив'язати до трекера
            </ActionButton>
          </div>
        ) : (
          <div>
            <FormGroup>
              <Label>Номер телефону:</Label>
              <Input
                placeholder="+380..."
                value={newSim.phone_number}
                onChange={e =>
                  setNewSim({ ...newSim, phone_number: e.target.value })
                }
              />
            </FormGroup>
            <Row>
              <div>
                <Label>Оператор (пошук або створення):</Label>
                <CreatableSelect
                  isClearable
                  options={dicts?.simOperators || []}
                  value={
                    newSim.operator
                      ? { value: newSim.operator, label: newSim.operator }
                      : null
                  }
                  onChange={selectedOption =>
                    setNewSim({
                      ...newSim,
                      operator: selectedOption ? selectedOption.value : '',
                    })
                  }
                  placeholder="Оберіть..."
                  styles={customSelectStyles}
                  formatCreateLabel={inputValue => `Створити "${inputValue}"`}
                />
              </div>
              <div>
                <Label>ICCID (Серійник СІМ):</Label>
                <Input
                  placeholder="89380..."
                  value={newSim.iccid}
                  onChange={e =>
                    setNewSim({ ...newSim, iccid: e.target.value })
                  }
                />
              </div>
            </Row>
            <ActionButton
              type="button"
              $color="#10b981"
              disabled={isLoading || !newSim.operator || !newSim.phone_number}
              onClick={handleCreate}
            >
              <Plus size={16} /> Створити і Вставити
            </ActionButton>
          </div>
        )}
      </ModalBox>
    </Overlay>
  );
};
