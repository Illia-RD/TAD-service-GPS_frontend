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
import { vehiclesApi } from '../../../services/vehiclesApi';

export const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

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
    setIsFormDirty(false);
    setIsModalOpen(true);
  };

  // --- НОВА ФУНКЦІЯ: ВИДАЛЕННЯ АВТО ---
  const handleDeleteVehicle = async id => {
    const confirmDelete = window.confirm(
      'Ви впевнені, що хочете видалити цей автомобіль? Він буде переміщений у корзину.'
    );
    if (!confirmDelete) return;

    try {
      await vehiclesApi.deleteVehicle(id);
      // Після успішного видалення просто перевантажуємо список
      loadVehicles();
    } catch (error) {
      console.error('Помилка при видаленні авто:', error);
      alert('Виникла помилка при видаленні. Перевірте консоль.');
    }
  };

  const handleCloseModal = () => {
    if (isFormDirty) {
      const confirmClose = window.confirm(
        'У вас є незбережені дані. Ви впевнені, що хочете закрити форму? Всі зміни буде втрачено.'
      );
      if (!confirmClose) return;
    }
    setIsModalOpen(false);
    setEditingVehicle(null);
    setIsFormDirty(false);
  };

  const handleSaveVehicle = async formData => {
    try {
      if (editingVehicle?.id) {
        await vehiclesApi.update(editingVehicle.id, formData);
      } else {
        await vehiclesApi.create(formData);
      }
      loadVehicles();
      setIsFormDirty(false);
      setIsModalOpen(false);
      setEditingVehicle(null);
    } catch (error) {
      console.error('Помилка при збереженні авто:', error);
      alert('Виникла помилка при збереженні. Перевірте консоль.');
    }
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

        <div style={{ display: 'flex', gap: '4px' }}>
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
        </div>
      </ControlsContainer>

      <VehicleModal isOpen={isModalOpen} onClose={handleCloseModal}>
        <VehicleForm
          initialData={editingVehicle}
          onSubmit={handleSaveVehicle}
          onCancelEdit={handleCloseModal}
          onFormDirty={status => setIsFormDirty(status)}
        />
      </VehicleModal>

      {viewMode === 'card' ? (
        <ListWrapper>
          {vehicles.map(v => (
            <VehicleCard
              key={v.id}
              vehicle={v}
              onEdit={handleEdit}
              onDelete={handleDeleteVehicle} /* Прокидаємо функцію */
            />
          ))}
        </ListWrapper>
      ) : (
        <VehicleTable
          vehicles={vehicles}
          onEdit={handleEdit}
          onDelete={handleDeleteVehicle} /* Прокидаємо функцію */
        />
      )}
    </>
  );
};
