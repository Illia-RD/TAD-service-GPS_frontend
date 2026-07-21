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
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ДОДАНО: Стан для тікета, який зараз редагується
  const [editingTicket, setEditingTicket] = useState(null);

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

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await ticketsApi.updateStatus(ticketId, newStatus);
      loadData();
    } catch (error) {
      alert('Помилка при зміні статусу: ' + error.message);
    }
  };

  // ДОДАНО: Функція для відкриття модалки в режимі редагування
  const handleEdit = ticket => {
    setEditingTicket(ticket);
    setIsModalOpen(true);
  };

  // ДОДАНО: Функція для закриття модалки і очищення стану
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTicket(null);
  };

  return (
    <>
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => {
            setEditingTicket(null); // Скидаємо стан редагування при створенні нового
            setIsModalOpen(true);
          }}
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

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <TicketForm
          initialData={editingTicket} // ДОДАНО: Передаємо дані тікета у форму
          onCancelEdit={handleCloseModal} // ДОДАНО: Кнопка "Скасувати" з форми закриє модалку
          onTicketAdded={() => {
            loadData();
            handleCloseModal();
          }}
        />
      </Modal>

      <Board>
        {COLUMNS.map(col => {
          const columnTickets = tickets.filter(t => t.status === col.id);

          return (
            <Column
              key={col.id}
              id={col.id}
              title={col.title}
              count={columnTickets.length}
              onDrop={handleStatusChange}
            >
              {columnTickets.map(ticket => {
                const vehicle = vehicles.find(v => v.id === ticket.vehicle_id);
                return (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    vehicle={vehicle}
                    onStatusChange={handleStatusChange}
                    onEdit={handleEdit} // ДОДАНО: Передаємо функцію редагування в картку
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
