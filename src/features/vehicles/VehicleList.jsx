import React, { useState, useEffect } from 'react';
import { Plus, LayoutGrid, List as ListIcon } from 'lucide-react';
import { VehicleCard } from './VehicleCard';
import { VehicleForm } from './VehicleForm';
import { VehicleModal } from './VehicleModal';
import { VehicleTable } from './VehicleTable';
import { ListWrapper } from './VehicleList.styled';
import { vehiclesApi } from '../../services/vehiclesApi';

export const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ДОДАНО: Стан для збереження авто, яке ми зараз редагуємо
  const [editingVehicle, setEditingVehicle] = useState(null);

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

  // ДОДАНО: Функція для відкриття модалки в режимі редагування
  const handleEdit = vehicle => {
    setEditingVehicle(vehicle);
    setIsModalOpen(true);
  };

  // ДОДАНО: Функція для закриття модалки і очищення стану редагування
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVehicle(null);
  };

  return (
    <>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={() => {
            setEditingVehicle(null); // Якщо натиснули "Створити", скидаємо редагування
            setIsModalOpen(true);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          <Plus size={20} /> Створити
        </button>

        <button
          onClick={() => setViewMode('card')}
          style={{
            padding: '10px',
            cursor: 'pointer',
            background: viewMode === 'card' ? '#e2e8f0' : 'transparent',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
          }}
        >
          <LayoutGrid size={20} />
        </button>
        <button
          onClick={() => setViewMode('table')}
          style={{
            padding: '10px',
            cursor: 'pointer',
            background: viewMode === 'table' ? '#e2e8f0' : 'transparent',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
          }}
        >
          <ListIcon size={20} />
        </button>
      </div>

      <VehicleModal isOpen={isModalOpen} onClose={handleCloseModal}>
        <VehicleForm
          initialData={editingVehicle} // ДОДАНО: передаємо дані у форму
          onCancelEdit={handleCloseModal} // ДОДАНО: кнопка скасування
          onVehicleAdded={() => {
            loadVehicles();
            handleCloseModal();
          }}
        />
      </VehicleModal>

      {viewMode === 'card' ? (
        <ListWrapper>
          {vehicles.map(v => (
            <VehicleCard
              key={v.id}
              vehicle={v}
              onEdit={handleEdit} // ДОДАНО: прокидаємо функцію в картку
            />
          ))}
        </ListWrapper>
      ) : (
        <VehicleTable
          vehicles={vehicles}
          onEdit={handleEdit} // ДОДАНО: прокидаємо функцію в таблицю
        />
      )}
    </>
  );
};
