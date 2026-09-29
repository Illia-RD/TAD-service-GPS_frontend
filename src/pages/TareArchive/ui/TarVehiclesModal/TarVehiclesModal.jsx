import React, { useState, useEffect } from 'react';
import { Modal } from '@/shared/ui/Modal/Modal'; // Перевір шлях
import { tareApi } from '@/shared/api/tareApi';
import {
  VehiclesList,
  VehicleItem,
  VehiclePlate,
  TankInfo,
  EmptyState,
} from './TarVehiclesModal.styled';

export const TarVehiclesModal = ({ fileId, onClose }) => {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await tareApi.getLinkedVehicles(fileId);
        setVehicles(data);
      } catch (error) {
        console.error('Помилка завантаження списку авто:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVehicles();
  }, [fileId]);

  return (
    <Modal onClose={onClose}>
      <h3 style={{ marginBottom: '20px' }}>Прив'язані автомобілі</h3>

      {isLoading ? (
        <EmptyState>Завантаження...</EmptyState>
      ) : vehicles.length === 0 ? (
        <EmptyState>
          Цей ТАР-файл наразі не встановлено на жодне авто.
        </EmptyState>
      ) : (
        <VehiclesList>
          {vehicles.map((v, idx) => (
            <VehicleItem key={idx}>
              <VehiclePlate>Авто: {v.plate}</VehiclePlate>
              <TankInfo>ID Бака: {v.tank_id}</TankInfo>
            </VehicleItem>
          ))}
        </VehiclesList>
      )}
    </Modal>
  );
};
