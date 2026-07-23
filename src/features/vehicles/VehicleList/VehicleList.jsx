import React, { useState, useEffect } from 'react';
import { Plus, LayoutGrid, List as ListIcon } from 'lucide-react';
import { VehicleCard } from '../VehicleCard/VehicleCard';
import { VehicleForm } from '../VehicleForm/VehicleForm';
import { VehicleModal } from '../VehicleModal/VehicleModal';
import { VehicleTable } from '../VehicleTable/VehicleTable';
import {
  ListWrapper,
  ControlsContainer,
  CreateButton,
  ViewModeButton,
} from './VehicleList.styled';
import { vehiclesApi } from '../../services/vehiclesApi';

export const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  // Новий стан для відстеження, чи ввів користувач якісь дані у форму
  const [isFormDirty, setIsFormDirty] = useState(false);

  const [viewMode, setViewMode] = useState(() => {
    return window.innerWidth >= 1024 ? 'table' : 'card';
  });

  const loadVehicles = () => {
    vehiclesApi
      .getAll()
      .then(data => setVehicles(data))
      .catch(err => console.error('Помилка при завантаженні авто:', err));
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleEdit = vehicle => {
    setEditingVehicle(vehicle);
    setIsFormDirty(false); // При відкритті форма чиста
    setIsModalOpen(true);
  };

  // Розумне закриття модалки
  const handleCloseModal = () => {
    if (isFormDirty) {
      const confirmClose = window.confirm(
        'У вас є незбережені дані. Ви впевнені, що хочете закрити форму? Всі зміни буде втрачено.'
      );
      if (!confirmClose) return; // Якщо користувач натиснув "Скасувати", не закриваємо
    }
    setIsModalOpen(false);
    setEditingVehicle(null);
    setIsFormDirty(false);
  };

  return (
    <>
      <ControlsContainer>
        <CreateButton
          onClick={() => {
            setEditingVehicle(null);
            setIsFormDirty(false);
            setIsModalOpen(true);
          }}
        >
          <Plus size={20} /> Створити
        </CreateButton>

        <ViewModeButton
          $active={viewMode === 'card'}
          onClick={() => setViewMode('card')}
        >
          <LayoutGrid size={20} />
        </ViewModeButton>
        <ViewModeButton
          $active={viewMode === 'table'}
          onClick={() => setViewMode('table')}
        >
          <ListIcon size={20} />
        </ViewModeButton>
      </ControlsContainer>

      <VehicleModal isOpen={isModalOpen} onClose={handleCloseModal}>
        <VehicleForm
          initialData={editingVehicle}
          onCancelEdit={handleCloseModal}
          onVehicleAdded={() => {
            loadVehicles();
            // Якщо авто успішно додано/оновлено, скидаємо стан "брудної" форми
            setIsFormDirty(false);
            setIsModalOpen(false);
            setEditingVehicle(null);
          }}
          // Передаємо функцію, щоб форма могла повідомляти списку, що дані змінилися
          onFormDirty={status => setIsFormDirty(status)}
        />
      </VehicleModal>

      {viewMode === 'card' ? (
        <ListWrapper>
          {vehicles.map(v => (
            <VehicleCard key={v.id} vehicle={v} onEdit={handleEdit} />
          ))}
        </ListWrapper>
      ) : (
        <VehicleTable vehicles={vehicles} onEdit={handleEdit} />
      )}
    </>
  );
};
