import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  CardContainer,
  CardHeader,
  BadgeGroup,
  Badge,
  CardTitle,
  CardFooter,
} from './Ticket.styled';
import { ticketsApi } from '../../services/ticketsApi'; // Додаємо імпорт API

const priorityColors = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#3b82f6',
  low: '#94a3b8',
};

export const TicketCard = ({ ticket, vehicle, onStatusChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const pColor = priorityColors[ticket.priority] || priorityColors.medium;

  // Локальний стан для задач, щоб чекбокси реагували миттєво
  const [localTasks, setLocalTasks] = useState(ticket.tasks || []);

  useEffect(() => {
    setLocalTasks(ticket.tasks || []);
  }, [ticket.tasks]);

  const handleStatusSelect = e => {
    e.stopPropagation();
    onStatusChange(ticket.id, e.target.value);
  };

  // МАГІЯ ЧЕКБОКСІВ
  const handleTaskToggle = async taskId => {
    // 1. Миттєво міняємо галочку на екрані (Оптимістичний UI)
    setLocalTasks(prev =>
      prev.map(t =>
        t.id === taskId ? { ...t, is_completed: !t.is_completed } : t
      )
    );

    // 2. Відправляємо запит на сервер
    try {
      await ticketsApi.toggleTask(taskId);
    } catch (error) {
      alert('Помилка оновлення задачі');
      setLocalTasks(ticket.tasks || []); // Якщо помилка, повертаємо як було
    }
  };

  return (
    <CardContainer
      priorityColor={pColor}
      draggable="true"
      onDragStart={e => e.dataTransfer.setData('ticketId', ticket.id)}
    >
      {' '}
      <CardHeader>
        <span style={{ fontWeight: '500' }}>
          #{ticket.id} | {ticket.created_at}
        </span>
        <select
          value={ticket.status}
          onChange={handleStatusSelect}
          style={{
            fontSize: '11px',
            padding: '3px 6px',
            borderRadius: '4px',
            border: '1px solid #cbd5e1',
            background: '#f8fafc',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          <option value="queue">В черзі</option>
          <option value="planned">Заплановано</option>
          <option value="in_progress">В роботі</option>
          <option value="done">Виконано</option>
        </select>
      </CardHeader>
      <BadgeGroup>
        <Badge bg="#dbeafe" color="#1d4ed8">
          {vehicle
            ? `#${vehicle.internal_id} | ${vehicle.plate}`
            : 'Авто не знайдено'}
        </Badge>
        <Badge bg="#fef3c7" color="#b45309">
          {ticket.ticket_group}
        </Badge>
      </BadgeGroup>
      <CardTitle>{ticket.title}</CardTitle>
      {isExpanded && (
        <div
          style={{
            marginTop: '12px',
            paddingTop: '12px',
            borderTop: '1px dashed #cbd5e1',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {/* СПИСОК РОБІТ З АКТИВНИМИ ЧЕКБОКСАМИ */}
          {localTasks.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: '10px',
                  color: '#64748b',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  marginBottom: '6px',
                  letterSpacing: '0.5px',
                }}
              >
                Список робіт:
              </div>
              <ul
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: 'none',
                  fontSize: '12px',
                  color: '#1e293b',
                }}
              >
                {localTasks.map(t => (
                  <li
                    key={t.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      marginBottom: '6px',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={t.is_completed}
                      onChange={() => handleTaskToggle(t.id)} // Прикрутили виклик
                      style={{ margin: '2px 0 0 0', cursor: 'pointer' }}
                    />
                    <span
                      onClick={() => handleTaskToggle(t.id)} // Зробили клікабельним і сам текст
                      style={{
                        textDecoration: t.is_completed
                          ? 'line-through'
                          : 'none',
                        color: t.is_completed ? '#94a3b8' : '#1e293b',
                        lineHeight: '1.4',
                        cursor: 'pointer',
                      }}
                    >
                      {t.description}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* КОМЕНТАР */}
          {ticket.comment && (
            <div>
              <div
                style={{
                  fontSize: '10px',
                  color: '#64748b',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  marginBottom: '6px',
                  letterSpacing: '0.5px',
                }}
              >
                Коментар:
              </div>
              <div
                style={{
                  background: '#fffbeb',
                  padding: '10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#92400e',
                  whiteSpace: 'pre-wrap',
                  border: '1px solid #fde68a',
                  lineHeight: '1.4',
                }}
              >
                {ticket.comment}
              </div>
            </div>
          )}

          {localTasks.length === 0 && !ticket.comment && (
            <div
              style={{
                fontSize: '12px',
                color: '#94a3b8',
                fontStyle: 'italic',
                textAlign: 'center',
                padding: '10px 0',
              }}
            >
              Додаткової інформації немає
            </div>
          )}
          {/* ДАТИ (План, Старт, Фініш) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              fontSize: '10px',
              color: '#64748b',
              background: '#f8fafc',
              padding: '8px',
              borderRadius: '6px',
            }}
          >
            <div>
              План: <strong>{ticket.planned_at || '—'}</strong>
            </div>
            <div>
              Створено: <strong>{ticket.created_at}</strong>
            </div>
            <div>
              Початок: <strong>{ticket.started_at || '—'}</strong>
            </div>
            <div>
              Закрито: <strong>{ticket.finished_at || '—'}</strong>
            </div>
          </div>
        </div>
      )}
      <CardFooter
        style={{
          marginTop: '12px',
          alignItems: 'center',
          borderTop: 'none',
          paddingTop: 0,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontWeight: '800', fontSize: '10px', color: pColor }}>
            {ticket.priority.toUpperCase()}
          </span>
          {ticket.planned_at && (
            <span style={{ fontSize: '10px', color: '#64748b' }}>
              План: {new Date(ticket.planned_at).toLocaleDateString('uk-UA')}
            </span>
          )}
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: isExpanded ? '#e2e8f0' : '#f1f5f9',
            border: 'none',
            padding: '6px 10px',
            borderRadius: '6px',
            color: '#3b82f6',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 'bold',
            transition: 'all 0.2s',
          }}
        >
          {isExpanded ? (
            <>
              <ChevronUp size={14} /> Згорнути
            </>
          ) : (
            <>
              <ChevronDown size={14} /> Деталі
            </>
          )}
        </button>
      </CardFooter>
    </CardContainer>
  );
};
