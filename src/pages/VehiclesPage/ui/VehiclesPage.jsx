import React, { useState, useEffect } from 'react';
import { vehiclesApi } from '@/shared/api/vehiclesApi';
import { VehicleCard } from '@/entities/Vehicle/ui/VehicleCard';
import { VehicleTable } from '@/entities/Vehicle/ui/VehicleTable';
import { Button } from '@/shared/ui/Button/Button';
import { Modal } from '@/shared/ui/Modal/Modal';
import { VehicleForm } from '@/features/VehicleForm/ui/VehicleForm';
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
  const [viewMode, setViewMode] = useState('grid');
  const [error, setError] = useState(null);

  // Стейт для модалки і форми
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const loadVehicles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await vehiclesApi.getAll();
      setVehicles(data || []);
    } catch (err) {
      console.error('Помилка завантаження авто:', err);
      setError(err.response?.data?.detail || "Помилка зв'язку з сервером.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  // Відкриття форми для СТВОРЕННЯ
  const handleCreateClick = () => {
    setEditingVehicle(null); // Пуста форма
    setIsModalOpen(true);
  };

  // Відкриття форми для РЕДАГУВАННЯ
  const handleEditClick = vehicle => {
    setEditingVehicle(vehicle); // Передаємо дані конкретного авто
    setIsModalOpen(true);
  };

  // Відправка даних форми на сервер
  const handleFormSubmit = async formData => {
    try {
      if (formData.id) {
        // Оновлення існуючого
        await vehiclesApi.update(formData.id, formData);
      } else {
        // Створення нового
        await vehiclesApi.create(formData);
      }
      setIsModalOpen(false); // Закриваємо модалку
      loadVehicles(); // Оновлюємо список
    } catch (err) {
      alert(err.response?.data?.detail || 'Помилка збереження автомобіля');
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Перемістити авто в корзину?')) return;
    try {
      await vehiclesApi.deleteVehicle(id);
      loadVehicles();
    } catch (err) {
      alert('Помилка видалення');
    }
  };

  if (isLoading)
    return <EmptyState>Завантаження бази автомобілів...</EmptyState>;
  if (error)
    return <EmptyState style={{ color: '#ef4444' }}>❌ {error}</EmptyState>;

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
          {/* ТУТ ПРИВ'ЯЗАЛИ КЛІК */}
          <Button variant="primary" onClick={handleCreateClick}>
            + Створити авто
          </Button>
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
              onEdit={handleEditClick}
              onDelete={handleDelete}
            />
          ))}
        </GridContainer>
      ) : (
        <VehicleTable
          vehicles={vehicles}
          onEdit={handleEditClick}
          onDelete={handleDelete}
        />
      )}

      {/* РЕНДЕР МОДАЛКИ */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <VehicleForm
            initialData={editingVehicle}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
};
