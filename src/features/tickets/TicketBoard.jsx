import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { ticketsApi } from '../../services/ticketsApi';
import { vehiclesApi } from '../../services/vehiclesApi';
import { TicketCard } from './TicketCard';
import { TicketForm } from './TicketForm';
import { VehicleModal as Modal } from '../vehicles/VehicleModal';
import { Board } from '../../components/Kanban/Board';
import { Column } from '../../components/Kanban/Column';

const COLUMNS = [
  { id: 'queue', title: 'В черзі' },
  { id: 'planned', title: 'Заплановано' },
  { id: 'in_progress', title: 'В роботі' },
  { id: 'done', title: 'Виконано' },
];

export const TicketBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const loadData = async () => {
    try {
      const [ticketsData, vehiclesData] = await Promise.all([
        ticketsApi.getAll(),
        vehiclesApi.getAll(),
      ]);
      setTickets(ticketsData);
      setVehicles(vehiclesData);
    } catch (error) {
      console.error('Помилка завантаження даних дошки:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ФУНКЦІЯ ОНОВЛЕННЯ СТАТУСУ
  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await ticketsApi.updateStatus(ticketId, newStatus);
      // Просто перетягуємо дані заново, щоб дошка оновилася
      loadData();
    } catch (error) {
      alert('Помилка при зміні статусу: ' + error.message);
    }
  };

  return (
    <>
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: '#f97316',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          <Plus size={20} /> Створити задачу
        </button>
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      >
        <TicketForm
          onTicketAdded={() => {
            loadData();
            setIsCreateModalOpen(false);
          }}
        />
      </Modal>

      <Board>
        {COLUMNS.map(col => {
          const columnTickets = tickets.filter(t => t.status === col.id);

          return (
            <Column
              key={col.id}
              id={col.id} // Обов'язково передаємо ID колонки!
              title={col.title}
              count={columnTickets.length}
              onDrop={handleStatusChange} // Передаємо функцію оновлення статусу
            >
              {columnTickets.map(ticket => {
                const vehicle = vehicles.find(v => v.id === ticket.vehicle_id);
                return (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    vehicle={vehicle}
                    onStatusChange={handleStatusChange}
                  />
                );
              })}
            </Column>
          );
        })}
      </Board>
    </>
  );
};
