import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, LayoutGrid, List as ListIcon } from 'lucide-react';
import { VehicleCard } from './VehicleCard';
import { VehicleForm } from './VehicleForm';
import { VehicleModal } from './VehicleModal';
import { VehicleTable } from './VehicleTable'; // Переконайся, що цей файл існує
import { ListWrapper } from './VehicleList.styled';

export const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('card'); // 'card' або 'table'

  const loadVehicles = () => {
    axios
      .get('http://127.0.0.1:8000/api/vehicles/')
      .then(res => setVehicles(res.data))
      .catch(err => console.error('Помилка при завантаженні авто:', err));
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  return (
    <>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={() => setIsModalOpen(true)}
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
          style={{ padding: '10px', cursor: 'pointer' }}
        >
          <LayoutGrid size={20} />
        </button>
        <button
          onClick={() => setViewMode('table')}
          style={{ padding: '10px', cursor: 'pointer' }}
        >
          <ListIcon size={20} />
        </button>
      </div>

      <VehicleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <VehicleForm
          onVehicleAdded={() => {
            loadVehicles();
            setIsModalOpen(false);
          }}
        />
      </VehicleModal>

      {viewMode === 'card' ? (
        <ListWrapper>
          {vehicles.map(v => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </ListWrapper>
      ) : (
        <VehicleTable vehicles={vehicles} />
      )}
    </>
  );
};
