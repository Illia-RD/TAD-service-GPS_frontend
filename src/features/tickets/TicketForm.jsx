import React, { useState, useEffect } from 'react';
import { ticketsApi } from '../../services/ticketsApi';
import { vehiclesApi } from '../../services/vehiclesApi';
import {
  FormWrapper,
  FormGroup,
  Label,
  Input,
  Select,
  Button,
} from './TicketForm.styled';

// Стандартний список робіт (потім можна теж винести в БД)
const STANDARD_TASKS = [
  'Заміна ДВРП',
  'Тарування',
  'Встановлення трекера',
  'Підключення CAN',
  'Відключення',
  'Зняття з трекінгу',
  'Діагностика',
];

export const TicketForm = ({ onTicketAdded, initialData, onCancelEdit }) => {
  const [vehicles, setVehicles] = useState([]);

  // Визначаємо, чи ми зараз в режимі редагування
  const isEditMode = !!initialData;

  // Форматування дати для <input type="date"> (потрібен формат YYYY-MM-DD)
  const formatDateForInput = dateString => {
    if (!dateString) return '';
    return dateString.split('T')[0];
  };

  const initialForm = {
    vehicle_id: initialData?.vehicle_id || '',
    priority: initialData?.priority || 'medium',
    ticket_group: initialData?.ticket_group || 'Механіки',
    planned_at: formatDateForInput(initialData?.planned_at),
    comment: initialData?.comment || '',
  };
  const [formData, setFormData] = useState(initialForm);

  // Стан для задач: тепер це масив ОБ'ЄКТІВ { id, description, is_completed }
  const [selectedTasks, setSelectedTasks] = useState(() => {
    if (initialData?.tasks) {
      return initialData.tasks.map(t => ({
        id: t.id,
        description: t.description,
        is_completed: t.is_completed || false,
      }));
    }
    return [];
  });

  const [taskInput, setTaskInput] = useState('');

  useEffect(() => {
    vehiclesApi.getAll().then(data => setVehicles(data));
  }, []);

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Оновлена логіка додавання задачі (зберігаємо як об'єкт)
  const addTask = taskDesc => {
    const desc = taskDesc.trim();
    // Перевіряємо, чи немає вже задачі з таким текстом
    if (desc && !selectedTasks.find(t => t.description === desc)) {
      setSelectedTasks([
        ...selectedTasks,
        { id: null, description: desc, is_completed: false },
      ]);
    }
    setTaskInput('');
  };

  // Оновлена логіка видалення задачі (тепер по індексу, бо це об'єкти)
  const removeTask = indexToRemove => {
    setSelectedTasks(selectedTasks.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.vehicle_id) return alert('Оберіть авто!');
    if (selectedTasks.length === 0) return alert('Додайте хоча б одну задачу!');

    try {
      const payload = {
        ...formData,
        vehicle_id: parseInt(formData.vehicle_id),
        planned_at: formData.planned_at
          ? new Date(formData.planned_at).toISOString()
          : null,
      };

      if (isEditMode) {
        // РЕДАГУВАННЯ: відправляємо масив об'єктів
        payload.tasks = selectedTasks;
        await ticketsApi.update(initialData.id, payload);
      } else {
        // СТВОРЕННЯ: відправляємо масив рядків (як бекенд чекав раніше)
        payload.tasks = selectedTasks.map(t => t.description);
        await ticketsApi.create(payload);
      }

      onTicketAdded();

      if (isEditMode && onCancelEdit) {
        onCancelEdit(); // Закриваємо модалку редагування
      } else {
        // Очищаємо форму після створення нового тікета
        setFormData({
          vehicle_id: '',
          priority: 'medium',
          ticket_group: 'Механіки',
          planned_at: '',
          comment: '',
        });
        setSelectedTasks([]);
      }
    } catch (err) {
      alert(
        `Помилка при ${isEditMode ? 'оновленні' : 'створенні'}: ` + err.message
      );
    }
  };

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <h3
        style={{
          marginTop: 0,
          borderBottom: '2px solid #e2e8f0',
          paddingBottom: '10px',
        }}
      >
        {isEditMode ? 'Редагування тікета' : 'Новий сервісний тікет'}
      </h3>

      <FormGroup className="full-width">
        <div>
          <Label>Автомобіль</Label>
          <Select
            name="vehicle_id"
            value={formData.vehicle_id}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              -- Оберіть авто --
            </option>
            {vehicles.map(v => (
              <option key={v.id} value={v.id}>
                #{v.internal_id} | {v.plate} ({v.make})
              </option>
            ))}
          </Select>
        </div>
      </FormGroup>

      {/* --- БЛОК ДОДАВАННЯ ЗАДАЧ --- */}
      <FormGroup className="full-width">
        <div
          style={{
            background: '#f8fafc',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
          }}
        >
          <Label>Задачі (Оберіть зі списку або введіть свою)</Label>

          {/* Вибір швидких задач */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              marginBottom: '15px',
            }}
          >
            {STANDARD_TASKS.map(task => (
              <span
                key={task}
                onClick={() => addTask(task)}
                style={{
                  background: 'white',
                  padding: '5px 10px',
                  fontSize: '12px',
                  borderRadius: '15px',
                  border: '1px solid #cbd5e1',
                  cursor: 'pointer',
                }}
              >
                + {task}
              </span>
            ))}
          </div>

          {/* Ввід кастомної задачі */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <Input
              value={taskInput}
              onChange={e => setTaskInput(e.target.value)}
              placeholder="Або впишіть іншу задачу..."
              onKeyPress={e =>
                e.key === 'Enter' && (e.preventDefault(), addTask(taskInput))
              }
            />
            <Button
              type="button"
              onClick={() => addTask(taskInput)}
              style={{ width: 'auto', marginTop: 0 }}
            >
              Додати
            </Button>
          </div>

          {/* Список вибраних задач */}
          {selectedTasks.length > 0 && (
            <ul
              style={{
                marginTop: '15px',
                paddingLeft: '20px',
                color: '#1e293b',
              }}
            >
              {selectedTasks.map((task, idx) => (
                <li key={idx} style={{ marginBottom: '5px' }}>
                  {/* Відображаємо description об'єкта, а не сам об'єкт */}
                  <span
                    style={{
                      textDecoration: task.is_completed
                        ? 'line-through'
                        : 'none',
                      color: task.is_completed ? '#94a3b8' : 'inherit',
                    }}
                  >
                    {task.description}
                  </span>
                  <span
                    onClick={() => removeTask(idx)} // Передаємо індекс на видалення
                    style={{
                      color: 'red',
                      cursor: 'pointer',
                      marginLeft: '10px',
                    }}
                    title="Видалити задачу"
                  >
                    ✖
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </FormGroup>

      <FormGroup>
        <div>
          <Label>Група (Відділ)</Label>
          <Select
            name="ticket_group"
            value={formData.ticket_group}
            onChange={handleChange}
          >
            <option value="GPS">GPS</option>
            <option value="Механіки">Механіки</option>
          </Select>
        </div>
        <div>
          <Label>Пріоритет</Label>
          <Select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="low">Низький</option>
            <option value="medium">Середній</option>
            <option value="high">Високий</option>
            <option value="critical">Критичний</option>
          </Select>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label
            style={{
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#475569',
              display: 'block',
              marginBottom: '4px',
            }}
          >
            Запланована дата робіт (опціонально)
          </label>
          <input
            type="date"
            value={formData.planned_at}
            onChange={e =>
              setFormData({ ...formData, planned_at: e.target.value })
            }
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontFamily: 'inherit',
              color: '#1e293b',
            }}
          />
        </div>
      </FormGroup>

      <FormGroup className="full-width">
        <div>
          <Label>Загальний коментар (об'єми робіт, нюанси)</Label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              minHeight: '80px',
              fontFamily: 'inherit',
            }}
            placeholder="Наприклад: Звернути увагу на проводку біля баку..."
          />
        </div>
      </FormGroup>

      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <Button type="submit" style={{ flex: 1 }}>
          {isEditMode
            ? 'Зберегти зміни'
            : `Створити тікет (${selectedTasks.length} задач)`}
        </Button>

        {isEditMode && (
          <Button
            type="button"
            onClick={onCancelEdit}
            style={{ flex: 1, background: '#94a3b8' }}
          >
            Скасувати
          </Button>
        )}
      </div>
    </FormWrapper>
  );
};
