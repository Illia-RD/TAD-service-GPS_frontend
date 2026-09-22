import React, { useState, useEffect } from 'react';
import { vehiclesApi } from '../../../shared/api/vehiclesApi';
import { VehicleCard } from '../../../entities/Vehicle/ui/VehicleCard';
import { VehicleTable } from '../../../entities/Vehicle/ui/VehicleTable';
import { Button } from '../../../shared/ui/Button/Button';
import {
  PageHeader,
  PageTitle,
  GridContainer,
  EmptyState,
  ControlsGroup,
  ViewToggleGroup,
  ViewToggleBtn,
} from './VehiclesPage.styled';

export const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  const loadVehicles = async () => {
    try {
      setIsLoading(true);
      const data = await vehiclesApi.getAll();
      setVehicles(data);
    } catch (error) {
      console.error('Помилка завантаження авто:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleEdit = vehicle => {
    console.log('Відкриваємо форму редагування для', vehicle.plate);
  };

  const handleDelete = async id => {
    if (!window.confirm('Перемістити авто в корзину?')) return;
    try {
      await vehiclesApi.deleteVehicle(id);
      loadVehicles();
    } catch (error) {
      alert('Помилка видалення');
    }
  };

  if (isLoading)
    return <EmptyState>Завантаження бази автомобілів...</EmptyState>;

  return (
    <div>
      <PageHeader>
        <PageTitle>Всього авто: {vehicles.length}</PageTitle>
        <ControlsGroup>
          <ViewToggleGroup>
            <ViewToggleBtn
              $active={viewMode === 'grid'}
              onClick={() => setViewMode('grid')}
            >
              Картки
            </ViewToggleBtn>
            <ViewToggleBtn
              $active={viewMode === 'table'}
              onClick={() => setViewMode('table')}
            >
              Таблиця
            </ViewToggleBtn>
          </ViewToggleGroup>
          <Button variant="primary">+ Створити авто</Button>
        </ControlsGroup>
      </PageHeader>

      {vehicles.length === 0 ? (
        <EmptyState>Автомобілів ще немає. Створіть перший!</EmptyState>
      ) : viewMode === 'grid' ? (
        <GridContainer>
          {vehicles.map(v => (
            <VehicleCard
              key={v.id}
              vehicle={v}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </GridContainer>
      ) : (
        <VehicleTable
          vehicles={vehicles}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};
